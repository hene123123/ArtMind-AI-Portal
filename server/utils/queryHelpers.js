function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildPaintingFilter(query = {}) {
  const filter = {};
  const textFields = ['category', 'style', 'medium', 'surface', 'color_theme', 'artist'];

  textFields.forEach((field) => {
    if (query[field]) {
      filter[field] = { $regex: escapeRegex(query[field]), $options: 'i' };
    }
  });

  if (query.q) {
    const keyword = escapeRegex(query.q);
    filter.$or = [
      { title: { $regex: keyword, $options: 'i' } },
      { artist: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
      { category: { $regex: keyword, $options: 'i' } },
      { style: { $regex: keyword, $options: 'i' } },
      { ai_tags: { $regex: keyword, $options: 'i' } }
    ];
  }

  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }

  if (query.tag) {
    filter.ai_tags = { $regex: escapeRegex(query.tag), $options: 'i' };
  }

  return filter;
}

function buildSortOption(sortBy = 'popular') {
  const sortMap = {
    popular: { popularity: -1, views: -1 },
    views: { views: -1 },
    newest: { createdAt: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    title: { title: 1 }
  };

  return sortMap[sortBy] || sortMap.popular;
}

async function paginateQuery(Model, filter, options = {}) {
  const page = Math.max(1, Number(options.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(options.limit) || 12));
  const skip = (page - 1) * limit;
  const sort = buildSortOption(options.sort);

  const [data, total] = await Promise.all([
    Model.find(filter).sort(sort).skip(skip).limit(limit),
    Model.countDocuments(filter)
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1
    }
  };
}

module.exports = {
  buildPaintingFilter,
  buildSortOption,
  paginateQuery
};
