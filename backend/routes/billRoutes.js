const express = require('express');
const router = express.Router();
const { createBill, getAllBills, getDoctorBills, getMyBills, updateBill, deleteBill, payBill } = require('../controllers/billController');
const { protect, admin, doctor } = require('../middleware/authMiddleware');

// Admin - get all bills
router.get('/', protect, admin, getAllBills);

// Doctor - get own bills & create bill
router.get('/doctor-bills', protect, doctor, getDoctorBills);
router.post('/', protect, (req, res, next) => {
  if (req.user.role === 'Admin' || req.user.role === 'Doctor') return next();
  res.status(401).json({ message: 'Not authorized' });
}, createBill);

// Patient - get own bills
router.get('/my-bills', protect, getMyBills);
router.post('/:id/pay', protect, payBill);

// Admin/Doctor - update & delete
router.put('/:id', protect, admin, updateBill);
router.delete('/:id', protect, (req, res, next) => {
  if (req.user.role === 'Admin' || req.user.role === 'Doctor') return next();
  res.status(401).json({ message: 'Not authorized' });
}, deleteBill);

module.exports = router;
