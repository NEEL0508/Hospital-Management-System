const express = require('express');
const router = express.Router();
const DoctorSchedule = require('../models/DoctorSchedule');
const Doctor = require('../models/Doctor');
const { protect } = require('../middleware/authMiddleware');

// Helper: generate 30-min slots between two HH:MM times
const genSlots = (start, end) => {
  const slots = [];
  if (!start || !end) return slots;
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let cur = sh * 60 + sm;
  const endMin = eh * 60 + em;
  while (cur < endMin) {
    slots.push(`${String(Math.floor(cur / 60)).padStart(2, '0')}:${String(cur % 60).padStart(2, '0')}`);
    cur += 30;
  }
  return slots;
};

// @route GET /api/schedules/my — doctor gets their own schedules
router.get('/my', protect, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });
    const schedules = await DoctorSchedule.find({ doctor: doctor._id }).sort({ date: 1 });
    res.json(schedules);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// @route GET /api/schedules/doctor/:doctorId — public: get schedules for a doctor
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const schedules = await DoctorSchedule.find({
      doctor: req.params.doctorId,
      date: { $gte: today },
      isOff: false,
    }).sort({ date: 1 });
    res.json(schedules);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// @route GET /api/schedules/doctor/:doctorId/:date — get schedule for specific date
router.get('/doctor/:doctorId/:date', async (req, res) => {
  try {
    const d = new Date(req.params.date); d.setHours(0, 0, 0, 0);
    const schedule = await DoctorSchedule.findOne({ doctor: req.params.doctorId, date: d });
    res.json(schedule || null);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// @route POST /api/schedules — doctor creates/updates a date schedule
router.post('/', protect, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });

    const { date, morningStart, morningEnd, lunchStart, lunchEnd, eveningStart, eveningEnd, notes, isOff } = req.body;

    const d = new Date(date); d.setHours(0, 0, 0, 0);

    // Upsert: update if exists, create if not
    const schedule = await DoctorSchedule.findOneAndUpdate(
      { doctor: doctor._id, date: d },
      { doctor: doctor._id, date: d, morningStart, morningEnd, lunchStart, lunchEnd, eveningStart, eveningEnd, notes, isOff: isOff || false },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Generate preview slots for response
    const morningSlots = genSlots(morningStart, morningEnd);
    const eveningSlots = genSlots(eveningStart, eveningEnd);
    const allSlots = [...morningSlots, ...eveningSlots];

    res.status(201).json({ schedule, slots: allSlots });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// @route DELETE /api/schedules/:id — doctor deletes a schedule
router.delete('/:id', protect, async (req, res) => {
  try {
    await DoctorSchedule.findByIdAndDelete(req.params.id);
    res.json({ message: 'Schedule deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// @route GET /api/schedules/slots/:doctorId/:date — get 30-min slots for a date
// Uses date-specific schedule first, falls back to weekly availability
router.get('/slots/:doctorId/:date', async (req, res) => {
  try {
    const { doctorId, date } = req.params;
    const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const Appointment = require('../models/Appointment');
    const DoctorLeave = require('../models/DoctorLeave');

    // Check leave
    const leaveDate = new Date(date); leaveDate.setHours(0, 0, 0, 0);
    const onLeave = await DoctorLeave.findOne({ doctor: doctorId, date: leaveDate });
    if (onLeave) return res.json({ onLeave: true, slots: [], source: 'leave' });

    let allSlots = [];
    let source = 'none';
    let lunchBreak = null;

    // 1. Try date-specific schedule
    const dateSchedule = await DoctorSchedule.findOne({ doctor: doctorId, date: leaveDate });
    if (dateSchedule) {
      if (dateSchedule.isOff) return res.json({ onLeave: false, isOff: true, slots: [], source: 'schedule' });
      const morningSlots = genSlots(dateSchedule.morningStart, dateSchedule.morningEnd);
      const eveningSlots = genSlots(dateSchedule.eveningStart, dateSchedule.eveningEnd);
      allSlots = [...morningSlots, ...eveningSlots];
      source = 'schedule';
      if (dateSchedule.lunchStart && dateSchedule.lunchEnd) {
        lunchBreak = { start: dateSchedule.lunchStart, end: dateSchedule.lunchEnd };
      }
    } else {
      // 2. Fall back to weekly availability
      const doctor = await Doctor.findById(doctorId);
      if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
      const dayName = DAYS[new Date(date).getDay()];
      const daySlots = (doctor.availability || []).filter(s => s.day === dayName);
      if (daySlots.length === 0) return res.json({ onLeave: false, slots: [], noSchedule: true, source: 'none' });
      allSlots = daySlots.flatMap(s => genSlots(s.startTime, s.endTime));
      source = 'weekly';
    }

    if (allSlots.length === 0) return res.json({ onLeave: false, slots: [], noSchedule: true, source });

    // Get booked appointments
    const startOfDay = new Date(date); startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date); endOfDay.setHours(23, 59, 59, 999);
    const booked = await Appointment.find({
      doctor: doctorId,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['Pending', 'Approved'] },
    }).select('appointmentTime patient');

    const bookedMap = {};
    booked.forEach(apt => { bookedMap[apt.appointmentTime] = apt.patient?.toString(); });

    const slots = allSlots.map(time => ({
      time,
      status: bookedMap[time] ? 'booked' : 'available',
      patientId: bookedMap[time] || null,
    }));

    res.json({ onLeave: false, slots, source, lunchBreak, dayName: DAYS[new Date(date).getDay()] });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
