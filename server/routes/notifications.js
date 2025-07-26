import express from 'express';
import Notification from '../model/Notification.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const notes = await Notification.find({ user: req.user.id, read: false }).sort({ createdAt: -1 });
    res.json(notes);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id/read', verifyToken, async (req, res) => {
  try {
    const notif = await Notification.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, { read: true }, { new: true });
    if (!notif) return res.status(404).json({ message: 'Notification not found' });
    res.json(notif);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;