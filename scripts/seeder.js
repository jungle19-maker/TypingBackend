const mongoose = require('mongoose');
const dotenv = require('dotenv');
const {
    TWO_LETTER_WORDS, THREE_LETTER_WORDS, FOUR_LETTER_WORDS, FIVE_LETTER_WORDS,
    SIX_LETTER_WORDS, MIXED_DIFFICULT_WORDS, CAPITAL_CONTENT, PARAGRAPHS
} = require('../data/typingContent');
const { HINDI_WORDS, HINDI_SENTENCES, HINDI_PARAGRAPHS } = require('../data/hindiContent');

const EnglishContent = require('../src/modules/typing/EnglishContent.model');
const HindiContent = require('../src/modules/typing/HindiContent.model');
const Plan = require('../src/modules/user/plan.model');
const connectDB = require('../src/config/db');

dotenv.config({ path: './.env' }); // Adjust path if running from backend root

// Connect to DB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected for Seeding...'))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

const seedEnglish = async () => {
    try {
        await EnglishContent.deleteMany();
        console.log('English Content Cleared used deleteMany...');

        const docs = [];

        // Words
        TWO_LETTER_WORDS.forEach(w => docs.push({ type: 'word', content: w, length: 2, difficulty: 'beginner' }));
        THREE_LETTER_WORDS.forEach(w => docs.push({ type: 'word', content: w, length: 3, difficulty: 'beginner' }));
        FOUR_LETTER_WORDS.forEach(w => docs.push({ type: 'word', content: w, length: 4, difficulty: 'intermediate' }));
        FIVE_LETTER_WORDS.forEach(w => docs.push({ type: 'word', content: w, length: 5, difficulty: 'intermediate' }));
        SIX_LETTER_WORDS.forEach(w => docs.push({ type: 'word', content: w, length: 6, difficulty: 'advanced' }));
        MIXED_DIFFICULT_WORDS.forEach(w => docs.push({ type: 'word', content: w, length: w.length, difficulty: 'advanced' }));

        const normalizeDifficulty = (d) => {
            if (d === 'basic') return 'beginner';
            if (d === 'expert') return 'advanced';
            return d || 'beginner';
        };

        // Capitals
        CAPITAL_CONTENT.forEach(item => {
            docs.push({ type: 'word', content: item.text, category: 'capital', difficulty: normalizeDifficulty(item.difficulty) });
        });

        // Paragraphs
        PARAGRAPHS.forEach(p => {
            docs.push({ type: 'paragraph', content: p.text, difficulty: normalizeDifficulty(p.difficulty) });
        });

        await EnglishContent.insertMany(docs);
        console.log(`Inserted ${docs.length} English items.`);
    } catch (err) {
        console.error('Error seeding English:', err);
    }
};

const seedHindi = async () => {
    try {
        await HindiContent.deleteMany();
        console.log('Hindi Content Cleared...');

        const docs = [];

        // Words - Basic mapping since we just have a list
        HINDI_WORDS.forEach(w => docs.push({ type: 'word', content: w, difficulty: 'beginner' }));

        // Sentences
        HINDI_SENTENCES.forEach(s => docs.push({ type: 'sentence', content: s, difficulty: 'intermediate' }));

        // Paragraphs
        HINDI_PARAGRAPHS.forEach(p => docs.push({ type: 'paragraph', content: p.text, difficulty: p.difficulty }));

        await HindiContent.insertMany(docs);
        console.log(`Inserted ${docs.length} Hindi items.`);
    } catch (err) {
        console.error('Error seeding Hindi:', err);
    }
};

const seedPlans = async () => {
    try {
        await Plan.deleteMany();
        console.log('Plans Cleared...');

        const plans = [
            {
                name: 'Free',
                price: 0,
                displayFeatures: ['Unlimited English Practice (Basic)', 'Hindi Word Practice', 'Classic Game Mode'],
                features: {
                    englishPractice: true,
                    hindiWordPractice: true,
                    classicGameMode: true
                }
            },
            {
                name: 'Starter',
                price: 99,
                displayFeatures: ['All Free Features', 'Capital Letter Practice', 'Sentence Typing', 'Ad-Free'],
                features: {
                    englishPractice: true,
                    hindiWordPractice: true,
                    classicGameMode: true,
                    capitalLetterPractice: true,
                    sentenceTyping: true,
                    adFree: true
                }
            },
            {
                name: 'Pro',
                price: 199,
                displayFeatures: ['All Starter Features', 'Hindi Paragraphs', 'Survival Mode', 'Weekly Reports'],
                features: {
                    englishPractice: true,
                    hindiWordPractice: true,
                    classicGameMode: true,
                    capitalLetterPractice: true,
                    sentenceTyping: true,
                    adFree: true,
                    hindiParagraphPractice: true,
                    survivalGameMode: true,
                    weeklyReports: true
                }
            },
            {
                name: 'Premium',
                price: 299,
                displayFeatures: ['All Pro Features', 'Advanced Hindi', 'Typing Race', 'Detailed Analytics', 'Weak Key Analysis'],
                features: {
                    englishPractice: true,
                    hindiWordPractice: true,
                    classicGameMode: true,
                    capitalLetterPractice: true,
                    sentenceTyping: true,
                    adFree: true,
                    hindiParagraphPractice: true,
                    survivalGameMode: true,
                    weeklyReports: true,
                    advancedHindiPractice: true,
                    typingRaceMode: true,
                    detailedAnalytics: true,
                    weakKeyAnalysis: true
                }
            }
        ];

        await Plan.insertMany(plans);
        console.log(`Inserted ${plans.length} Plans.`);
    } catch (err) {
        console.error('Error seeding Plans:', err);
    }
};

const run = async () => {
    await seedEnglish();
    await seedHindi();
    await seedPlans();
    console.log('Seeding Complete. Exiting...');
    process.exit();
};

run();
