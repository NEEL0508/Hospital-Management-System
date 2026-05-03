const express = require('express');
const router = express.Router();
const DoctorRating = require('../models/DoctorRating');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const { protect } = require('../middleware/authMiddleware');

// @route POST /api/ratings — patient submits a rating for a doctor
router.post('/', protect, async (req, res) => {
  try {
    const { doctorId, appointmentId, rating, review } = req.body;

    if (!doctorId || !rating) {
      return res.status(400).json({ message: 'Doctor and rating are required' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Verify patient had a completed appointment with this doctor
    if (appointmentId) {
      const apt = await Appointment.findById(appointmentId);
      if (!apt || apt.patient.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to rate this appointment' });
      }
    }

    // Upsert: update if already rated, create if not
    const existing = await DoctorRating.findOne({ doctor: doctorId, patient: req.user._id });
    let ratingDoc;
    if (existing) {
      existing.rating = rating;
      existing.review = review || '';
      if (appointmentId) existing.appointment = appointmentId;
      ratingDoc = await existing.save();
    } else {
      ratingDoc = await DoctorRating.create({
        doctor: doctorId,
        patient: req.user._id,
        appointment: appointmentId || undefined,
        rating,
        review: review || '',
      });
    }

    res.status(201).json({ message: 'Rating submitted successfully', rating: ratingDoc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/ratings/doctor/:doctorId — get all ratings for a doctor
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const ratings = await DoctorRating.find({ doctor: req.params.doctorId })
      .populate('patient', 'name')
      .sort({ createdAt: -1 });

    const avg = ratings.length
      ? (ratings.reduce((s, r) => s + r.rating, 0) / ratings.length).toFixed(1)
      : 0;

    res.json({ ratings, average: parseFloat(avg), total: ratings.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/ratings/my/:doctorId — check if current patient already rated this doctor
router.get('/my/:doctorId', protect, async (req, res) => {
  try {
    const existing = await DoctorRating.findOne({
      doctor: req.params.doctorId,
      patient: req.user._id,
    });
    res.json(existing || null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/ratings/all — get all ratings (for home page display)
router.get('/all', async (req, res) => {
  try {
    const ratings = await DoctorRating.find({ review: { $ne: '' } })
      .populate('patient', 'name')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/ratings/summary — avg rating per doctor (for home page stats)
router.get('/summary', async (req, res) => {
  try {
    const summary = await DoctorRating.aggregate([
      {
        $group: {
          _id: '$doctor',
          average: { $avg: '$rating' },
          total: { $sum: 1 },
        },
      },
      { $sort: { average: -1 } },
    ]);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
