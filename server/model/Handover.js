import mongoose from 'mongoose';

const handoverSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  nurse: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shiftType: { type: String, enum: ['Morning', 'Evening', 'Night'], required: true },
  notes: { type: String },
  observations: { type: String },
  medicationGiven: { type: String },
  vitals: {
    temperature: { type: String },
    bloodPressure: { type: String },
    pulse: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Handover', handoverSchema);
