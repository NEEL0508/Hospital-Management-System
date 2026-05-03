const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
const { bookAppointment, getAppointments, updateAppointmentStatus, getAvailableSlots } = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

// Public: get available slots for a doctor on a date
router.get('/slots/:doctorId/:date', getAvailableSlots);

router.route('/')
  .get(protect, getAppointments)
  .post(protect, bookAppointment);

router.route('/:id/status')
  .put(protect, updateAppointmentStatus);

router.put('/:id/reschedule', protect, async (req, res) => {
  try {
    const { appointmentDate, appointmentTime } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    if (appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    if (!['Pending', 'Approved'].includes(appointment.status)) {
      return res.status(400).json({ message: 'Cannot reschedule this appointment' });
    }
    appointment.appointmentDate = appointmentDate;
    appointment.appointmentTime = appointmentTime;
    appointment.status = 'Pending'; // reset to pending after reschedule
    await appointment.save();

    // Notify patient
    await Notification.create({
      user: appointment.patient,
      title: '📅 Appointment Rescheduled',
      message: `Your appointment has been rescheduled to ${new Date(appointmentDate).toLocaleDateString('en-IN')} at ${appointmentTime}.`,
      type: 'appointment'
    });

    res.json({ message: 'Appointment rescheduled', appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}); // Protect further logic is handled in controller if needed

module.exports = router;
