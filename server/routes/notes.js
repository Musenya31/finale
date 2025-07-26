import express from 'express';
import Note from '../model/Notes.js';
import { verifyToken, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const notes = await Note.find().populate('author', 'name');
    res.json(notes);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', verifyToken, adminOnly, async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ message: 'Empty content' });

  try {
    const note = new Note({ author: req.user.id, content });
    await note.save();
    res.status(201).json(note);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;