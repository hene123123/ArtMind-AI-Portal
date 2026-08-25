const { GoogleGenerativeAI } = require('@google/generative-ai');
const {
  buildLocalSummary,
  buildLocalTags,
  extractLocalSearchFilters
} = require('./aiFallbacks');

let genAI = null;

function getGeminiModelName() {
  return process.env.GEMINI_MODEL || 'gemini-3.6-flash';
}

function isGeminiConfigured() {
  const key = (process.env.GEMINI_API_KEY || '').trim();
  // Google AI Studio hiện tạo Auth key dạng AQ.xxx (thay cho AIzaSy cũ)
  return Boolean(key.length > 10);
}

function getGenAI() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY chưa được cấu hình');
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

function getModel(systemInstruction) {
  const modelName = getGeminiModelName();
  console.log('[gemini] model:', modelName);
  const options = { model: modelName };
  if (systemInstruction) options.systemInstruction = systemInstruction;
  return getGenAI().getGenerativeModel(options);
}

function parseJsonResponse(text) {
  const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
  return JSON.parse(cleaned);
}

async function withGeminiFallback(aiFn, fallbackFn) {
  if (!isGeminiConfigured()) {
    return fallbackFn();
  }

  try {
    return await aiFn();
  } catch (error) {
    console.warn('Gemini unavailable, using local fallback:', error.message);
    return fallbackFn();
  }
}

async function extractSearchFilters(query) {
  return withGeminiFallback(
    async () => {
      const model = getModel();
      const prompt = `Bạn là bộ phân tích dữ liệu cho website tranh nghệ thuật. Trích xuất thông tin từ câu tìm kiếm và trả về DUY NHẤT một chuỗi JSON thuần:
{"style":"","category":"","color_theme":"","medium":"","artist":"","keyword":""}

Chỉ điền field có liên quan, để chuỗi rỗng nếu không có.
Câu tìm kiếm: "${query}"`;

      const result = await model.generateContent(prompt);
      return parseJsonResponse(result.response.text());
    },
    () => extractLocalSearchFilters(query)
  );
}

async function generatePaintingSummary(painting) {
  return withGeminiFallback(
    async () => {
      const model = getModel();
      const prompt = `Viết tóm tắt AI ngắn gọn (2-3 câu, tiếng Việt) cho bức tranh sau:
Title: ${painting.title}
Artist: ${painting.artist}
Style: ${painting.style}
Category: ${painting.category}
Medium: ${painting.medium}
Surface: ${painting.surface}
Description: ${painting.description || 'Không có'}

Chỉ trả về nội dung tóm tắt, không markdown.`;

      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    },
    () => buildLocalSummary(painting)
  );
}

async function generatePaintingTags(painting) {
  return withGeminiFallback(
    async () => {
      const model = getModel();
      const prompt = `Phân tích bức tranh và trả về DUY NHẤT JSON thuần:
{"tags":["tag1","tag2","tag3","tag4","tag5"]}

Title: ${painting.title}
Artist: ${painting.artist}
Style: ${painting.style}
Category: ${painting.category}
Medium: ${painting.medium}
Color theme: ${painting.color_theme || ''}
Description: ${painting.description || ''}`;

      const result = await model.generateContent(prompt);
      const parsed = parseJsonResponse(result.response.text());
      return parsed.tags || [];
    },
    () => buildLocalTags(painting)
  );
}

async function generateCuratedCollectionName(category, style) {
  return withGeminiFallback(
    async () => {
      const model = getModel();
      const prompt = `Đặt tên ngắn gọn (tiếng Việt, tối đa 6 từ) cho bộ sưu tập tranh thuộc category "${category}" và style "${style}". Chỉ trả về tên, không giải thích.`;
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    },
    () => `${style} · ${category}`
  );
}

async function generateChatReply(message, history, paintingContext, paintings) {
  return withGeminiFallback(
    async () => {
      // Dùng generateContent (không startChat) để tránh bị "dính" persona cũ từ history
      const model = getModel(
        `You are ArtMind AI, a capable general-purpose assistant embedded in an art portal app.

HARD RULES:
1. Answer ANY user question helpfully and accurately (science, astronomy, history, tech, daily life, coding, etc.).
2. NEVER refuse a question because it is "not about art".
3. NEVER say you only specialize in art / painting / hội họa when the user asks about other topics.
4. Only use the painting list below when the user asks for artwork recommendations or art explanations.

Optional painting catalog (use only for art recommendations):
${paintingContext}

Reply in Vietnamese unless the user writes in another language. Use Markdown when useful.`
      );

      // Nhắc lại rule ngay trong user turn để model khó "lảng" sang persona art-only
      const reinforced = `[System reminder: You must answer general knowledge questions fully. Do not claim you are only an art specialist.]

User question: ${message}`;

      const result = await model.generateContent(reinforced);
      return result.response.text();
    },
    () => {
      const { buildLocalChatReply } = require('./aiFallbacks');
      return buildLocalChatReply(message, paintings);
    }
  );
}

module.exports = {
  getModel,
  parseJsonResponse,
  extractSearchFilters,
  generatePaintingSummary,
  generatePaintingTags,
  generateCuratedCollectionName,
  generateChatReply,
  isGeminiConfigured
};
