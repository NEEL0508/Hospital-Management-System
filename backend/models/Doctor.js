const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  experience: {
    type: Number, // In years
    required: true
  },
  feesPerConsultation: {
    type: Number,
    required: true
  },
  availability: [
    {
      day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
      startTime: { type: String },
      endTime: { type: String }
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Doctor', doctorSchema);
