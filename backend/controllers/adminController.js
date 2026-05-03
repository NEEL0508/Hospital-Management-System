const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');
const Bill = require('../models/Bill');

const getAdminStats = async (req, res) => {
  try {
    const totalDoctors = await Doctor.countDocuments();
    const totalPatients = await User.countDocuments({ role: 'Patient' });
    const totalAppointments = await Appointment.countDocuments();
    
    const doctorsList = await Doctor.find().populate('user', 'name');
    const departmentsMap = {};
    doctorsList.forEach(doc => {
      if (!departmentsMap[doc.specialization]) {
        departmentsMap[doc.specialization] = [];
      }
      departmentsMap[doc.specialization].push(doc);
    });

    const pendingAppointments = await Appointment.find({ status: 'Pending' })
      .populate('patient', 'name email')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
      .limit(5);

    const upcomingAppointments = await Appointment.find({ 
        status: 'Approved', 
        appointmentDate: { $gte: new Date(new Date().setHours(0,0,0,0)) }
      })
      .populate('patient', 'name email')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
      .sort({ appointmentDate: 1 })
      .limit(5);

    res.json({
      totalDoctors,
      totalPatients,
      totalAppointments,
      departments: departmentsMap,
      pendingAppointments,
      upcomingAppointments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: 'Patient' }).select('-password').sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get full patient details: profile + appointments + medical records + bills
// @route GET /api/admin/patients/:id/details
const getPatientDetails = async (req, res) => {
  try {
    const patient = await User.findById(req.params.id).select('-password');
    if (!patient || patient.role !== 'Patient') {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const [appointments, medicalRecords, bills] = await Promise.all([
      Appointment.find({ patient: req.params.id })
        .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
        .sort({ appointmentDate: -1 }),
      MedicalRecord.find({ patient: req.params.id })
        .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
        .sort({ createdAt: -1 }),
      Bill.find({ patient: req.params.id })
        .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
        .sort({ createdAt: -1 }),
    ]);

    res.json({ patient, appointments, medicalRecords, bills });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAdminStats, getPatients, getPatientDetails };
