const express = require('express');
const Painting = require('../models/Painting');
const { authenticate } = require('../middleware/auth');
const {
  getRecommendationsForUser,
  getCuratedCollections
} = require('../utils/recommendationService');
const { trackEvent } = require('../utils/analyticsService');

const router = express.Router();

router.use(authenticate);

async function getFavoritePaintings(user) {
  const ids = user.favorites.map((item) => item.paintingId);
  return ids.length ? Painting.find({ id: { $in: ids } }) : [];
}

async function getRecentPaintings(user) {
  const ids = user.recentlyViewed.map((item) => item.paintingId);
  if (!ids.length) return [];

  const paintings = await Painting.find({ id: { $in: ids } });
  const map = new Map(paintings.map((p) => [p.id, p]));
  return ids.map((id) => map.get(id)).filter(Boolean);
}

router.get('/me/recent', async (req, res) => {
  try {
    const data = await getRecentPaintings(req.user);
    return res.json({ success: true, data });
  } catch (error) {
    console.error('Recent list error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi lấy lịch sử xem' });
  }
});

router.post('/me/recent/:paintingId', async (req, res) => {
  try {
    const painting = await Painting.findOne({ id: req.params.paintingId });
    if (!painting) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tranh' });
    }

    req.user.recentlyViewed = [
      { paintingId: painting.id, viewedAt: new Date() },
      ...req.user.recentlyViewed.filter((item) => item.paintingId !== painting.id)
    ].slice(0, 20);
    await req.user.save();

    await trackEvent({
      userId: req.user._id,
      eventType: 'view',
      paintingId: painting.id
    });

    return res.json({ success: true, message: 'Đã cập nhật lịch sử xem' });
  } catch (error) {
    console.error('Add recent error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi cập nhật lịch sử xem' });
  }
});

router.get('/me/favorites', async (req, res) => {
  try {
    const data = await getFavoritePaintings(req.user);
    return res.json({ success: true, data });
  } catch (error) {
    console.error('Favorites list error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi lấy danh sách yêu thích' });
  }
});

router.post('/me/favorites/:paintingId', async (req, res) => {
  try {
    const painting = await Painting.findOne({ id: req.params.paintingId });
    if (!painting) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tranh' });
    }

    const exists = req.user.favorites.some((item) => item.paintingId === painting.id);
    if (!exists) {
      req.user.favorites.unshift({ paintingId: painting.id, addedAt: new Date() });
      if (!req.user.favoriteCategories.includes(painting.category)) {
        req.user.favoriteCategories.push(painting.category);
      }
      await req.user.save();
    }

    await trackEvent({
      userId: req.user._id,
      eventType: 'favorite',
      paintingId: painting.id
    });

    return res.json({ success: true, message: 'Đã thêm vào yêu thích' });
  } catch (error) {
    console.error('Add favorite error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi thêm yêu thích' });
  }
});

router.delete('/me/favorites/:paintingId', async (req, res) => {
  try {
    req.user.favorites = req.user.favorites.filter((item) => item.paintingId !== req.params.paintingId);
    await req.user.save();
    return res.json({ success: true, message: 'Đã xóa khỏi yêu thích' });
  } catch (error) {
    console.error('Remove favorite error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi xóa yêu thích' });
  }
});

router.get('/me/recommendations', async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 12;
    const result = await getRecommendationsForUser(req.user, limit);
    return res.json({ success: true, ...result });
  } catch (error) {
    console.error('Personal recommendations error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi lấy gợi ý cá nhân hóa' });
  }
});

router.get('/me/collections', async (req, res) => {
  try {
    const collections = await getCuratedCollections(Number(req.query.limit) || 4);
    const personalized = await getRecommendationsForUser(req.user, 6);

    return res.json({
      success: true,
      data: {
        aiCurated: collections,
        personalized: personalized.recommendations
      }
    });
  } catch (error) {
    console.error('Collections error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi lấy bộ sưu tập AI' });
  }
});

module.exports = router;
