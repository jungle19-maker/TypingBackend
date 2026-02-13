const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    name: {
        type: String, // 'Free', 'Starter', 'Pro', 'Premium'
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'INR'
    },
    // Explicit Feature Flags for Frontend Access Control
    features: {
        // Practice Modes
        englishPractice: { type: Boolean, default: true },
        hindiWordPractice: { type: Boolean, default: false },
        hindiSentencePractice: { type: Boolean, default: false },
        hindiParagraphPractice: { type: Boolean, default: false },
        advancedHindiPractice: { type: Boolean, default: false },
        capitalLetterPractice: { type: Boolean, default: false }, // Starter+
        sentenceTyping: { type: Boolean, default: false }, // Starter+

        // Games
        classicGameMode: { type: Boolean, default: true }, // Free
        survivalGameMode: { type: Boolean, default: false }, // Pro+
        typingRaceMode: { type: Boolean, default: false }, // Premium
        wordRainMode: { type: Boolean, default: false }, // Explicit check if needed

        // Analytics & content
        adFree: { type: Boolean, default: false }, // Starter+
        weeklyReports: { type: Boolean, default: false }, // Pro+
        detailedAnalytics: { type: Boolean, default: false }, // Premium
        weakKeyAnalysis: { type: Boolean, default: false } // Premium
    },
    // UI Display List (human readable)
    displayFeatures: [{
        type: String
    }],
});

module.exports = mongoose.model('Plan', planSchema);
