const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    subscription: {
        planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' }, // Link to Plan model
        planName: { type: String, default: 'free' }, // Snapshot for quick access
        status: { type: String, enum: ['active', 'expired', 'cancelled', 'trial', 'banned'], default: 'trial' },
        startDate: { type: Date, default: Date.now },
        expiryDate: { type: Date } // Important for trial/sub expiry
    },
    language: {
        type: String,
        enum: ['english', 'hindi'],
        default: 'english'
    },
    trialActive: {
        type: Boolean,
        default: true
    },
    // For Exams
    dailyExamCount: {
        type: Number,
        default: 0
    },
    lastExamDate: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
