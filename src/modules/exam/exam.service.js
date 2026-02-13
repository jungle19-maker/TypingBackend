const Exam = require('./exam.model');
const ExamResult = require('./examResult.model');
const User = require('../user/user.model'); // Need User model to check subscription

const createExam = async (data) => {
    // Auto-generate slug from title if not provided/handled
    if (data.title && !data.slug) {
        data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    return await Exam.create(data);
};

const getExams = async () => {
    return await Exam.find({ isActive: true }).select('-content');
};

const getExamBySlug = async (slug) => {
    let exam = await Exam.findOne({ slug });

    // Fallback for legacy exams using ID
    if (!exam && slug.match(/^[0-9a-fA-F]{24}$/)) {
        exam = await Exam.findById(slug);
    }
    return exam;
};

const getExamById = async (id, userId) => {
    const exam = await Exam.findById(id);
    if (!exam) throw new Error('Exam not found');

    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    // Check Access Level
    if (exam.accessLevel !== 'free') {
        const isPro = user.subscription && ['starter', 'pro', 'premium', 'booster', 'monthly_pro', 'yearly_pro'].includes(user.subscription.planName || user.subscription.plan);
        if (!isPro) {
            throw new Error('Upgrade required to access this exam');
        }
    }

    // Check Daily Limit for Free Users
    const today = new Date().setHours(0, 0, 0, 0);
    const lastDate = new Date(user.lastExamDate).setHours(0, 0, 0, 0);

    if (today > lastDate) {
        user.dailyExamCount = 0;
        user.lastExamDate = Date.now();
        // We will save user state here or in controller? 
        // Better to save here if we modified it.
        await user.save();
    }

    const isPaidUser = user.subscription && ['starter', 'pro', 'premium', 'booster', 'monthly_pro', 'yearly_pro'].includes(user.subscription.planName || user.subscription.plan);

    if (!isPaidUser) {
        // Refetch user to get updated count if we saved it above? 
        // user object is already updated in memory if we just modified it.
        // Wait, user.save() is async.

        if (user.dailyExamCount >= 3) {
            throw new Error('Daily exam limit reached (3/3). Upgrade for unlimited access.');
        }
    }

    return exam;
};

const submitExamResult = async (userId, examId, resultData) => {
    const exam = await Exam.findById(examId);
    if (!exam) throw new Error('Exam not found');

    const user = await User.findById(userId);

    // Increment daily count for free users
    const isPaidUser = user.subscription && ['starter', 'pro', 'premium', 'booster', 'monthly_pro', 'yearly_pro'].includes(user.subscription.planName || user.subscription.plan);
    if (!isPaidUser) {
        user.dailyExamCount += 1;
        user.lastExamDate = Date.now();
        await user.save();
    }

    return await ExamResult.create({
        user: userId,
        exam: examId,
        ...resultData
    });
};

const getExamHistory = async (userId) => {
    return await ExamResult.find({ user: userId })
        .populate('exam', 'title language')
        .sort({ completedAt: -1 });
};

module.exports = {
    createExam,
    getExams,
    getExamBySlug,
    getExamById,
    submitExamResult,
    getExamHistory
};
