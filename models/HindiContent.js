const mongoose = require('mongoose');

const hindiContentSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['word', 'sentence', 'paragraph'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    length: {
        type: Number // helpful for filtering by length
    },
    planAccess: {
        type: String,
        enum: ['free', 'starter', 'pro', 'premium'],
        default: 'free'
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
});

module.exports = mongoose.model('HindiContent', hindiContentSchema);
