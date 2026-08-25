const mongoose = require('mongoose');

const analyticsEventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  eventType: {
    type: String,
    enum: ['view', 'click', 'search', 'favorite'],
    required: true
  },
  paintingId: { type: String, default: null },
  keyword: { type: String, default: null },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

analyticsEventSchema.index({ eventType: 1, createdAt: -1 });
analyticsEventSchema.index({ paintingId: 1, eventType: 1 });
analyticsEventSchema.index({ keyword: 1 });

module.exports = mongoose.model('AnalyticsEvent', analyticsEventSchema);
