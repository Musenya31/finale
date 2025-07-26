import express from 'express';
import {
  getShifts,
  createShift,
  updateShift,
  deleteShift,
  addComment
} from '../controller/shiftController.js';

const router = express.Router();

router.get('/', getShifts);
router.post('/', createShift);
router.put('/:id', updateShift);
router.delete('/:id', deleteShift);
router.post('/:id/comments', addComment);

export default router;
