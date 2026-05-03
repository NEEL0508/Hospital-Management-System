const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');
const Notification = require('../models/Notification');
const Doctor = require('../models/Doctor');
const DoctorLeave = require('../models/DoctorLeave');

// Helper: generate 30-min time slots between startTime and endTime (HH:MM strings)
const generateSlots = (startTime, endTime) => {
  const slots = [];
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  let cur = sh * 60 + sm;
  const end = eh * 60 + em;
  while (cur < end) {
    const h = String(Math.floor(cur / 60)).padStart(2, '0');
    const m = String(cur % 60).padStart(2, '0');
    slots.push(`${h}:${m}`);
    cur += 30;
  }
  return slots;
};

// @desc  Get available slots for a doctor on a specific date
// @route GET /api/appointments/slots/:doctorId/:date
// @access Public
const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.params;
    const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    // Check if doctor is on leave
    const leaveDate = new Date(date);
    leaveDate.setHours(0, 0, 0, 0);
    const onLeave = await DoctorLeave.findOne({ doctor: doctorId, date: leaveDate });
    if (onLeave) return res.json({ onLeave: true, slots: [] });

    // Get doctor's availability for that day of week
    const dayName = DAYS[new Date(date).getDay()];
    const daySlots = (doctor.availability || []).filter(s => s.day === dayName);
    if (daySlots.length === 0) return res.json({ onLeave: false, slots: [], noSchedule: true });

    // Generate all possible slots
    const allSlots = daySlots.flatMap(s => generateSlots(s.startTime, s.endTime));

    // Get already booked appointments for this doctor on this date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const booked = await Appointment.find({
      doctor: doctorId,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['Pending', 'Approved'] }
    }).select('appointmentTime patient');

    const bookedMap = {};
    booked.forEach(apt => {
      bookedMap[apt.appointmentTime] = apt.patient?.toString();
    });

    const slots = allSlots.map(time => ({
      time,
      status: bookedMap[time] ? 'booked' : 'available',
      patientId: bookedMap[time] || null,
    }));

    res.json({ onLeave: false, slots, dayName });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Book an appointment (Patient)
// @route   POST /api/appointments
// @access  Private/Patient
const bookAppointment = async (req, res) => {
  const { doctor, department, appointmentDate, appointmentTime, reasonForVisit } = req.body;

  try {
    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor,
      department,
      appointmentDate,
      appointmentTime,
      reasonForVisit
    });

    // Notify patient that appointment is booked
    await Notification.create({
      user: req.user._id,
      title: '📅 Appointment Booked',
      message: `Your appointment for ${department} on ${new Date(appointmentDate).toLocaleDateString('en-IN')} at ${appointmentTime} has been submitted. Waiting for approval.`,
      type: 'appointment'
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all appointments based on role (Admin sees all, Doctor sees theirs, Patient sees theirs)
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res) => {
  try {
    let appointments;
    if (req.user.role === 'Admin') {
      appointments = await Appointment.find({})
        .populate('patient', 'name email phone')
        .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } });
    } else if (req.user.role === 'Doctor') {
      // Find the Doctor Profile ID associated with the logged-in User
      const Doctor = require('../models/Doctor');
      const doctorProfile = await Doctor.findOne({ user: req.user._id });
      if (!doctorProfile) return res.status(404).json({ message: 'Doctor profile not found' });
      
      appointments = await Appointment.find({ doctor: doctorProfile._id })
        .populate('patient', 'name email phone');
    } else { // Patient
      appointments = await Appointment.find({ patient: req.user._id })
        .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } });
    }

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update appointment status (Admin/Doctor)
// @route   PUT /api/appointments/:id/status
// @access  Private/Doctor/Admin
const updateAppointmentStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (appointment) {
      appointment.status = status;
      if (req.body.prescription) {
        appointment.prescription = req.body.prescription;
        
        // Create Medical Record
        await MedicalRecord.create({
          patient: appointment.patient,
          doctor: appointment.doctor,
          type: 'Prescription',
          title: `Consultation - ${appointment.reasonForVisit}`,
          prescription: req.body.prescription,
          date: new Date()
        });

        // Notify patient about prescription
        await Notification.create({
          user: appointment.patient,
          title: '💊 New Prescription Added',
          message: `Your doctor has added a prescription for your appointment on ${new Date(appointment.appointmentDate).toLocaleDateString('en-IN')}.`,
          type: 'prescription'
        });
      }

      // Notify patient about status change
      if (status === 'Approved') {
        await Notification.create({
          user: appointment.patient,
          title: '✅ Appointment Approved',
          message: `Your appointment for ${appointment.department} on ${new Date(appointment.appointmentDate).toLocaleDateString('en-IN')} at ${appointment.appointmentTime} has been approved.`,
          type: 'appointment'
        });
      } else if (status === 'Cancelled') {
        await Notification.create({
          user: appointment.patient,
          title: '❌ Appointment Cancelled',
          message: `Your appointment for ${appointment.department} on ${new Date(appointment.appointmentDate).toLocaleDateString('en-IN')} has been cancelled.`,
          type: 'appointment'
        });
      } else if (status === 'Completed') {
        await Notification.create({
          user: appointment.patient,
          title: '🏥 Appointment Completed',
          message: `Your appointment for ${appointment.department} on ${new Date(appointment.appointmentDate).toLocaleDateString('en-IN')} has been marked as completed.`,
          type: 'appointment'
        });
      }

      const updatedAppointment = await appointment.save();
      res.json(updatedAppointment);
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  bookAppointment,
  getAppointments,
  updateAppointmentStatus,
  getAvailableSlots,
};
