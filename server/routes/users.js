import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../model/User.js';
import { verifyToken, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', verifyToken, adminOnly, async (req, res) => {
  const { username, password, role, name } = req.body;
  if (!username || !password || !name || !role) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  if (!['admin', 'nurse'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'Username exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashed, role, name });
    await user.save();

    res.status(201).json({ message: 'User created', user: { username, role, name } });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Password change endpoint (for nurse self)
router.put('/change-password', verifyToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: 'Password changed' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;