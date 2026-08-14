const express = require('express');
const router = express.Router();
const multer = require('multer');
const ColorThief = require('colorthief');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Painting = require('../models/Painting');

const upload = multer({ dest: 'uploads/' });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}

router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Chưa tải file ảnh lên!' });
    }

    const imagePath = req.file.path;
    const mimeType = req.file.mimetype;

    const rgbColor = await ColorThief.getColor(imagePath);
    const hexColor = `#${((1 << 24) + (rgbColor[0] << 16) + (rgbColor[1] << 8) + rgbColor[2]).toString(16).slice(1)}`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const imagePart = fileToGenerativePart(imagePath, mimeType);
    
    const prompt = `Phân tích bức tranh trong ảnh này và trả về DUY NHẤT một chuỗi JSON thuần (không kèm markdown):
    {
      "style": "Trường phái tranh (VD: Abstract, Landscape, Modern, Impressionism, Historical Realism, Sci-Fi Realism)",
      "category": "Thể loại (VD: Nature, Abstract Paintings, Historical Paintings, Futuristic & Sci-Fi)",
      "description": "Mô tả ngắn gọn bức tranh bằng tiếng Việt (2 câu)"
    }`;

    const result = await model.generateContent([prompt, imagePart]);
    const aiAnalysis = JSON.parse(result.response.text().trim());

    // Tìm tranh tương tự trong MongoDB theo Style hoặc Category
    const similarPaintings = await Painting.find({
      $or: [
        { style: { $regex: aiAnalysis.style, $options: 'i' } },
        { category: { $regex: aiAnalysis.category, $options: 'i' } }
      ]
    });

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    res.json({
      success: true,
      analysis: {
        dominant_color: { rgb: rgbColor, hex: hexColor },
        style: aiAnalysis.style,
        category: aiAnalysis.category,
        description: aiAnalysis.description
      },
      similar_paintings: similarPaintings
    });

  } catch (error) {
    console.error('Lỗi Image Recognition:', error);
    res.status(500).json({ success: false, message: 'Lỗi nhận diện hình ảnh AI' });
  }
});

module.exports = router;