const Result = require('../models/Result');

// @desc    Save game result
// @route   POST /api/results
// @access  Private
const saveResult = async (req, res) => {
    const { gameType, wpm, accuracy, mistakeCount, language } = req.body;

    if (!gameType || wpm === undefined || accuracy === undefined) {
        return res.status(400).json({ message: 'Please provide all game data' });
    }

    const result = await Result.create({
        user: req.user.id,
        gameType,
        wpm,
        accuracy,
        mistakeCount,
        language: language || 'english'
    });

    res.status(201).json(result);
};

// @desc    Get user history
// @route   GET /api/results/history
// @access  Private
const getHistory = async (req, res) => {
    const results = await Result.find({ user: req.user.id }).sort({ date: -1 });

    res.status(200).json(results);
};

module.exports = {
    saveResult,
    getHistory,
};
