const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const paintingsData = require('../data/paintings.json');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /api/search/smart
router.post('/smart', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập câu tìm kiếm!' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Bạn là bộ phân tích dữ liệu cho website tranh nghệ thuật. Hãy trích xuất thông tin từ câu hỏi tìm kiếm sau và trả về DUY NHẤT một chuỗi JSON thuần (không chứa markdown, không chứa \`\`\`json):
    {"style": "Tên trường phái nếu có", "color_theme": "Màu sắc chủ đạo nếu có", "medium": "Chất liệu nếu có"}
    
    Câu tìm kiếm: "${query}"`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    const extractedFilters = JSON.parse(responseText);

    let filteredPaintings = paintingsData.filter(painting => {
      let isMatch = true;
      if (extractedFilters.style && !painting.style.toLowerCase().includes(extractedFilters.style.toLowerCase())) {
        isMatch = false;
      }
      if (extractedFilters.color_theme && !painting.color_theme.toLowerCase().includes(extractedFilters.color_theme.toLowerCase())) {
        isMatch = false;
      }
      return isMatch;
    });

    res.json({
      success: true,
      ai_extracted: extractedFilters,
      total: filteredPaintings.length,
      data: filteredPaintings
    });

  } catch (error) {
    console.error('Lỗi Smart Search:', error);
    res.status(500).json({ success: false, message: 'Lỗi xử lý AI Smart Search' });
  }
});

module.exports = router;