import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'nurse'], default: 'nurse' },
  name: { type: String, required: true },
  nurseId: { type: String }, // Optional
});

export default mongoose.model('User', UserSchema);
