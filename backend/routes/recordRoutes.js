const express = require('express');
const router = express.Router();
const { getMyRecords, addRecord } = require('../controllers/recordController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/my-records', protect, getMyRecords);
router.post('/add', protect, admin, addRecord);

module.exports = router;
