const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { protect, admin } = require('../middleware/authMiddleware');

// Submit feedback (Patient)
router.post('/', protect, async (req, res) => {
  try {
    const { rating, category, subject, message } = req.body;
    const feedback = await Feedback.create({ patient: req.user._id, rating, category, subject, message });
    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all feedback (Admin)
router.get('/', protect, admin, async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate('patient', 'name email').sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
