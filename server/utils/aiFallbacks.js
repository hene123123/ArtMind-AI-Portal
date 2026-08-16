function buildLocalSummary(painting) {
  const parts = [
    `${painting.title} là tác phẩm thuộc trường phái ${painting.style}.`,
    `Tác giả: ${painting.artist}. Chất liệu ${painting.medium} trên ${painting.surface}.`
  ];
  if (painting.description) parts.push(painting.description);
  return parts.join(' ');
}

function buildLocalTags(painting) {
  const tags = new Set([
    painting.style,
    painting.category,
    painting.medium,
    painting.surface,
    painting.color_theme,
    painting.artist
  ].filter(Boolean));

  return [...tags].slice(0, 6);
}

function extractLocalSearchFilters(query = '') {
  const q = query.toLowerCase();
  const filters = {
    style: '',
    category: '',
    color_theme: '',
    medium: '',
    artist: '',
    keyword: ''
  };

  const styleMap = {
    abstract: 'Abstract',
    landscape: 'Landscape',
    realism: 'Realism',
    'sci-fi': 'Sci-Fi',
    historical: 'Historical',
    astrophotography: 'Astrophotography'
  };

  const mediumMap = {
    oil: 'Oil',
    watercolor: 'Watercolor',
    acrylic: 'Acrylic',
    photography: 'Photography',
    digital: 'Digital'
  };

  const colorMap = {
    blue: 'Blue',
    red: 'Red',
    orange: 'Orange',
    black: 'Black',
    gold: 'Gold',
    green: 'Green'
  };

  Object.entries(styleMap).forEach(([key, value]) => {
    if (q.includes(key)) filters.style = value;
  });

  Object.entries(mediumMap).forEach(([key, value]) => {
    if (q.includes(key)) filters.medium = value;
  });

  Object.entries(colorMap).forEach(([key, value]) => {
    if (q.includes(key)) filters.color_theme = value;
  });

  if (q.includes('nature')) filters.keyword = 'nature';
  if (q.includes('modern')) filters.keyword = 'modern';
  if (q.includes('canvas')) filters.surface = 'Canvas';

  if (!filters.style && !filters.medium && !filters.color_theme && !filters.keyword) {
    filters.keyword = query.trim();
  }

  return filters;
}

function buildLocalChatReply(message, paintings) {
  if (!paintings.length) {
    return 'Hiện chưa tìm thấy tranh phù hợp trong thư viện ArtMind. Bạn thử từ khóa khác như abstract, landscape, oil, blue.';
  }

  const lines = paintings.slice(0, 4).map(
    (p, index) => `${index + 1}. **${p.title}** (${p.id}) — ${p.artist}, ${p.style}, ${p.medium}`
  );

  return [
    `Dựa trên yêu cầu "${message}", ArtMind gợi ý các tác phẩm sau:`,
    ...lines,
    '',
    'Bạn có thể mở chi tiết từng tranh bằng ID ở trên.'
  ].join('\n');
}

module.exports = {
  buildLocalSummary,
  buildLocalTags,
  extractLocalSearchFilters,
  buildLocalChatReply
};
