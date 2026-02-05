import express from 'express';
import { getProblemsByTopic, getProblemById } from '../controllers/problemController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected (require authentication)
router.use(protect);

// GET /api/topics/:topicId/problems - Get all problems for a topic with solved status
router.get('/topics/:topicId/problems', getProblemsByTopic);

// GET /api/problems/:problemId - Get single problem
router.get('/problems/:problemId', getProblemById);

export default router;
