const express = require('express');
const router = express.Router();
const multer = require('multer');
const ColorThief = require('colorthief');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Painting = require('../models/Painting');

const upload = multer({ dest: 'uploads/' });
function getModel() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY chưa được cấu hình');
  }

  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY).getGenerativeModel({
    model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
    generationConfig: { responseMimeType: 'application/json' }
  });
}

function fileToGenerativePart(imageBuffer, mimeType) {
  return {
    inlineData: {
      data: imageBuffer.toString("base64"),
      mimeType
    },
  };
}

async function removeUploadedFile(imagePath) {
  if (!imagePath) return;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      await fs.promises.unlink(imagePath);
      return;
    } catch (error) {
      if (error.code === 'ENOENT') return;
      if (!['EBUSY', 'EPERM'].includes(error.code) || attempt === 4) {
        console.error('Không thể xóa file upload tạm:', error.message);
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
}

router.post('/', upload.single('image'), async (req, res) => {
  let imagePath;
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Chưa tải file ảnh lên!' });
    }

    imagePath = req.file.path;
    const mimeType = req.file.mimetype;
    const imageBuffer = await fs.promises.readFile(imagePath);

    const rgbColor = await ColorThief.getColor(imageBuffer);
    const hexColor = `#${((1 << 24) + (rgbColor[0] << 16) + (rgbColor[1] << 8) + rgbColor[2]).toString(16).slice(1)}`;

    const modelName = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
    console.log('[recognize] using model:', modelName);
    const model = getModel();
    const imagePart = fileToGenerativePart(imageBuffer, mimeType);
    
    const prompt = `Phân tích nội dung chính của ảnh này (có thể là tranh, cờ, đồ vật, con người, phong cảnh hoặc bất kỳ hình ảnh nào) và trả về DUY NHẤT một chuỗi JSON thuần (không kèm markdown):
    {
      "confidence": 0.0,
      "subject": "Đối tượng hoặc nội dung chính của ảnh",
      "style": "Phong cách hoặc đặc điểm hình ảnh; nếu không phải tranh thì mô tả phong cách phù hợp",
      "category": "Thể loại ảnh phù hợp",
      "description": "Mô tả ngắn gọn bằng tiếng Việt (2 câu)"
    }`;

    const result = await model.generateContent([prompt, imagePart]);
    const aiAnalysis = JSON.parse(result.response.text().trim());
    const confidence = Number(aiAnalysis.confidence);

    // Tìm tranh tương tự trong MongoDB theo Style hoặc Category
    const similarPaintings = aiAnalysis.category
      ? await Painting.find({ category: { $regex: aiAnalysis.category, $options: 'i' } })
      : [];

    res.json({
      success: true,
      analysis: {
        dominant_color: { rgb: rgbColor, hex: hexColor },
        subject: aiAnalysis.subject,
        confidence: Number.isFinite(confidence) ? confidence : null,
        style: aiAnalysis.style,
        category: aiAnalysis.category,
        description: aiAnalysis.description
      },
      similar_paintings: similarPaintings
    });

  } catch (error) {
    console.error('Lỗi Image Recognition:', error);
    res.status(500).json({ success: false, message: 'Lỗi nhận diện hình ảnh AI' });
  } finally {
    await removeUploadedFile(imagePath);
  }
});

module.exports = router;