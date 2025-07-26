import Note from '../models/Note.js';

export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find().populate('author', 'name');
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notes' });
  }
};

export const createNote = async (req, res) => {
  const { author, content } = req.body;
  if (!author || !content) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const note = new Note({ author, content });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete note' });
  }
};
