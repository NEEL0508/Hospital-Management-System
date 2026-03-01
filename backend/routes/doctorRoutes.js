const express = require('express');
const router = express.Router();
const { 
  getDoctors, 
  addDoctor, 
  getDoctorProfile, 
  updateDoctorAvailability,
  getDoctorPatients
} = require('../controllers/doctorController');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getDoctors)
  .post(protect, admin, addDoctor);

router.get('/me', protect, getDoctorProfile);
router.get('/my-patients', protect, getDoctorPatients);
router.put('/availability', protect, updateDoctorAvailability);

router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const doc = await Doctor.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Doctor not found' });
    await User.findByIdAndDelete(doc.user);
    await Doctor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
