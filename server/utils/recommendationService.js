const Painting = require('../models/Painting');

function buildPreferenceFilter(preferences, excludeIds = []) {
  const filter = {};

  if (preferences.styles.length) {
    filter.style = { $in: preferences.styles };
  } else if (preferences.categories.length) {
    filter.category = { $in: preferences.categories };
  } else if (preferences.colorThemes.length) {
    filter.color_theme = { $in: preferences.colorThemes };
  }

  if (excludeIds.length) {
    filter.id = { $nin: excludeIds };
  }

  return filter;
}

function extractPreferencesFromUser(user, paintings = []) {
  const paintingMap = new Map(paintings.map((p) => [p.id, p]));
  const styles = new Set();
  const categories = new Set();
  const colorThemes = new Set();

  [...user.favorites, ...user.recentlyViewed].forEach((item) => {
    const painting = paintingMap.get(item.paintingId);
    if (!painting) return;
    styles.add(painting.style);
    categories.add(painting.category);
    if (painting.color_theme) colorThemes.add(painting.color_theme);
  });

  user.favoriteCategories.forEach((category) => categories.add(category));

  return {
    styles: [...styles],
    categories: [...categories],
    colorThemes: [...colorThemes]
  };
}

async function getSimilarPaintings(painting, limit = 6) {
  return Painting.find({
    id: { $ne: painting.id },
    $or: [
      { style: painting.style },
      { category: painting.category },
      { color_theme: painting.color_theme }
    ]
  })
    .sort({ popularity: -1, views: -1 })
    .limit(limit);
}

async function getRecommendationsForUser(user, limit = 12) {
  const relatedIds = [
    ...user.favorites.map((item) => item.paintingId),
    ...user.recentlyViewed.map((item) => item.paintingId)
  ];

  const relatedPaintings = relatedIds.length
    ? await Painting.find({ id: { $in: relatedIds } })
    : [];

  const preferences = extractPreferencesFromUser(user, relatedPaintings);
  const excludeIds = [...new Set(relatedIds)];

  let recommendations = [];
  if (preferences.styles.length || preferences.categories.length || preferences.colorThemes.length) {
    recommendations = await Painting.find(buildPreferenceFilter(preferences, excludeIds))
      .sort({ popularity: -1, views: -1 })
      .limit(limit);
  }

  if (recommendations.length < limit) {
    const filler = await Painting.find({ id: { $nin: [...excludeIds, ...recommendations.map((p) => p.id)] } })
      .sort({ popularity: -1, views: -1 })
      .limit(limit - recommendations.length);
    recommendations = [...recommendations, ...filler];
  }

  return {
    recommendations,
    basedOn: {
      styles: preferences.styles,
      categories: preferences.categories,
      colorThemes: preferences.colorThemes
    }
  };
}

async function getGeneralRecommendations(limit = 12) {
  const trending = await Painting.find().sort({ popularity: -1, views: -1 }).limit(limit);
  return {
    recommendations: trending,
    basedOn: { type: 'trending' }
  };
}

async function getTrendingPaintings(limit = 10) {
  return Painting.find().sort({ popularity: -1, views: -1 }).limit(limit);
}

async function getCuratedCollections(limitPerCollection = 4) {
  const grouped = await Painting.aggregate([
    {
      $group: {
        _id: { category: '$category', style: '$style' },
        paintings: { $push: '$$ROOT' },
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 6 }
  ]);

  return grouped.map((group) => ({
    key: `${group._id.category}::${group._id.style}`,
    category: group._id.category,
    style: group._id.style,
    title: `${group._id.style} · ${group._id.category}`,
    paintings: group.paintings
      .sort((a, b) => b.popularity - a.popularity || b.views - a.views)
      .slice(0, limitPerCollection)
  }));
}

module.exports = {
  getSimilarPaintings,
  getRecommendationsForUser,
  getGeneralRecommendations,
  getTrendingPaintings,
  getCuratedCollections,
  extractPreferencesFromUser
};
