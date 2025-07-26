import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ShiftSchema = new mongoose.Schema({
  nurse: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  shiftType: { type: String, enum: ['morning', 'afternoon', 'night'], required: true },
  comments: [CommentSchema]
});

ShiftSchema.index({ nurse: 1, date: 1 }, { unique: true });

export default mongoose.model('Shift', ShiftSchema);