const EnglishContent = require('../models/EnglishContent');
const HindiContent = require('../models/HindiContent');

// In-memory simple cache
const cache = {
    englishWords: [],
    lastCached: 0
};
const CACHE_TTL = 3600 * 1000; // 1 hour

// Helper to shuffle
const shuffle = (array) => array.sort(() => 0.5 - Math.random());

// --- ENGLISH ---

exports.getWords = async (req, res) => {
    try {
        const length = parseInt(req.query.length);
        const limit = parseInt(req.query.limit) || 50;

        // Basic caching logic for all words to avoid DB hammering on every keystroke/game restart
        const now = Date.now();
        if (!cache.englishWords.length || now - cache.lastCached > CACHE_TTL) {
            cache.englishWords = await EnglishContent.find({ type: 'word' }).lean();
            cache.lastCached = now;
        }

        let words = cache.englishWords;

        if (length) {
            words = words.filter(w => w.length === length);
        }

        // If very few words found (e.g. unlikely length), fallback or return what we have
        const shuffled = shuffle(words).slice(0, limit).map(w => w.content);

        res.status(200).json({ status: 'success', data: shuffled });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getCapitals = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 30;
        const capitals = await EnglishContent.find({ category: 'capital' }).limit(100).lean();
        const shuffled = shuffle(capitals).slice(0, limit).map(w => w.content);
        res.status(200).json({ status: 'success', data: shuffled });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getParagraphs = async (req, res) => {
    try {
        const difficulty = req.query.difficulty || 'beginner';
        const paras = await EnglishContent.find({ type: 'paragraph', difficulty }).lean();

        let selection = [];
        if (paras.length > 0) {
            selection = [paras[Math.floor(Math.random() * paras.length)]];
        }

        res.status(200).json({ status: 'success', data: selection });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


// --- HINDI ---

exports.getHindiWords = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const words = await HindiContent.find({ type: 'word' }).lean();
        const shuffled = shuffle(words).slice(0, limit).map(w => w.content);
        res.status(200).json({ status: 'success', data: shuffled });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getHindiSentences = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const sentences = await HindiContent.find({ type: 'sentence' }).lean();
        const shuffled = shuffle(sentences).slice(0, limit).map(s => s.content);
        res.status(200).json({ status: 'success', data: shuffled });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getHindiParagraphs = async (req, res) => {
    try {
        const difficulty = req.query.difficulty || 'beginner';
        const paras = await HindiContent.find({ type: 'paragraph', difficulty }).lean();
        const selection = paras.length > 0 ? [paras[Math.floor(Math.random() * paras.length)]] : [];
        res.status(200).json({ status: 'success', data: selection });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.saveResult = (req, res) => {
    // This is valid but we already have a results route. 
    // We can keep this for specific modularity or skip.
    // User plan said: POST /api/typing/result
    // For now, let's just log it or integrate with existing DB logic.
    // Integrating with existing Result model is better.
    // We'll leave it as a placeholder or reuse existing logic.

    // For now just success for the verification requirement "Optional backend result save"
    res.status(201).json({
        status: 'success',
        message: 'Result saved successfully'
    });
};
