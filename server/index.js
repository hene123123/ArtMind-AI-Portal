require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');


const Painting = require('./models/Painting');
const paintingsData = require('./data/paintings.json');

const searchRouter = require('./routes/search');
const recognizeRouter = require('./routes/recognize');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Đã kết nối thành công tới MongoDB Atlas!');
    
    // Tự động seed data từ paintings.json nếu Database đang trống
    const count = await Painting.countDocuments();
    if (count === 0) {
      await Painting.insertMany(paintingsData);
      console.log('🚀 Đã tự động nạp Data từ paintings.json lên MongoDB Atlas!');
    }
  })
  .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

// API Lấy danh sách tranh từ MongoDB
app.get('/api/paintings', async (req, res) => {
  try {
    const paintings = await Painting.find();
    res.json({ success: true, data: paintings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi lấy dữ liệu từ MongoDB' });
  }
});

// Mount Routes AI
app.use('/api/search', searchRouter);
app.use('/api/recognize', recognizeRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});
