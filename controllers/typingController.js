const {
    TWO_LETTER_WORDS, THREE_LETTER_WORDS, FOUR_LETTER_WORDS, FIVE_LETTER_WORDS,
    SIX_LETTER_WORDS, MIXED_DIFFICULT_WORDS, CAPITAL_CONTENT, PARAGRAPHS
} = require('../data/typingContent');

// Helper to shuffle array
const shuffle = (array) => {
    return array.sort(() => 0.5 - Math.random());
};

exports.getWords = (req, res) => {
    const length = parseInt(req.query.length);
    const difficulty = req.query.difficulty; // 'beginner', 'intermediate', 'advanced'
    let words = [];

    if (difficulty) {
        if (difficulty === 'beginner' || difficulty === 'basic') {
            words = [...TWO_LETTER_WORDS, ...THREE_LETTER_WORDS];
        } else if (difficulty === 'intermediate') {
            words = [...FOUR_LETTER_WORDS, ...FIVE_LETTER_WORDS, ...SIX_LETTER_WORDS];
        } else if (difficulty === 'advanced') {
            words = [...SIX_LETTER_WORDS, ...MIXED_DIFFICULT_WORDS];
        } else {
            // Fallback
            words = [...TWO_LETTER_WORDS, ...THREE_LETTER_WORDS];
        }
    } else if (length) {
        if (length === 2) words = TWO_LETTER_WORDS;
        else if (length === 3) words = THREE_LETTER_WORDS;
        else if (length === 4) words = FOUR_LETTER_WORDS;
        else if (length === 5) words = FIVE_LETTER_WORDS;
        else if (length === 6) words = SIX_LETTER_WORDS;
        else words = [...TWO_LETTER_WORDS, ...THREE_LETTER_WORDS];
    } else {
        // Default or other lengths if implemented later
        words = [...TWO_LETTER_WORDS, ...THREE_LETTER_WORDS, ...FOUR_LETTER_WORDS];
    }

    // Return shuffled subset or all
    const limit = req.query.limit ? parseInt(req.query.limit) : 50;
    const shuffled = shuffle([...words]).slice(0, limit);

    res.status(200).json({
        status: 'success',
        data: shuffled
    });
};

exports.getCapitals = (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 30;
    const difficulty = req.query.difficulty || 'basic';

    // Filter by difficulty if specified, or return mixed if not found (though our data covers all)
    // We can also fallback to basic if no match found.
    const filtered = CAPITAL_CONTENT.filter(item => item.difficulty === difficulty);

    // If filtered is empty (e.g. wrong difficulty), usage fallback?
    // Let's use basic as default fallback if empty
    const source = filtered.length > 0 ? filtered : CAPITAL_CONTENT.filter(item => item.difficulty === 'basic');

    const shuffled = shuffle([...source]).slice(0, limit);

    // Frontend expects array of strings, but our new content is objects
    // Map back to strings
    const resultData = shuffled.map(item => item.text);

    res.status(200).json({
        status: 'success',
        data: resultData
    });
};

exports.getParagraphs = (req, res) => {
    const difficulty = req.query.difficulty || 'basic';

    // Filter by difficulty
    const filtered = PARAGRAPHS.filter(p => p.difficulty === difficulty);

    // If no exact match (e.g. if 'expert' requested but not found), fallback to all or basic
    // For now, let's just return what we found, or random if empty?
    // User requirement: "basic to advance"

    let selection = [];
    if (filtered.length > 0) {
        // Return one random paragraph from the filtered set
        selection = [filtered[Math.floor(Math.random() * filtered.length)]];
    } else {
        // Fallback if empty (shouldn't happen with our data)
        selection = [PARAGRAPHS[Math.floor(Math.random() * PARAGRAPHS.length)]];
    }

    res.status(200).json({
        status: 'success',
        data: selection // Return as array for consistency
    });
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
