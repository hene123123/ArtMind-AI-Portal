const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Vui lòng gửi tin nhắn!' });
    }

    // Thiết lập Model & Định hình tính cách cho Chatbot
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: `Bạn là "ArtMind AI" - Trợ lý ảo chuyên gia về Tranh vẽ, Hội họa và Cảm hứng Nghệ thuật cho nền tảng ArtMind Portal.
Nhiệm vụ của bạn:
1. Tư vấn chọn tranh, giải thích các trường phái hội họa (Impressionism, Abstract, Sci-Fi Realism, Realism...).
2. Hỗ trợ tạo các câu lệnh (Prompt) chi tiết bằng tiếng Anh để người dùng dùng cho Midjourney/DALL-E/Stable Diffusion nếu họ muốn sáng tạo tranh.
3. Giọng văn: Thân thiện, tinh tế, giàu cảm xúc nghệ thuật, dùng tiếng Việt chuẩn xác.
4. Trả lời ngắn gọn, súc tích (dưới 3-4 đoạn văn), sử dụng định dạng Markdown (bôi đậm, gạch đầu dòng) để dễ đọc.`
    });

    // Khởi tạo Chat Session hỗ trợ nhớ ngữ cảnh đối thoại
    const chat = model.startChat({
      history: history || []
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    res.json({
      success: true,
      reply: responseText
    });

  } catch (error) {
    console.error('Lỗi AI Chatbot:', error);
    res.status(500).json({ success: false, message: 'Lỗi xử lý AI Chatbot' });
  }
});

module.exports = router;