const mongoose = require('mongoose');

const paintingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  artist: { type: String, required: true },
  style: { type: String, required: true },
  category: { type: String, required: true },
  medium: { type: String, required: true },
  surface: { type: String, required: true },
  primary_color: { type: String },
  color_theme: { type: String },
  price: { type: Number, required: true },
  image_url: { type: String, required: true },
  description: { type: String },
  views: { type: Number, default: 0 },
  popularity: { type: Number, default: 0 },
  ai_tags: [{ type: String }],
  ai_summary: { type: String }
}, { timestamps: true });

paintingSchema.index({ category: 1, style: 1, medium: 1 });
paintingSchema.index({ popularity: -1, views: -1 });

module.exports = mongoose.model('Painting', paintingSchema);
