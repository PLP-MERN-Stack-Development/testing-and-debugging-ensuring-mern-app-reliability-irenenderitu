import express from 'express';
import {
  getAllBugs,
  getBugById,
  createBug,
  updateBug,
  deleteBug
} from '../controllers/bugController.js';

const router = express.Router();

router.get('/', getAllBugs);
router.get('/:id', getBugById);
router.post('/', createBug);
router.put('/:id', updateBug);
router.delete('/:id', deleteBug);

export default router;