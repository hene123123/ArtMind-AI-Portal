const express = require('express');
const { optionalAuth, authenticate } = require('../middleware/auth');
const {
  trackEvent,
  getTrendingPaintings,
  getTrendReport,
  getPersonalInsights
} = require('../utils/analyticsService');

const router = express.Router();

router.post('/track', optionalAuth, async (req, res) => {
  try {
    const { eventType, paintingId, keyword, metadata } = req.body;

    if (!eventType) {
      return res.status(400).json({ success: false, message: 'eventType là bắt buộc' });
    }

    const result = await trackEvent({
      userId: req.user?._id || null,
      eventType,
      paintingId,
      keyword,
      metadata
    });

    return res.json({ success: true, data: result });
  } catch (error) {
    console.error('Track analytics error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi ghi nhận analytics' });
  }
});

router.get('/trending', async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const data = await getTrendingPaintings(limit);
    return res.json({ success: true, data });
  } catch (error) {
    console.error('Analytics trending error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi lấy tranh trending' });
  }
});

router.get('/trends', async (req, res) => {
  try {
    const data = await getTrendReport();
    return res.json({ success: true, data });
  } catch (error) {
    console.error('Trend report error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi lấy báo cáo xu hướng' });
  }
});

router.get('/insights', authenticate, async (req, res) => {
  try {
    const data = await getPersonalInsights(req.user);
    return res.json({ success: true, data });
  } catch (error) {
    console.error('Insights error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi lấy insights cá nhân hóa' });
  }
});

module.exports = router;
