const mongoose = require('mongoose');

const doctorRatingSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
    default: '',
    maxlength: 500,
  },
}, { timestamps: true });

// One rating per patient per doctor
doctorRatingSchema.index({ doctor: 1, patient: 1 }, { unique: true });

module.exports = mongoose.model('DoctorRating', doctorRatingSchema);
