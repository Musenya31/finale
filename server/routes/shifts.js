import express from 'express';
import {
  getShifts,
  createShift,
  updateShift,
  deleteShift,
  addComment,
  getAllShiftsForAdmin
} from '../controller/shiftController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, getShifts);                // Nurse: own shifts
router.get('/admin', verifyToken, getAllShiftsForAdmin); // Admin: all shifts
router.post('/', verifyToken, createShift);
router.put('/:id', verifyToken, updateShift);
router.delete('/:id', verifyToken, deleteShift);
router.post('/:id/comments', verifyToken, addComment);

export default router;
