import Handover from '../model/Handover.js';

// Create a new handover
export const createHandover = async (req, res) => {
  try {
    const { patientId, shiftType, notes, observations, medicationGiven, vitals } = req.body;

    const handover = new Handover({
      patient: patientId,
      nurse: req.user.id,
      shiftType,
      notes,
      observations,
      medicationGiven,
      vitals,
    });

    await handover.save();
    res.status(201).json(handover);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all handovers for a patient
export const getHandoversByPatient = async (req, res) => {
  try {
    const handovers = await Handover.find({ patient: req.params.id })
      .populate('nurse', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(handovers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all handovers written by logged-in nurse
export const getMyHandovers = async (req, res) => {
  try {
    const handovers = await Handover.find({ nurse: req.user.id })
      .populate('patient', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json(handovers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a handover (admin or nurse who created it)
export const deleteHandover = async (req, res) => {
  try {
    const handover = await Handover.findById(req.params.id);
    if (!handover) return res.status(404).json({ message: 'Handover not found' });

    const isOwner = handover.nurse.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this handover' });
    }

    await handover.remove();
    res.status(200).json({ message: 'Handover deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getAllHandovers = async (req, res) => {
  try {
    const handovers = await Handover.find()
      .populate('patient', 'firstName lastName')
      .populate('nurse', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(handovers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

