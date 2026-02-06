import Topic from '../models/Topic.js';
import Problem from '../models/Problem.js';
import Progress from '../models/Progress.js';
import mongoose from 'mongoose';

/**
 * @route   GET /api/topics
 * @desc    Get all topics with progress for logged-in user
 * @access  Protected
 */
export const getAllTopics = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get all topics
        const topics = await Topic.find().sort({ order: 1 });

        // For each topic, calculate progress
        const topicsWithProgress = await Promise.all(
            topics.map(async (topic) => {
                // Count total problems for this topic
                const totalProblems = await Problem.countDocuments({ topicId: topic._id });

                // Count completed problems for this user in this topic
                const completedProblems = await Progress.aggregate([
                    {
                        $match: {
                            userId: new mongoose.Types.ObjectId(userId),
                            isCompleted: true
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
                            'problem.topicId': topic._id
                        }
                    },
                    {
                        $count: 'total'
                    }
                ]);

                const completed = completedProblems[0]?.total || 0;
                const percentage = totalProblems > 0 ? Math.round((completed / totalProblems) * 100) : 0;

                return {
                    _id: topic._id,
                    title: topic.title,
                    description: topic.description,
                    icon: topic.icon,
                    order: topic.order,
                    totalProblems,
                    completedProblems: completed,
                    progress: percentage
                };
            })
        );

        res.status(200).json({
            success: true,
            count: topicsWithProgress.length,
            data: topicsWithProgress
        });

    } catch (error) {
        console.error('Error fetching topics:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching topics',
            error: error.message
        });
    }
};
