import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a topic title'],
        trim: true,
        unique: true
    },
    description: {
        type: String,
        trim: true
    },
    icon: {
        type: String,
        default: '📚'
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
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index for ordering topics
topicSchema.index({ order: 1 });

// Virtual for problems count
topicSchema.virtual('problemsCount', {
    ref: 'Problem',
    localField: '_id',
    foreignField: 'topicId',
    count: true
});

const Topic = mongoose.model('Topic', topicSchema);

export default Topic;
