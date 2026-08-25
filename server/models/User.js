const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const viewedItemSchema = new mongoose.Schema({
  paintingId: { type: String, required: true },
  viewedAt: { type: Date, default: Date.now }
}, { _id: false });

const favoriteItemSchema = new mongoose.Schema({
  paintingId: { type: String, required: true },
  addedAt: { type: Date, default: Date.now }
}, { _id: false });

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  phone: { type: String, trim: true },
  gender: { type: String, enum: ['Nam', 'Nữ', 'Khác'], default: 'Nam' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  favorites: [favoriteItemSchema],
  recentlyViewed: [viewedItemSchema],
  favoriteCategories: [{ type: String }]
}, { timestamps: true });

userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    phone: this.phone,
    gender: this.gender,
    role: this.role,
    favoriteCategories: this.favoriteCategories,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('User', userSchema);
