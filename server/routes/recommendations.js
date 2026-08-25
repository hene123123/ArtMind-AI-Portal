const express = require('express');
const { optionalAuth } = require('../middleware/auth');
const {
  getRecommendationsForUser,
  getGeneralRecommendations,
  getTrendingPaintings
} = require('../utils/recommendationService');

const router = express.Router();

router.get('/', optionalAuth, async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 12;
    const result = req.user
      ? await getRecommendationsForUser(req.user, limit)
      : await getGeneralRecommendations(limit);

    return res.json({
      success: true,
      personalized: Boolean(req.user),
      ...result
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi lấy gợi ý tranh' });
  }
});

router.get('/trending', async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const data = await getTrendingPaintings(limit);
    return res.json({ success: true, data });
  } catch (error) {
    console.error('Trending recommendations error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi lấy tranh trending' });
  }
});

module.exports = router;
