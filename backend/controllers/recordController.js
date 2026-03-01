const MedicalRecord = require('../models/MedicalRecord');
const Appointment = require('../models/Appointment');

const getMyRecords = async (req, res) => {
  try {
    // Fetch manual medical records
    const manualRecords = await MedicalRecord.find({ patient: req.user._id })
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
      .lean();

    // Fetch completed appointments to show as consultation records
    const appointments = await Appointment.find({ patient: req.user._id, status: 'Completed' })
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
      .lean();

    // Transform appointments into record-like format
    const appointmentRecords = appointments.map(apt => ({
      _id: apt._id,
      patient: apt.patient,
      doctor: apt.doctor,
      type: 'Consultation',
      title: `Consultation - ${apt.reasonForVisit}`,
      date: apt.appointmentDate,
      prescription: apt.prescription,
      isAppointment: true
    }));

    // Combine and sort by date descending
    const allRecords = [...manualRecords, ...appointmentRecords].sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(allRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addRecord = async (req, res) => {
  const { patient, doctor, type, title, fileUrl } = req.body;
  try {
    const record = await MedicalRecord.create({
      patient,
      doctor,
      type,
      title,
      fileUrl
    });
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMyRecords,
  addRecord
};
