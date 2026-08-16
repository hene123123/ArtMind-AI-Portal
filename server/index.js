require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const Painting = require('./models/Painting');
const User = require('./models/User');
const paintingsData = require('./data/paintings.json');

const authRouter = require('./routes/auth');
const paintingsRouter = require('./routes/paintings');
const categoriesRouter = require('./routes/categories');
const recommendationsRouter = require('./routes/recommendations');
const searchRouter = require('./routes/search');
const recognizeRouter = require('./routes/recognize');
const chatRouter = require('./routes/chat');
const usersRouter = require('./routes/users');
const analyticsRouter = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

async function seedDatabase() {
  const count = await Painting.countDocuments();
  if (count === 0) {
    const enriched = paintingsData.map((item, index) => ({
      ...item,
      views: item.views || index * 3,
      popularity: item.popularity || index * 2,
      ai_tags: item.ai_tags || [],
      ai_summary: item.ai_summary || ''
    }));
    await Painting.insertMany(enriched);
    console.log('🚀 Đã tự động nạp Data từ paintings.json lên MongoDB Atlas!');
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@artmind.local';
  const adminExists = await User.findOne({ email: adminEmail });
  if (!adminExists) {
    await User.create({
      username: process.env.ADMIN_USERNAME || 'admin',
      email: adminEmail,
      password: process.env.ADMIN_PASSWORD || 'Admin@123',
      firstName: 'ArtMind',
      lastName: 'Admin',
      role: 'admin'
    });
    console.log(`👤 Đã tạo tài khoản admin mặc định: ${adminEmail}`);
  }
}

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Đã kết nối thành công tới MongoDB Atlas!');
    await seedDatabase();
  })
  .catch((err) => console.error('❌ Lỗi kết nối MongoDB:', err));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'ArtMind API is running' });
});

app.use('/api/auth', authRouter);
app.use('/api/paintings', paintingsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/recommendations', recommendationsRouter);
app.use('/api/search', searchRouter);
app.use('/api/recognize', recognizeRouter);
app.use('/api/chat', chatRouter);
app.use('/api/users', usersRouter);
app.use('/api/analytics', analyticsRouter);

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});
