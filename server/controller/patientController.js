import Patient from '../models/Patient.js';

export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching patients' });
  }
};

export const createPatient = async (req, res) => {
  const { name, dob, gender, diagnosis } = req.body;

  if (!name || !dob || !gender) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const patient = new Patient({ name, dob, gender, diagnosis });
    await patient.save();
    res.status(201).json(patient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deletePatient = async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: 'Patient deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete patient' });
  }
};
