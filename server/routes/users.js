import express  from  'express';
import bcrypt  from 'bcryptjs';
import User from '../model/User.js';
import  { verifyToken, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// CREATE USER
router.post('/', verifyToken, adminOnly, async (req, res) => {
  const { username, password, role, name, email, nurseId } = req.body;

  // Check required fields
  if (!username || !password || !name || !role || !email) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Validate role
  if (!['admin', 'nurse'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role specified' });
  }

  try {
    // Check if user already exists
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'Username already exists' });

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      username,
      password: hashed,
      role,
      name,
      email,
      nurseId // Optional
    });

    await user.save();

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        name: user.name,
        email: user.email,
        nurseId: user.nurseId || null
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error while creating user' });
  }
});
// Get all users (admin only)
router.get('/', verifyToken, adminOnly, async (req, res) => {
  try {
    const users = await User.find(); // or filter as needed
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});


export default router;
