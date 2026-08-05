const express = require('express');
const cors = require('cors');
require('dotenv').config();

const paintingsData = require('./data/paintings.json');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// API 1: Healthcheck Server
app.get('/', (req, res) => {
  res.send('ArtMind AI Portal - Backend API is running!');
});

// API 2: Lấy toàn bộ danh sách tranh (Dành cho Frontend gọi Render)
app.get('/api/paintings', (req, res) => {
  res.json({
    success: true,
    total: paintingsData.length,
    data: paintingsData
  });
});

// API 3: Lấy chi tiết 1 bức tranh theo ID
app.get('/api/paintings/:id', (req, res) => {
  const { id } = req.params;
  const painting = paintingsData.find(item => item.id === id);

  if (!painting) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy bức tranh này!' });
  }

  res.json({ success: true, data: painting });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server Backend đang chạy tại: http://localhost:${PORT}`);
});