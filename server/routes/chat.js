const express = require('express');
const Painting = require('../models/Painting');
const { extractSearchFilters, generateChatReply, isGeminiConfigured } = require('../utils/gemini');
const { buildPaintingFilter, paginateQuery } = require('../utils/queryHelpers');
const { optionalAuth } = require('../middleware/auth');
const { trackEvent } = require('../utils/analyticsService');

const router = express.Router();

function formatPaintingsForPrompt(paintings) {
  return paintings.slice(0, 8).map((p, index) =>
    `${index + 1}. [${p.id}] ${p.title} - ${p.artist} (${p.style}, ${p.category}, ${p.medium})`
  ).join('\n');
}

async function findPaintingsFromMessage(message) {
  try {
    const extracted = await extractSearchFilters(message);
    const filter = {};

    if (extracted.style) filter.style = { $regex: extracted.style, $options: 'i' };
    if (extracted.category) filter.category = { $regex: extracted.category, $options: 'i' };
    if (extracted.color_theme) filter.color_theme = { $regex: extracted.color_theme, $options: 'i' };
    if (extracted.medium) filter.medium = { $regex: extracted.medium, $options: 'i' };
    if (extracted.artist) filter.artist = { $regex: extracted.artist, $options: 'i' };

    if (extracted.keyword) {
      filter.$or = [
        { title: { $regex: extracted.keyword, $options: 'i' } },
        { description: { $regex: extracted.keyword, $options: 'i' } },
        { ai_tags: { $regex: extracted.keyword, $options: 'i' } }
      ];
    }

    if (Object.keys(filter).length === 0) {
      const fallback = await paginateQuery(Painting, buildPaintingFilter({ q: message }), { limit: 6 });
      return { paintings: fallback.data, extracted };
    }

    const result = await paginateQuery(Painting, filter, { limit: 8 });
    return { paintings: result.data, extracted };
  } catch (error) {
    const fallback = await paginateQuery(Painting, buildPaintingFilter({ q: message }), { limit: 6 });
    return { paintings: fallback.data, extracted: {} };
  }
}

router.post('/', optionalAuth, async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Vui lòng gửi tin nhắn!' });
    }

    const { paintings, extracted } = await findPaintingsFromMessage(message);
    const paintingContext = paintings.length
      ? formatPaintingsForPrompt(paintings)
      : 'Không tìm thấy tranh phù hợp trong cơ sở dữ liệu.';

    const responseText = await generateChatReply(message, history, paintingContext, paintings);

    await trackEvent({
      userId: req.user?._id || null,
      eventType: 'search',
      keyword: message,
      metadata: { source: 'chatbot', extracted }
    });

    return res.json({
      success: true,
      reply: responseText,
      suggested_paintings: paintings,
      ai_extracted: extracted,
      ai_mode: isGeminiConfigured() ? 'gemini' : 'local_fallback'
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi xử lý AI Chatbot' });
  }
});

module.exports = router;
