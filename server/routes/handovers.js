import express from 'express';
import {
  createHandover,
  getHandoversByPatient,
  getMyHandovers,
  deleteHandover,
} from '../controller/handoverController.js';
import { verifyToken } from '../middleware/auth.js';

import { getAllHandovers } from '../controller/handoverController.js';




const router = express.Router();

// POST /api/handovers
router.post('/', verifyToken, createHandover);

// GET /api/handovers/patient/:id
router.get('/patient/:id', verifyToken, getHandoversByPatient);

// GET /api/handovers/mynotes
router.get('/mynotes', verifyToken, getMyHandovers);

// DELETE /api/handovers/:id
router.delete('/:id', verifyToken, deleteHandover);

router.get('/', verifyToken, getAllHandovers);

export default router;
