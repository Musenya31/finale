import Patient from '../model/Patient.js';

export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.status(200).json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createPatient = async (req, res) => {
  try {
    const newPatient = new Patient(req.body);
    const saved = await newPatient.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const updated = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: 'Patient not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deletePatient = async (req, res) => {
  try {
    const deleted = await Patient.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Patient not found' });
    res.status(200).json({ message: 'Patient deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
