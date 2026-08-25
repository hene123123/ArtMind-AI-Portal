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

function buildLocalChatReply(message, paintings = []) {
  const q = (message || '').toLowerCase();
  const list = (paintings || []).slice(0, 5).map((p, i) =>
    `${i + 1}. **${p.title}** — ${p.artist || ''} (${p.style || ''}, ${p.medium || ''})`
  ).join('\n');

  // Art-related keywords
  const artKeywords = ['tranh', 'hội họa', 'painting', 'abstract', 'landscape', 'nghệ thuật', 'họa sĩ', 'style', 'medium', 'gợi ý', 'recommend'];
  const isArt = artKeywords.some((k) => q.includes(k));

  if (isArt && list) {
    return `Mình gợi ý một số tác phẩm liên quan trong kho ArtMind:\n\n${list}\n\nBạn muốn xem chi tiết bức nào, hoặc mô tả thêm sở thích (màu, chủ đề, phong cách) để mình lọc kỹ hơn nhé.`;
  }

  if (isArt) {
    return 'Hiện chưa khớp đúng tranh trong database. Bạn thử mô tả rõ hơn: phong cách (Abstract, Landscape...), chất liệu (Oil, Watercolor...), hoặc tông màu mong muốn.';
  }

  // General knowledge fallback (honest + helpful)
  return `Mình đã nhận câu hỏi của bạn: "**${message}**".\n\nHiện hệ thống đang chạy ở chế độ **local fallback** (Gemini API chưa phản hồi được — thường do API key / model).\n\nBạn có thể:\n1. Kiểm tra lại \`GEMINI_API_KEY\` và \`GEMINI_MODEL=gemini-3.7-flash\` trong file \`.env\`\n2. Tạo key mới tại: https://aistudio.google.com/apikey\n3. Restart backend sau khi đổi key\n\nKhi Gemini hoạt động, mình sẽ trả lời đầy đủ kiến thức chung + gợi ý tranh như một trợ lý AI đa năng.`;
}

module.exports = {
  buildLocalSummary,
  buildLocalTags,
  extractLocalSearchFilters,
  buildLocalChatReply
};
