import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  age: { type: Number, required: true },
  contact: { type: String },
  address: { type: String },
  medicalHistory: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Patient', patientSchema);
