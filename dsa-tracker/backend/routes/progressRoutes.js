import express from 'express';
import {
    toggleProblemCompletion,
    getUserStats,
    getTopicProgress
} from '../controllers/progressController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected (require authentication)
router.use(protect);

// POST /api/progress/toggle - Toggle problem completion
router.post('/toggle', toggleProblemCompletion);

// GET /api/progress/stats - Get user's overall statistics
router.get('/stats', getUserStats);

// GET /api/progress/topic/:topicId - Get progress for specific topic
router.get('/topic/:topicId', getTopicProgress);

export default router;
