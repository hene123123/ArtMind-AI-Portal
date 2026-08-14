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
  description: { type: String }
});

module.exports = mongoose.model('Painting', paintingSchema);