import Shift from '../model/Shift.js';

// Nurse: Get only their upcoming shifts
export const getShifts = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const shifts = await Shift.find({
      nurse: userId,
      date: { $gte: today }
    }).populate('nurse', 'name');

    res.status(200).json(shifts);
  } catch (error) {
    console.error('Error fetching nurse shifts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Get all upcoming shifts with nurse names
export const getAllShiftsForAdmin = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const shifts = await Shift.find({
      date: { $gte: today }
    }).populate('nurse', 'name');

    res.status(200).json(shifts);
  } catch (error) {
    console.error('Error fetching all shifts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create shift
export const createShift = async (req, res) => {
  try {
    const { date, shiftType, startTime, endTime } = req.body;

    const newShift = new Shift({
      nurse: req.user.id,
      date,
      shiftType,
      startTime,
      endTime,
    });

    const savedShift = await newShift.save();
    const populatedShift = await Shift.findById(savedShift._id).populate('nurse', 'name');

    res.status(201).json(populatedShift);
  } catch (err) {
    console.error('Error creating shift:', err);
    res.status(500).json({ message: 'Failed to create shift' });
  }
};

// Update shift
export const updateShift = async (req, res) => {
  try {
    const updatedShift = await Shift.findOneAndUpdate(
      { _id: req.params.id, nurse: req.user.id },
      req.body,
      { new: true }
    ).populate('nurse', 'name');

    if (!updatedShift) {
      return res.status(404).json({ message: 'Shift not found or unauthorized' });
    }

    res.status(200).json(updatedShift);
  } catch (err) {
    console.error('Error updating shift:', err);
    res.status(500).json({ message: 'Update failed' });
  }
};

// Delete shift
export const deleteShift = async (req, res) => {
  try {
    const deleted = await Shift.findOneAndDelete({
      _id: req.params.id,
      nurse: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Shift not found or unauthorized' });
    }

    res.status(200).json({ message: 'Shift deleted successfully' });
  } catch (err) {
    console.error('Error deleting shift:', err);
    res.status(500).json({ message: 'Delete failed' });
  }
};

// Add comment
export const addComment = async (req, res) => {
  try {
    const shift = await Shift.findById(req.params.id);
    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }

    const comment = {
      author: req.user.id,
      comment: req.body.comment,
    };

    shift.comments.push(comment);
    await shift.save();

    const populatedShift = await Shift.findById(shift._id)
      .populate('nurse', 'name')
      .populate('comments.author', 'name');

    res.status(200).json(populatedShift);
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ message: 'Could not add comment' });
  }
};
