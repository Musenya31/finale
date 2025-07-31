import express from 'express';
import {
  getPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient
} from '../controller/patientController.js';
import { verifyToken as auth } from '../middleware/auth.js';
import { adminOnly, nurseOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getPatients);
router.get('/:id', auth, getPatient);
router.post('/', auth, createPatient);
router.put('/:id', auth, updatePatient);
router.delete('/:id', auth, deletePatient);

export default router;
