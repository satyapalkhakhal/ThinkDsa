import Progress from '../models/Progress.js';
import Problem from '../models/Problem.js';
import mongoose from 'mongoose';

/**
 * @route   POST /api/progress/toggle
 * @desc    Toggle problem completion status
 * @access  Protected
 * 
 * If progress exists → toggle isCompleted
 * If not → create progress with isCompleted = true
 */
export const toggleProblemCompletion = async (req, res) => {
    try {
        const { problemId } = req.body;
        const userId = req.user.id;

        // Validate problemId
        if (!problemId || !mongoose.Types.ObjectId.isValid(problemId)) {
            return res.status(400).json({
                success: false,
                message: 'Valid problem ID is required'
            });
        }

        // Verify problem exists
        const problemExists = await Problem.findById(problemId);
        if (!problemExists) {
            return res.status(404).json({
                success: false,
                message: 'Problem not found'
            });
        }

        // Find existing progress
        let progress = await Progress.findOne({
            userId,
            problemId
        });

        if (progress) {
            // Toggle existing progress
            progress.isCompleted = !progress.isCompleted;
            await progress.save();
        } else {
            // Create new progress entry with isCompleted = true
            progress = await Progress.create({
                userId,
                problemId,
                isCompleted: true
            });
        }

        res.status(200).json({
            success: true,
            data: {
                problemId: progress.problemId,
                isCompleted: progress.isCompleted,
                completedAt: progress.completedAt
            }
        });

    } catch (error) {
        console.error('Error toggling progress:', error);

        // Handle duplicate key error (shouldn't happen with proper index, but just in case)
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Progress entry already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error updating progress',
            error: error.message
        });
    }
};

/**
 * @route   POST /api/progress/toggle-number
 * @desc    Toggle problem completion by numeric ID (for frontend mock data)
 * @access  Protected
 */
export const toggleProblemByNumber = async (req, res) => {
    try {
        const { problemId } = req.body;
        const userId = req.user.id;

        // Validate problemId is a number
        if (!problemId || typeof problemId !== 'number') {
            return res.status(400).json({
                success: false,
                message: 'Valid numeric problem ID is required'
            });
        }

        // Find existing progress
        let progress = await Progress.findOne({
            userId,
            problemId: problemId // Store as number
        });

        if (progress) {
            // Toggle existing progress
            progress.isCompleted = !progress.isCompleted;
            await progress.save();
        } else {
            // Create new progress entry with isCompleted = true
            progress = await Progress.create({
                userId,
                problemId: problemId,
                isCompleted: true
            });
        }

        res.status(200).json({
            success: true,
            data: {
                problemId: progress.problemId,
                isCompleted: progress.isCompleted,
                completedAt: progress.completedAt
            }
        });

    } catch (error) {
        console.error('Error toggling progress:', error);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Progress entry already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error updating progress',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/progress/all
 * @desc    Get all user's progress (for frontend)
 * @access  Protected
 */
export const getAllProgress = async (req, res) => {
    try {
        const userId = req.user.id;

        const progress = await Progress.find({ userId });

        // Return as array of completed problem IDs for easy lookup
        const completedProblems = progress
            .filter(p => p.isCompleted)
            .map(p => p.problemId);

        res.status(200).json({
            success: true,
            data: {
                completedProblems,
                total: progress.length,
                completed: completedProblems.length
            }
        });

    } catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching progress',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/progress/stats
 * @desc    Get user's overall progress statistics
 * @access  Protected
 */
export const getUserStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const stats = await Progress.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $group: {
                    _id: '$isCompleted',
                    count: { $sum: 1 }
                }
            }
        ]);

        const completed = stats.find(s => s._id === true)?.count || 0;
        const attempted = stats.reduce((sum, s) => sum + s.count, 0);

        res.status(200).json({
            success: true,
            data: {
                completed,
                attempted,
                total: 20, // Total problems in mock data
                percentage: attempted > 0 ? Math.round((completed / attempted) * 100) : 0
            }
        });

    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/progress/topic/:topicId
 * @desc    Get user's progress for a specific topic
 * @access  Protected
 */
export const getTopicProgress = async (req, res) => {
    try {
        const { topicId } = req.params;
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(topicId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid topic ID'
            });
        }

        const progress = await Progress.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: 'problems',
                    localField: 'problemId',
                    foreignField: '_id',
                    as: 'problem'
                }
            },
            {
                $unwind: '$problem'
            },
            {
                $match: {
                    'problem.topicId': new mongoose.Types.ObjectId(topicId)
                }
            },
            {
                $group: {
                    _id: '$isCompleted',
                    count: { $sum: 1 }
                }
            }
        ]);

        const completed = progress.find(p => p._id === true)?.count || 0;
        const total = progress.reduce((sum, p) => sum + p.count, 0);

        res.status(200).json({
            success: true,
            data: {
                topicId,
                completed,
                total,
                percentage: total > 0 ? Math.round((completed / total) * 100) : 0
            }
        });

    } catch (error) {
        console.error('Error fetching topic progress:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching topic progress',
            error: error.message
        });
    }
};
