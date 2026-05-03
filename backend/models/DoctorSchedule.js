const mongoose = require('mongoose');

/**
 * DoctorSchedule — stores a doctor's schedule for a specific date.
 * Each schedule has morning/evening sessions and an optional lunch break.
 * 30-min slots are generated from these sessions on the fly.
 */
const doctorScheduleSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  // Morning session
  morningStart: { type: String, default: '' },  // e.g. "09:00"
  morningEnd:   { type: String, default: '' },  // e.g. "13:00"
  // Lunch break
  lunchStart:   { type: String, default: '' },  // e.g. "13:00"
  lunchEnd:     { type: String, default: '' },  // e.g. "14:00"
  // Afternoon/Evening session
  eveningStart: { type: String, default: '' },  // e.g. "14:00"
  eveningEnd:   { type: String, default: '' },  // e.g. "18:00"
  // Notes
  notes: { type: String, default: '' },
  isOff: { type: Boolean, default: false },     // mark full day off
}, { timestamps: true });

// Compound unique index: one schedule per doctor per date
doctorScheduleSchema.index({ doctor: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DoctorSchedule', doctorScheduleSchema);
