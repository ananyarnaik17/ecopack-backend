// backend/routes/feedback.js
const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

router.post('/submit-feedback', async (req, res) => {
  try {
    const {
      name,
      overallRating,
      accuracyRating,
      packagingRating,
      deliveryRating,
      suggestions
    } = req.body;

    const newFeedback = new Feedback({
      name,
      overallRating,
      accuracyRating,
      packagingRating,
      deliveryRating,
      suggestions
    });

    await newFeedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully.' });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ message: 'Server error while submitting feedback.' });
  }
});

module.exports = router;
