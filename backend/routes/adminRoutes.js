const express = require('express');
const router = express.Router();
const { getAdminStats, getPatients } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getAdminStats);
router.get('/patients', protect, admin, getPatients);

module.exports = router;
