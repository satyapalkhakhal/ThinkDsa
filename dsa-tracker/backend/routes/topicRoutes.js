import express from 'express';
import { getAllTopics } from '../controllers/topicController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get all topics with progress
router.get('/', protect, getAllTopics);

export default router;
