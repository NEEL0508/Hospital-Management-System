const express = require('express');
const router = express.Router();
const DoctorLeave = require('../models/DoctorLeave');
const Doctor = require('../models/Doctor');
const { protect } = require('../middleware/authMiddleware');

// Get doctor's leaves
router.get('/', protect, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });
    const leaves = await DoctorLeave.find({ doctor: doctor._id }).sort({ date: 1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add leave date
router.post('/', protect, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });

    const { date, reason } = req.body;
    // Check duplicate
    const exists = await DoctorLeave.findOne({ doctor: doctor._id, date: new Date(date) });
    if (exists) return res.status(400).json({ message: 'Leave already marked for this date' });

    const leave = await DoctorLeave.create({ doctor: doctor._id, date, reason });
    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete leave
router.delete('/:id', protect, async (req, res) => {
  try {
    await DoctorLeave.findByIdAndDelete(req.params.id);
    res.json({ message: 'Leave removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Public: check if doctor is on leave for a date (used during booking)
router.get('/check/:doctorId/:date', async (req, res) => {
  try {
    const leave = await DoctorLeave.findOne({
      doctor: req.params.doctorId,
      date: new Date(req.params.date)
    });
    res.json({ onLeave: !!leave });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
