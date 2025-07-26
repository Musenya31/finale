import express from 'express';
import Handover from '../model/Handover.js';
import Shift from '../model/Shift.js';
import { verifyToken, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    let handovers;
    if (req.user.role === 'admin') {
      handovers = await Handover.find()
        .populate('shift', 'date shiftType nurse')
        .populate('nurse', 'name');
    } else {
      handovers = await Handover.find({ nurse: req.user.id })
        .populate('shift', 'date shiftType');
    }
    res.json(handovers);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', verifyToken, async (req, res) => {
  const { shiftId, content } = req.body;
  if (!shiftId || !content) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  try {
    const shift = await Shift.findById(shiftId);
    if (!shift) return res.status(404).json({ message: 'Shift not found' });

    if (req.user.role !== 'admin' && shift.nurse.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to create handover for this shift' });
    }

    const existing = await Handover.findOne({ shift: shiftId, nurse: req.user.id });
    if (existing) return res.status(400).json({ message: 'Handover already created for this shift' });

    const handover = new Handover({ shift: shiftId, nurse: req.user.id, content });
    await handover.save();

    await handover.populate('shift', 'date shiftType');
    await handover.populate('nurse', 'name');

    res.status(201).json(handover);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', verifyToken, adminOnly, async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ message: 'Empty content' });
  try {
    const handover = await Handover.findByIdAndUpdate(req.params.id, { content }, { new: true })
      .populate('shift', 'date shiftType nurse')
      .populate('nurse', 'name');
    if (!handover) return res.status(404).json({ message: 'Handover not found' });
    res.json(handover);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', verifyToken, adminOnly, async (req, res) => {
  try {
    const deleted = await Handover.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Handover not found' });
    res.json({ message: 'Handover deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;