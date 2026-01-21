const Exam = require('../models/Exam');
const ExamResult = require('../models/ExamResult');
const User = require('../models/User');

// @desc    Create a new exam (Admin)
// @route   POST /api/exams
// @access  Private/Admin
const createExam = async (req, res) => {
    try {
        const { title, language, difficulty, duration, totalWords, content, accessLevel, descriptionEnglish, descriptionHindi, metaTitle, metaDescription, examCategory } = req.body;

        // Auto-generate slug from title if not provided/handled
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        const exam = await Exam.create({
            title,
            slug,
            language,
            difficulty,
            duration,
            totalWords,
            content,
            accessLevel,
            descriptionEnglish,
            descriptionHindi,
            metaTitle,
            metaDescription,
            examCategory
        });

        res.status(201).json(exam);
    } catch (error) {
        // Handle duplicate key error for slug
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Exam title/slug already exists' });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all active exams
// @route   GET /api/exams
// @access  Public (some data hidden)
const getExams = async (req, res) => {
    try {
        const exams = await Exam.find({ isActive: true }).select('-content'); // Hide content in list
        res.json(exams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get exam by Slug (Public for SEO Landing)
// @route   GET /api/exams/slug/:slug
// @access  Public
const getExamBySlug = async (req, res) => {
    try {
        let exam = await Exam.findOne({ slug: req.params.slug });

        // Fallback for legacy exams using ID
        if (!exam && req.params.slug.match(/^[0-9a-fA-F]{24}$/)) {
            exam = await Exam.findById(req.params.slug);
        }

        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        // Return SEO fields and Basic Details for Landing Page
        // Content might be hidden if it's premium, but for now allow public to see details
        // The actual practice page (getExamById) will enforce access control
        res.json(exam);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get exam by ID (Check access)
// @route   GET /api/exams/:id
// @access  Private
const getExamById = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);
        const user = await User.findById(req.user._id);

        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        // Check Access Level
        if (exam.accessLevel !== 'free') {
            const isPro = user.subscription && ['starter', 'pro', 'premium', 'booster', 'monthly_pro', 'yearly_pro'].includes(user.subscription.planName || user.subscription.plan);
            if (!isPro) {
                return res.status(403).json({ message: 'Upgrade required to access this exam' });
            }
        }

        // Check Daily Limit for Free Users
        // Reset count if new day
        const today = new Date().setHours(0, 0, 0, 0);
        const lastDate = new Date(user.lastExamDate).setHours(0, 0, 0, 0);

        if (today > lastDate) {
            user.dailyExamCount = 0;
            user.lastExamDate = Date.now();
        }

        const isPaidUser = user.subscription && ['starter', 'pro', 'premium', 'booster', 'monthly_pro', 'yearly_pro'].includes(user.subscription.planName || user.subscription.plan);

        if (!isPaidUser) {
            if (user.dailyExamCount >= 3) { // Limit: 3 exams per day for free users
                return res.status(403).json({ message: 'Daily exam limit reached (3/3). Upgrade for unlimited access.' });
            }
        }

        res.json(exam);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit exam result
// @route   POST /api/exams/:id/submit
// @access  Private
const submitExamResult = async (req, res) => {
    try {
        const { wpm, accuracy, errorCount, backspaceCount, keyStrokes } = req.body;

        const exam = await Exam.findById(req.params.id);
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        const user = await User.findById(req.user._id);

        // Increment daily count for free users
        const isPaidUser = user.subscription && ['starter', 'pro', 'premium', 'booster', 'monthly_pro', 'yearly_pro'].includes(user.subscription.planName || user.subscription.plan);
        if (!isPaidUser) {
            user.dailyExamCount += 1;
            user.lastExamDate = Date.now();
            await user.save();
        }

        const result = await ExamResult.create({
            user: req.user._id,
            exam: req.params.id,
            wpm,
            accuracy,
            errorCount,
            backspaceCount,
            keyStrokes
        });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user exam history
// @route   GET /api/exams/history
// @access  Private
const getExamHistory = async (req, res) => {
    try {
        const results = await ExamResult.find({ user: req.user._id })
            .populate('exam', 'title language')
            .sort({ completedAt: -1 });
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createExam,
    getExams,
    getExamById,
    submitExamResult,
    getExamHistory,
    getExamBySlug
};
