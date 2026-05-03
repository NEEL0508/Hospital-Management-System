const express = require('express');
const router = express.Router();
const { getAdminStats, getPatients, getPatientDetails, getActivityOverview } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getAdminStats);
router.get('/patients', protect, admin, getPatients);
router.get('/patients/:id/details', protect, admin, getPatientDetails);
router.get('/activity', protect, admin, getActivityOverview);

module.exports = router;
