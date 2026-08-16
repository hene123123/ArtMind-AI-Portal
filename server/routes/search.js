const express = require('express');
const Painting = require('../models/Painting');
const { buildPaintingFilter, paginateQuery } = require('../utils/queryHelpers');
const { extractSearchFilters, isGeminiConfigured } = require('../utils/gemini');
const { trackEvent } = require('../utils/analyticsService');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', optionalAuth, async (req, res) => {
  try {
    const filter = buildPaintingFilter(req.query);
    const result = await paginateQuery(Painting, filter, req.query);

    if (req.query.q) {
      await trackEvent({
        userId: req.user?._id || null,
        eventType: 'search',
        keyword: req.query.q
      });
    }

    return res.json({ success: true, ...result });
  } catch (error) {
    console.error('Regular search error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi tìm kiếm' });
  }
});

router.post('/smart', optionalAuth, async (req, res) => {
  try {
    const { query, page, limit, sort } = req.body;

    if (!query) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập câu tìm kiếm!' });
    }

    const extractedFilters = await extractSearchFilters(query);
    const mongoQuery = {};

    if (extractedFilters.style) mongoQuery.style = { $regex: extractedFilters.style, $options: 'i' };
    if (extractedFilters.category) mongoQuery.category = { $regex: extractedFilters.category, $options: 'i' };
    if (extractedFilters.color_theme) mongoQuery.color_theme = { $regex: extractedFilters.color_theme, $options: 'i' };
    if (extractedFilters.medium) mongoQuery.medium = { $regex: extractedFilters.medium, $options: 'i' };
    if (extractedFilters.artist) mongoQuery.artist = { $regex: extractedFilters.artist, $options: 'i' };

    if (extractedFilters.keyword) {
      const keyword = extractedFilters.keyword;
      mongoQuery.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { ai_tags: { $regex: keyword, $options: 'i' } }
      ];
    }

    const result = await paginateQuery(Painting, mongoQuery, { page, limit, sort });

    await trackEvent({
      userId: req.user?._id || null,
      eventType: 'search',
      keyword: query,
      metadata: extractedFilters
    });

    return res.json({
      success: true,
      ai_extracted: extractedFilters,
      ai_mode: isGeminiConfigured() ? 'gemini' : 'local_fallback',
      ...result
    });
  } catch (error) {
    console.error('Smart search error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi xử lý AI Smart Search' });
  }
});

module.exports = router;
