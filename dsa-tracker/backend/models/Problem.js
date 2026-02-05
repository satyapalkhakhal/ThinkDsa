import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
    topicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: [true, 'Problem must belong to a topic'],
        index: true
    },
    title: {
        type: String,
        required: [true, 'Please provide a problem title'],
        trim: true
    },
    difficulty: {
        type: String,
        required: [true, 'Please specify difficulty level'],
        enum: {
            values: ['EASY', 'MEDIUM', 'HARD'],
            message: 'Difficulty must be EASY, MEDIUM, or HARD'
        },
        index: true
    },
    links: {
        youtube: {
            type: String,
            trim: true
        },
        leetcode: {
            type: String,
            trim: true
        },
        article: {
            type: String,
            trim: true
        }
    },
    description: {
        type: String,
        trim: true
    },
    order: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound index for efficient topic + difficulty queries
problemSchema.index({ topicId: 1, difficulty: 1 });
problemSchema.index({ topicId: 1, order: 1 });

const Problem = mongoose.model('Problem', problemSchema);

export default Problem;
