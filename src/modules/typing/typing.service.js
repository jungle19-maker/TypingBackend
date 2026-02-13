const EnglishContent = require('./EnglishContent.model');
const HindiContent = require('./HindiContent.model');
const Result = require('./Result.model');

// --- Content Retrieval ---
const getWords = async (language, limit, length, category) => {
    const Model = language === 'hindi' ? HindiContent : EnglishContent;
    const query = { type: 'word' };
    if (category) query.category = category;

    // Simple cache-like behavior or direct DB
    let words = await Model.find(query).lean();

    if (length) {
        words = words.filter(w => w.length === parseInt(length));
    }

    // Shuffle
    const shuffled = words.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit).map(w => w.content);
};

const getParagraphs = async (language, difficulty) => {
    const Model = language === 'hindi' ? HindiContent : EnglishContent;
    const query = { type: 'paragraph' };
    if (difficulty) query.difficulty = difficulty;

    const paras = await Model.find(query).lean();
    if (paras.length > 0) {
        return [paras[Math.floor(Math.random() * paras.length)]];
    }
    return [];
};

const getSentences = async (language, limit) => {
    const Model = language === 'hindi' ? HindiContent : EnglishContent;
    const sentences = await Model.find({ type: 'sentence' }).lean();

    const shuffled = sentences.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit).map(s => s.content);
};

// --- Result Management ---
const saveResult = async (userId, resultData) => {
    return await Result.create({
        user: userId,
        ...resultData
    });
};

const getUserHistory = async (userId) => {
    return await Result.find({ user: userId }).sort({ date: -1 });
};

// --- Admin Content Management ---
const getContent = async (language, type, page = 1, limit = 20) => {
    const Model = language === 'hindi' ? HindiContent : EnglishContent;
    const query = type ? { type } : {};

    const content = await Model.find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ _id: -1 });

    const total = await Model.countDocuments(query);

    return {
        data: content,
        totalPages: Math.ceil(total / limit),
        currentPage: page
    };
};

const addContent = async (language, data) => {
    const Model = language === 'hindi' ? HindiContent : EnglishContent;

    // Set length automatically for words
    if (data.type === 'word' && data.content) {
        data.length = data.content.length;
    }

    const newItem = new Model(data);
    return await newItem.save();
};

const updateContent = async (language, id, data) => {
    const Model = language === 'hindi' ? HindiContent : EnglishContent;

    if (data.type === 'word' && data.content) {
        data.length = data.content.length;
    }

    return await Model.findByIdAndUpdate(id, data, { new: true });
};

const deleteContent = async (language, id) => {
    const Model = language === 'hindi' ? HindiContent : EnglishContent;
    return await Model.findByIdAndDelete(id);
};

module.exports = {
    getWords,
    getParagraphs,
    getSentences,
    saveResult,
    getUserHistory,
    getContent,
    addContent,
    updateContent,
    deleteContent
};
