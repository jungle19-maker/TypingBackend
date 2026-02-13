const mongoose = require('mongoose');

const englishContentSchema = new mongoose.Schema({
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
        type: Number // e.g. 2, 3, 5 for words
    },
    category: {
        type: String // e.g. 'capital', 'mixed', 'tech'
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

module.exports = mongoose.model('EnglishContent', englishContentSchema);
