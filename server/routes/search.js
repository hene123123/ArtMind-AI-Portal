const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Painting = require('../models/Painting');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

    // Xây dựng câu truy vấn MongoDB động
    let mongoQuery = {};
    if (extractedFilters.style) {
      mongoQuery.style = { $regex: extractedFilters.style, $options: 'i' };
    }
    if (extractedFilters.color_theme) {
      mongoQuery.color_theme = { $regex: extractedFilters.color_theme, $options: 'i' };
    }
    if (extractedFilters.medium) {
      mongoQuery.medium = { $regex: extractedFilters.medium, $options: 'i' };
    }

    // Truy vấn dữ liệu trong MongoDB
    const filteredPaintings = await Painting.find(mongoQuery);

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