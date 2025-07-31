import express from 'express';
import Note from '../model/Notes.js';
import { verifyToken, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// ✅ Get all notes
router.get('/', verifyToken, async (req, res) => {
  try {
    const notes = await Note.find().populate('author', 'name');
    res.json(notes);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Create a new note
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

// ✅ Update a note
router.put('/:id', verifyToken, adminOnly, async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { content: req.body.content },
      { new: true }
    );
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Delete a note
router.delete('/:id', verifyToken, adminOnly, async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
