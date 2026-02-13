const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    descriptionEnglish: {
        type: String
    },
    descriptionHindi: {
        type: String
    },
    metaTitle: {
        type: String
    },
    metaDescription: {
        type: String
    },
    examCategory: {
        type: String,
        default: 'General'
    },
    language: {
        type: String,
        enum: ['english', 'hindi'],
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    duration: {
        type: Number, // in seconds
        required: true
    },
    totalWords: {
        type: Number,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    accessLevel: {
        type: String,
        enum: ['free', 'booster', 'pro'], // 'free' represents accessible by everyone, others require specific plans
        default: 'free'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Exam', examSchema);
