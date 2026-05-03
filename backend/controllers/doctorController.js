const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

// @desc    Get all active doctors
// @route   GET /api/doctors
// @access  Public (or Patient/Admin)
const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({}).populate('user', 'name email phone');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new doctor profile (Admin only)
// @route   POST /api/doctors
// @access  Private/Admin
const addDoctor = async (req, res) => {
  const { userId, specialization, experience, feesPerConsultation, availability } = req.body;

  try {
    // Check if user exists and is a Doctor role
    const userRoleExists = await User.findById(userId);
    if (!userRoleExists || userRoleExists.role !== 'Doctor') {
      return res.status(400).json({ message: 'User must be created with a Doctor role first' });
    }

    const doctorExists = await Doctor.findOne({ user: userId });
    if (doctorExists) {
      return res.status(400).json({ message: 'Doctor profile already exists for this user' });
    }

    const doctor = await Doctor.create({
      user: userId,
      specialization,
      experience,
      feesPerConsultation,
      availability
    });

    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current doctor profile
// @route   GET /api/doctors/me
// @access  Private (Doctor)
const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id }).populate('user', 'name email phone');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update doctor availability
// @route   PUT /api/doctors/availability
// @access  Private (Doctor)
const updateDoctorAvailability = async (req, res) => {
  const { availability } = req.body;

  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    doctor.availability = availability;
    const updatedDoctor = await doctor.save();
    res.json(updatedDoctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all unique patients of a doctor
// @route   GET /api/doctors/my-patients
// @access  Private (Doctor)
const getDoctorPatients = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });

    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate('patient', 'name email phone bloodGroup address createdAt')
      .sort({ createdAt: -1 });

    // Get unique patients with their latest appointment info
    const patientMap = {};
    appointments.forEach(apt => {
      if (!apt.patient) return;
      const pid = apt.patient._id.toString();
      if (!patientMap[pid]) {
        patientMap[pid] = {
          ...apt.patient.toObject(),
          totalAppointments: 0,
          lastVisit: apt.appointmentDate,
          lastReason: apt.reasonForVisit,
          lastStatus: apt.status,
        };
      }
      patientMap[pid].totalAppointments += 1;
      if (new Date(apt.appointmentDate) > new Date(patientMap[pid].lastVisit)) {
        patientMap[pid].lastVisit = apt.appointmentDate;
        patientMap[pid].lastReason = apt.reasonForVisit;
        patientMap[pid].lastStatus = apt.status;
      }
    });

    res.json(Object.values(patientMap));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get full details of a specific patient (for doctor view)
// @route   GET /api/doctors/patient/:id/details
// @access  Private (Doctor)
const getDoctorPatientDetails = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });

    const MedicalRecord = require('../models/MedicalRecord');
    const Bill = require('../models/Bill');

    const [appointments, medicalRecords, bills] = await Promise.all([
      Appointment.find({ doctor: doctor._id, patient: req.params.id })
        .sort({ appointmentDate: -1 }),
      MedicalRecord.find({ patient: req.params.id, doctor: doctor._id })
        .sort({ createdAt: -1 }),
      Bill.find({ patient: req.params.id, doctor: doctor._id })
        .sort({ createdAt: -1 }),
    ]);

    res.json({ appointments, medicalRecords, bills });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDoctors,
  addDoctor,
  getDoctorProfile,
  updateDoctorAvailability,
  getDoctorPatients,
  getDoctorPatientDetails,
};
