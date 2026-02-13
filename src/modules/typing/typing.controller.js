const typingService = require('./typing.service');

// --- English ---
const getWords = async (req, res) => {
    try {
        const { limit, length } = req.query;
        const words = await typingService.getWords('english', limit || 50, length);
        res.status(200).json({ status: 'success', data: words });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getCapitals = async (req, res) => {
    try {
        const { limit } = req.query;
        // Reusing getWords but filtering by category is better if service supported it
        // Service supports category
        const words = await typingService.getWords('english', limit || 30, undefined, 'capital');
        res.status(200).json({ status: 'success', data: words });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getParagraphs = async (req, res) => {
    try {
        const { difficulty } = req.query;
        const paras = await typingService.getParagraphs('english', difficulty || 'beginner');
        res.status(200).json({ status: 'success', data: paras });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- Hindi ---
const getHindiWords = async (req, res) => {
    try {
        const { limit } = req.query;
        const words = await typingService.getWords('hindi', limit || 50);
        res.status(200).json({ status: 'success', data: words });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getHindiSentences = async (req, res) => {
    try {
        const { limit } = req.query;
        const sentences = await typingService.getSentences('hindi', limit || 10);
        res.status(200).json({ status: 'success', data: sentences });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getHindiParagraphs = async (req, res) => {
    try {
        const { difficulty } = req.query;
        const paras = await typingService.getParagraphs('hindi', difficulty || 'beginner');
        res.status(200).json({ status: 'success', data: paras });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- Results ---
const saveResult = async (req, res) => {
    try {
        const { gameType, wpm, accuracy, mistakeCount, language } = req.body;
        if (!gameType || wpm === undefined || accuracy === undefined) {
            return res.status(400).json({ message: 'Please provide all game data' });
        }

        const result = await typingService.saveResult(req.user.id, {
            gameType, wpm, accuracy, mistakeCount, language: language || 'english'
        });
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getHistory = async (req, res) => {
    try {
        const history = await typingService.getUserHistory(req.user.id);
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- Admin Content Management ---
const getContent = async (req, res) => {
    try {
        const { language, type, page, limit } = req.query;
        const result = await typingService.getContent(language, type, page, limit);
        res.status(200).json({ status: 'success', ...result });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const addContent = async (req, res) => {
    try {
        const { language, ...data } = req.body;
        const newItem = await typingService.addContent(language, data);
        res.status(201).json({ status: 'success', data: newItem });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateContent = async (req, res) => {
    try {
        const { language, id, ...data } = req.body;
        await typingService.updateContent(language, id, data);
        res.status(200).json({ status: 'success', message: 'Content updated' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteContent = async (req, res) => {
    try {
        const { language, id } = req.query;
        await typingService.deleteContent(language, id);
        res.status(200).json({ status: 'success', message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getWords,
    getCapitals,
    getParagraphs,
    getHindiWords,
    getHindiSentences,
    getHindiParagraphs,
    saveResult,
    getHistory,
    getContent,
    addContent,
    updateContent,
    deleteContent
};
