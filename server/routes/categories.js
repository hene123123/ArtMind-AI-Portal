const express = require('express');
const Painting = require('../models/Painting');
const { getTrendingPaintings } = require('../utils/recommendationService');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [categories, styles, mediums, surfaces, colorThemes] = await Promise.all([
      Painting.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 }, totalViews: { $sum: '$views' }, totalPopularity: { $sum: '$popularity' } } },
        { $sort: { totalPopularity: -1, count: -1 } }
      ]),
      Painting.aggregate([
        { $group: { _id: '$style', count: { $sum: 1 }, totalViews: { $sum: '$views' }, totalPopularity: { $sum: '$popularity' } } },
        { $sort: { totalPopularity: -1, count: -1 } }
      ]),
      Painting.aggregate([
        { $group: { _id: '$medium', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Painting.aggregate([
        { $group: { _id: '$surface', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Painting.aggregate([
        { $group: { _id: '$color_theme', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    return res.json({
      success: true,
      data: {
        categories: categories.map((item) => ({
          name: item._id,
          count: item.count,
          views: item.totalViews,
          popularity: item.totalPopularity
        })),
        styles: styles.map((item) => ({
          name: item._id,
          count: item.count,
          views: item.totalViews,
          popularity: item.totalPopularity
        })),
        mediums: mediums.map((item) => ({ name: item._id, count: item.count })),
        surfaces: surfaces.map((item) => ({ name: item._id, count: item.count })),
        colorThemes: colorThemes.filter((item) => item._id).map((item) => ({ name: item._id, count: item.count }))
      }
    });
  } catch (error) {
    console.error('Categories error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi lấy danh mục' });
  }
});

router.get('/trending', async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const trendingCategories = await Painting.aggregate([
      { $group: { _id: '$category', totalPopularity: { $sum: '$popularity' }, totalViews: { $sum: '$views' }, count: { $sum: 1 } } },
      { $sort: { totalPopularity: -1, totalViews: -1 } },
      { $limit: limit }
    ]);

    const trendingPaintings = await getTrendingPaintings(limit);

    return res.json({
      success: true,
      data: {
        categories: trendingCategories.map((item) => ({
          name: item._id,
          popularity: item.totalPopularity,
          views: item.totalViews,
          count: item.count
        })),
        paintings: trendingPaintings
      }
    });
  } catch (error) {
    console.error('Trending categories error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi lấy xu hướng danh mục' });
  }
});

module.exports = router;
