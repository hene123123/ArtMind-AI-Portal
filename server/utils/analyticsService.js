const AnalyticsEvent = require('../models/AnalyticsEvent');
const Painting = require('../models/Painting');

async function trackEvent({ userId = null, eventType, paintingId = null, keyword = null, metadata = {} }) {
  await AnalyticsEvent.create({
    userId,
    eventType,
    paintingId,
    keyword,
    metadata
  });

  if (eventType === 'view' && paintingId) {
    const painting = await Painting.findOneAndUpdate(
      { id: paintingId },
      { $inc: { views: 1, popularity: 1 } },
      { returnDocument: 'after' }
    );
    return painting;
  }

  return null;
}

async function getTrendingPaintings(limit = 10) {
  return Painting.find().sort({ popularity: -1, views: -1 }).limit(limit);
}

async function getTrendReport() {
  const [categoryTrends, styleTrends, topSearches] = await Promise.all([
    AnalyticsEvent.aggregate([
      { $match: { eventType: 'view', paintingId: { $ne: null } } },
      {
        $lookup: {
          from: 'paintings',
          localField: 'paintingId',
          foreignField: 'id',
          as: 'painting'
        }
      },
      { $unwind: '$painting' },
      { $group: { _id: '$painting.category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]),
    AnalyticsEvent.aggregate([
      { $match: { eventType: 'view', paintingId: { $ne: null } } },
      {
        $lookup: {
          from: 'paintings',
          localField: 'paintingId',
          foreignField: 'id',
          as: 'painting'
        }
      },
      { $unwind: '$painting' },
      { $group: { _id: '$painting.style', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]),
    AnalyticsEvent.aggregate([
      { $match: { eventType: 'search', keyword: { $ne: null } } },
      { $group: { _id: '$keyword', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ])
  ]);

  return {
    categories: categoryTrends.map((item) => ({ name: item._id, count: item.count })),
    styles: styleTrends.map((item) => ({ name: item._id, count: item.count })),
    topSearches: topSearches.map((item) => ({ keyword: item._id, count: item.count }))
  };
}

async function getPersonalInsights(user) {
  const favoriteIds = user.favorites.map((item) => item.paintingId);
  const recentIds = user.recentlyViewed.map((item) => item.paintingId);
  const relatedIds = [...new Set([...favoriteIds, ...recentIds])];

  const relatedPaintings = relatedIds.length
    ? await Painting.find({ id: { $in: relatedIds } })
    : [];

  const styleCount = {};
  const categoryCount = {};

  relatedPaintings.forEach((painting) => {
    styleCount[painting.style] = (styleCount[painting.style] || 0) + 1;
    categoryCount[painting.category] = (categoryCount[painting.category] || 0) + 1;
  });

  const topStyle = Object.entries(styleCount).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  const topCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  const recentEvents = await AnalyticsEvent.find({ userId: user._id })
    .sort({ createdAt: -1 })
    .limit(20);

  return {
    totalFavorites: user.favorites.length,
    totalRecentlyViewed: user.recentlyViewed.length,
    topStyle,
    topCategory,
    recentActivity: recentEvents.map((event) => ({
      eventType: event.eventType,
      paintingId: event.paintingId,
      keyword: event.keyword,
      createdAt: event.createdAt
    }))
  };
}

module.exports = {
  trackEvent,
  getTrendingPaintings,
  getTrendReport,
  getPersonalInsights
};
