const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    gameType: {
        type: String,
        required: true,
        enum: [
            'Time Attack', 'Word Rain', 'Sentence Challenge', 'Survival', 'Typing Race',
            'classic', 'word-rain', 'sentence', 'survival', 'race',
            'practice-2-letter', 'practice-3-letter', 'practice-capital', 'practice-paragraph'
        ]
    },
    wpm: {
        type: Number,
        required: true
    },
    accuracy: {
        type: Number,
        required: true
    },
    mistakeCount: {
        type: Number,
        default: 0
    },
    language: {
        type: String,
        enum: ['english', 'hindi'],
        default: 'english'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Result', resultSchema);
