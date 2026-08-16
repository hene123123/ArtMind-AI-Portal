const express = require('express');
const Painting = require('../models/Painting');
const { authenticate, requireAdmin, optionalAuth } = require('../middleware/auth');
const { buildPaintingFilter, paginateQuery } = require('../utils/queryHelpers');
const { getSimilarPaintings } = require('../utils/recommendationService');
const { generatePaintingSummary, generatePaintingTags, isGeminiConfigured } = require('../utils/gemini');
const { generatePdfBuffer, generateDocxBuffer } = require('../utils/exportService');
const { trackEvent } = require('../utils/analyticsService');

const router = express.Router();

async function resolveSummary(painting, regenerate = false) {
  if (painting.ai_summary && !regenerate) {
    return { summary: painting.ai_summary, cached: true };
  }

  const summary = await generatePaintingSummary(painting);
  painting.ai_summary = summary;
  await painting.save();
  return { summary, cached: false };
}

router.get('/', optionalAuth, async (req, res) => {
  try {
    const filter = buildPaintingFilter(req.query);
    const result = await paginateQuery(Painting, filter, req.query);

    return res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('List paintings error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi lấy danh sách tranh' });
  }
});

router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const painting = await Painting.create(req.body);
    return res.status(201).json({ success: true, data: painting });
  } catch (error) {
    console.error('Create painting error:', error);
    return res.status(400).json({ success: false, message: error.message || 'Lỗi tạo tranh' });
  }
});

router.post('/auto-tag/all', authenticate, requireAdmin, async (req, res) => {
  try {
    const paintings = await Painting.find();
    const results = [];

    for (const painting of paintings) {
      const tags = await generatePaintingTags(painting);
      painting.ai_tags = tags;
      await painting.save();
      results.push({ id: painting.id, ai_tags: tags });
    }

    return res.json({ success: true, total: results.length, data: results });
  } catch (error) {
    console.error('Batch auto-tag error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi batch AI auto-tagging' });
  }
});

router.get('/:id/similar', async (req, res) => {
  try {
    const painting = await Painting.findOne({ id: req.params.id });
    if (!painting) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tranh' });
    }

    const similar = await getSimilarPaintings(painting, Number(req.query.limit) || 6);
    return res.json({ success: true, data: similar, source: painting.id });
  } catch (error) {
    console.error('Similar paintings error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi lấy tranh tương tự' });
  }
});

router.get('/:id/summary', async (req, res) => {
  try {
    const painting = await Painting.findOne({ id: req.params.id });
    if (!painting) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tranh' });
    }

    const { summary, cached } = await resolveSummary(painting, req.query.regenerate === 'true');

    return res.json({
      success: true,
      data: { summary, cached },
      ai_mode: isGeminiConfigured() ? 'gemini' : 'local_fallback'
    });
  } catch (error) {
    console.error('AI summary error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi sinh AI summary' });
  }
});

router.get('/:id/export/pdf', async (req, res) => {
  try {
    const painting = await Painting.findOne({ id: req.params.id });
    if (!painting) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tranh' });
    }

    const { summary } = await resolveSummary(painting);

    const buffer = await generatePdfBuffer(painting, summary);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="ArtMind_${painting.id}.pdf"`);
    return res.send(buffer);
  } catch (error) {
    console.error('Export PDF error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi xuất PDF' });
  }
});

router.get('/:id/export/docx', async (req, res) => {
  try {
    const painting = await Painting.findOne({ id: req.params.id });
    if (!painting) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tranh' });
    }

    const { summary } = await resolveSummary(painting);

    const buffer = await generateDocxBuffer(painting, summary);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="ArtMind_${painting.id}.docx"`);
    return res.send(buffer);
  } catch (error) {
    console.error('Export DOCX error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi xuất Word' });
  }
});

router.post('/:id/view', optionalAuth, async (req, res) => {
  try {
    const painting = await Painting.findOne({ id: req.params.id });
    if (!painting) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tranh' });
    }

    const updated = await trackEvent({
      userId: req.user?._id || null,
      eventType: 'view',
      paintingId: painting.id
    });

    if (req.user) {
      req.user.recentlyViewed = [
        { paintingId: painting.id, viewedAt: new Date() },
        ...req.user.recentlyViewed.filter((item) => item.paintingId !== painting.id)
      ].slice(0, 20);
      await req.user.save();
    }

    return res.json({ success: true, data: updated || painting });
  } catch (error) {
    console.error('Track view error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi ghi nhận lượt xem' });
  }
});

router.post('/:id/auto-tag', authenticate, requireAdmin, async (req, res) => {
  try {
    const painting = await Painting.findOne({ id: req.params.id });
    if (!painting) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tranh' });
    }

    const tags = await generatePaintingTags(painting);
    painting.ai_tags = tags;
    await painting.save();

    return res.json({
      success: true,
      data: { id: painting.id, ai_tags: tags },
      ai_mode: isGeminiConfigured() ? 'gemini' : 'local_fallback'
    });
  } catch (error) {
    console.error('Auto-tag error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi AI auto-tagging' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const painting = await Painting.findOne({ id: req.params.id });
    if (!painting) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tranh' });
    }

    return res.json({ success: true, data: painting });
  } catch (error) {
    console.error('Get painting error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi lấy chi tiết tranh' });
  }
});

router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const painting = await Painting.findOneAndUpdate({ id: req.params.id }, req.body, {
      new: true,
      runValidators: true
    });

    if (!painting) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tranh' });
    }

    return res.json({ success: true, data: painting });
  } catch (error) {
    console.error('Update painting error:', error);
    return res.status(400).json({ success: false, message: error.message || 'Lỗi cập nhật tranh' });
  }
});

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const painting = await Painting.findOneAndDelete({ id: req.params.id });
    if (!painting) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tranh' });
    }

    return res.json({ success: true, message: 'Đã xóa tranh thành công' });
  } catch (error) {
    console.error('Delete painting error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi xóa tranh' });
  }
});

module.exports = router;
