import express from 'express';
import {
    toggleProblemCompletion,
    toggleProblemByNumber,
    getAllProgress,
    getUserStats,
    getTopicProgress
} from '../controllers/progressController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected (require authentication)
router.use(protect);

// POST /api/progress/toggle - Toggle problem completion (ObjectId)
router.post('/toggle', toggleProblemCompletion);

// POST /api/progress/toggle-number - Toggle problem completion (numeric ID)
router.post('/toggle-number', toggleProblemByNumber);

// GET /api/progress/all - Get all user progress
router.get('/all', getAllProgress);

// GET /api/progress/stats - Get user's overall statistics
router.get('/stats', getUserStats);

// GET /api/progress/topic/:topicId - Get progress for specific topic
router.get('/topic/:topicId', getTopicProgress);

export default router;
