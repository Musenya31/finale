import express from 'express';
import Shift from '../model/Shift.js';
import User from '../model/User.js';
import { verifyToken, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    let shifts;
    if (req.user.role === 'admin') {
      shifts = await Shift.find().populate('nurse', 'name');
    } else {
      shifts = await Shift.find({ nurse: req.user.id }).populate('nurse', 'name');
    }
    res.json(shifts);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', verifyToken, adminOnly, async (req, res) => {
  const { nurseId, date, shiftType } = req.body;
  if (!nurseId || !date || !shiftType) return res.status(400).json({ message: 'Missing fields' });
  if (!['morning', 'afternoon', 'night'].includes(shiftType)) return res.status(400).json({ message: 'Invalid shift type' });

  try {
    const nurse = await User.findById(nurseId);
    if (!nurse || nurse.role !== 'nurse') return res.status(400).json({ message: 'Invalid nurse' });

    const shiftDate = new Date(date);
    const shift = new Shift({ nurse: nurseId, date: shiftDate, shiftType });
    await shift.save();
    res.status(201).json(shift);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: 'Shift already assigned to nurse on this date' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

router.put('/:id', verifyToken, adminOnly, async (req, res) => {
  const { nurseId, date, shiftType } = req.body;
  if (!nurseId || !date || !shiftType) return res.status(400).json({ message: 'Missing fields' });

  if (!['morning', 'afternoon', 'night'].includes(shiftType))
    return res.status(400).json({ message: 'Invalid shift type' });

  try {
    const nurse = await User.findById(nurseId);
    if (!nurse || nurse.role !== 'nurse') return res.status(400).json({ message: 'Invalid nurse' });

    const shiftDate = new Date(date);
    const conflict = await Shift.findOne({
      nurse: nurseId,
      date: shiftDate,
      _id: { $ne: req.params.id },
    });
    if (conflict) {
      return res.status(400).json({ message: 'Shift already assigned to nurse on this date' });
    }

    const shift = await Shift.findByIdAndUpdate(
      req.params.id,
      { nurse: nurseId, date: shiftDate, shiftType },
      { new: true }
    ).populate('nurse', 'name');

    if (!shift) return res.status(404).json({ message: 'Shift not found' });

    res.json(shift);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', verifyToken, adminOnly, async (req, res) => {
  try {
    await Shift.findByIdAndDelete(req.params.id);
    res.json({ message: 'Shift deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Post comment to shift
router.post('/:id/comments', verifyToken, async (req, res) => {
  const { comment } = req.body;
  if (!comment) return res.status(400).json({ message: 'Empty comment' });

  try {
    const shift = await Shift.findById(req.params.id);
    if (!shift) return res.status(404).json({ message: 'Shift not found' });

    if (shift.nurse.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    shift.comments.push({ author: req.user.id, comment });
    await shift.save();
    await shift.populate('comments.author', 'name');

    res.json(shift);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;