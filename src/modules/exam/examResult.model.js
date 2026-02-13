const mongoose = require('mongoose');

const examResultSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true
    },
    wpm: {
        type: Number,
        required: true
    },
    accuracy: {
        type: Number,
        required: true
    },
    errorCount: {
        type: Number,
        default: 0
    },
    backspaceCount: {
        type: Number,
        default: 0
    },
    keyStrokes: {
        type: Number,
        default: 0
    },
    completedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ExamResult', examResultSchema);
