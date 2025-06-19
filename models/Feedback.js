// backend/models/Feedback.js
const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  overallRating: { type: Number, required: true },
  accuracyRating: { type: Number, required: true },
  packagingRating: { type: Number, required: true },
  deliveryRating: { type: Number, required: true },
  suggestions: { type: String },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'feedbacks' }); // Explicitly set the collection name

module.exports = mongoose.model('Feedback', FeedbackSchema);
