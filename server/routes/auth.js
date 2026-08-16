const express = require('express');
const User = require('../models/User');
const { generateToken, authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, phone, gender } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'username, email và password là bắt buộc' });
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email hoặc username đã tồn tại' });
    }

    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
      phone,
      gender
    });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      token,
      user: user.toSafeObject()
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi đăng ký tài khoản' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const loginId = email || username;

    if (!loginId || !password) {
      return res.status(400).json({ success: false, message: 'Email/username và password là bắt buộc' });
    }

    const user = await User.findOne({
      $or: [{ email: loginId.toLowerCase() }, { username: loginId }]
    });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Sai email/username hoặc mật khẩu' });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      message: 'Đăng nhập thành công',
      token,
      user: user.toSafeObject()
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi đăng nhập' });
  }
});

router.post('/logout', authenticate, async (req, res) => {
  return res.json({
    success: true,
    message: 'Đăng xuất thành công. Hãy xóa token ở phía client.'
  });
});

router.get('/me', authenticate, async (req, res) => {
  return res.json({ success: true, user: req.user.toSafeObject() });
});

module.exports = router;
