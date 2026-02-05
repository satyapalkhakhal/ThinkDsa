import Problem from '../models/Problem.js';
import Progress from '../models/Progress.js';
import mongoose from 'mongoose';

/**
 * @route   GET /api/topics/:topicId/problems
 * @desc    Get all problems for a topic with solved status for logged-in user
 * @access  Protected
 * 
 * Uses MongoDB aggregation to avoid N+1 queries
 * Returns problems with isCompleted field based on user's progress
 */
export const getProblemsByTopic = async (req, res) => {
    try {
        const { topicId } = req.params;
        const userId = req.user.id;

        // Validate topicId
        if (!mongoose.Types.ObjectId.isValid(topicId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid topic ID'
            });
        }

        // Optimized aggregation pipeline to fetch problems with solved status
        const problems = await Problem.aggregate([
            // Stage 1: Match problems for this topic
            {
                $match: {
                    topicId: new mongoose.Types.ObjectId(topicId)
                }
            },

            // Stage 2: Sort by order
            {
                $sort: { order: 1, createdAt: 1 }
            },

            // Stage 3: Lookup user's progress for each problem
            {
                $lookup: {
                    from: 'progresses',
                    let: { problemId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$problemId', '$$problemId'] },
                                        { $eq: ['$userId', new mongoose.Types.ObjectId(userId)] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'userProgress'
                }
            },

            // Stage 4: Add isCompleted field
            {
                $addFields: {
                    isCompleted: {
                        $cond: {
                            if: { $gt: [{ $size: '$userProgress' }, 0] },
                            then: { $arrayElemAt: ['$userProgress.isCompleted', 0] },
                            else: false
                        }
                    }
                }
            },

            // Stage 5: Remove userProgress array (we only need isCompleted)
            {
                $project: {
                    userProgress: 0
                }
            }
        ]);

        res.status(200).json({
            success: true,
            count: problems.length,
            data: problems
        });

    } catch (error) {
        console.error('Error fetching problems:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching problems',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/problems/:problemId
 * @desc    Get single problem with solved status
 * @access  Protected
 */
export const getProblemById = async (req, res) => {
    try {
        const { problemId } = req.params;
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(problemId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid problem ID'
            });
        }

        const problem = await Problem.findById(problemId).populate('topicId', 'title');

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: 'Problem not found'
            });
        }

        // Check if user has progress for this problem
        const progress = await Progress.findOne({
            userId,
            problemId
        });

        const problemData = problem.toObject();
        problemData.isCompleted = progress ? progress.isCompleted : false;

        res.status(200).json({
            success: true,
            data: problemData
        });

    } catch (error) {
        console.error('Error fetching problem:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching problem',
            error: error.message
        });
    }
};
