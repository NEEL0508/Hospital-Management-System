const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');
const Notification = require('../models/Notification');

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
  updateAppointmentStatus
};
