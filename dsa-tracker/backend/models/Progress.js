import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Progress must belong to a user'],
        index: true
    },
    problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        required: [true, 'Progress must be for a problem'],
        index: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date
    },
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Compound unique index to prevent duplicate progress entries
// This is CRITICAL for performance and data integrity
progressSchema.index({ userId: 1, problemId: 1 }, { unique: true });

// Index for user-specific queries (get all user progress)
progressSchema.index({ userId: 1, isCompleted: 1 });

// Update completedAt timestamp when isCompleted changes to true
progressSchema.pre('save', function (next) {
    if (this.isModified('isCompleted') && this.isCompleted) {
        this.completedAt = new Date();
    } else if (this.isModified('isCompleted') && !this.isCompleted) {
        this.completedAt = null;
    }
    next();
});

const Progress = mongoose.model('Progress', progressSchema);

export default Progress;
