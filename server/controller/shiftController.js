import Shift from '../model/Shift.js';

export const getShifts = async (req, res) => {
  try {
    const shifts = await Shift.find().populate('nurse', 'name nurseId');
    res.json(shifts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createShift = async (req, res) => {
  const { nurse, date, shiftType } = req.body;
  if (!nurse || !date || !shiftType) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const existing = await Shift.findOne({ nurse, date });
    if (existing) return res.status(409).json({ message: 'Shift already exists for this nurse on this date' });

    const newShift = new Shift({ nurse, date, shiftType });
    await newShift.save();
    res.status(201).json(newShift);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateShift = async (req, res) => {
  try {
    const shift = await Shift.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(shift);
  } catch (err) {
    res.status(400).json({ message: 'Invalid update' });
  }
};

export const deleteShift = async (req, res) => {
  try {
    await Shift.findByIdAndDelete(req.params.id);
    res.json({ message: 'Shift deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Delete failed' });
  }
};

export const addComment = async (req, res) => {
  const { comment, author } = req.body;
  try {
    const shift = await Shift.findById(req.params.id);
    if (!shift) return res.status(404).json({ message: 'Shift not found' });

    shift.comments.push({ author, comment });
    await shift.save();
    res.json(shift);
  } catch (err) {
    res.status(500).json({ message: 'Comment failed' });
  }
};
