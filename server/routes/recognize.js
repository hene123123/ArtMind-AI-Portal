const express = require('express');
const router = express.Router();
const multer = require('multer');
const ColorThief = require('colorthief');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const paintingsData = require('../data/paintings.json');

// Tạo cấu hình nộp ảnh tạm vào thư mục uploads/
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

// POST /api/recognize
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Chưa tải file ảnh lên!' });
    }

    const imagePath = req.file.path;
    const mimeType = req.file.mimetype;

    // 1. Lấy màu chủ đạo bằng ColorThief
    const rgbColor = await ColorThief.getColor(imagePath);
    const hexColor = `#${((1 << 24) + (rgbColor[0] << 16) + (rgbColor[1] << 8) + rgbColor[2]).toString(16).slice(1)}`;

    // 2. Phân tích ảnh bằng Gemini Vision
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const imagePart = fileToGenerativePart(imagePath, mimeType);
    
    const prompt = `Phân tích bức tranh trong ảnh này và trả về DUY NHẤT một chuỗi JSON thuần (không kèm markdown):
    {
      "style": "Trường phái tranh (VD: Abstract, Landscape, Modern, Impressionism)",
      "category": "Thể loại (VD: Nature, Abstract Paintings, Flower Paintings)",
      "description": "Mô tả ngắn gọn bức tranh bằng tiếng Việt (2 câu)"
    }`;

    const result = await model.generateContent([prompt, imagePart]);
    const aiAnalysis = JSON.parse(result.response.text().trim());

    // 3. Tìm tranh tương tự trong Database
    const similarPaintings = paintingsData.filter(p => 
      p.style.toLowerCase() === aiAnalysis.style.toLowerCase() ||
      p.category.toLowerCase() === aiAnalysis.category.toLowerCase()
    );

    // Xóa file ảnh tạm sau khi xong
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