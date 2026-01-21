const EnglishContent = require('../models/EnglishContent');
const HindiContent = require('../models/HindiContent');
const Plan = require('../models/Plan');
const User = require('../models/User');

// --- DASHBOARD ---
exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeSubs = await User.countDocuments({ 'subscription.status': 'active' });
        const totalEnglish = await EnglishContent.countDocuments();
        const totalHindi = await HindiContent.countDocuments();

        res.status(200).json({
            status: 'success',
            data: { totalUsers, activeSubs, totalEnglish, totalHindi }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- CONTENT MANAGEMENT ---

// Get All Content (Paginated)
exports.getContent = async (req, res) => {
    try {
        const { language, type, page = 1, limit = 20 } = req.query;
        const Model = language === 'hindi' ? HindiContent : EnglishContent;
        const query = type ? { type } : {};

        const content = await Model.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ _id: -1 });

        const total = await Model.countDocuments(query);

        res.status(200).json({
            status: 'success',
            data: content,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Add Content
exports.addContent = async (req, res) => {
    try {
        const { language, type, content, difficulty, category, planAccess, status } = req.body;
        const Model = language === 'hindi' ? HindiContent : EnglishContent;

        const newItem = new Model({
            type,
            content,
            difficulty,
            category,
            length: type === 'word' ? content.length : undefined,
            planAccess: planAccess || 'free',
            status: status || 'active'
        });

        await newItem.save();
        res.status(201).json({ status: 'success', data: newItem });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update Content
exports.updateContent = async (req, res) => {
    try {
        const { language, id, content, difficulty, type, planAccess, status } = req.body;
        const Model = language === 'hindi' ? HindiContent : EnglishContent;

        await Model.findByIdAndUpdate(id, {
            content,
            difficulty,
            type,
            length: type === 'word' ? content.length : undefined,
            planAccess,
            status
        });

        res.status(200).json({ status: 'success', message: 'Content updated' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete Content
exports.deleteContent = async (req, res) => {
    try {
        const { language, id } = req.query; // pass lang as query param
        const Model = language === 'hindi' ? HindiContent : EnglishContent;

        await Model.findByIdAndDelete(id);
        res.status(200).json({ status: 'success', message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- USER MANAGEMENT ---
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').limit(50);
        res.status(200).json({ status: 'success', data: users });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id, action, value } = req.body; // action: 'role', 'plan', 'status'
        const user = await User.findById(id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        // Ensure subscription object exists
        if (!user.subscription) {
            user.subscription = { planName: 'free', status: 'active' };
        }

        if (action === 'role') {
            user.role = value; // 'user' or 'admin'
        } else if (action === 'status') {
            user.subscription.status = value; // 'active', 'banned', etc.
        } else if (action === 'plan') {
            user.subscription.planName = value;
            user.subscription.status = 'active';
            // Also update planId if we had it, but for now planName is key
        }

        await user.save();
        res.status(200).json({ status: 'success', data: user });
    } catch (error) {
        console.error('Update User Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// --- PLAN MANAGEMENT ---
exports.getPlans = async (req, res) => {
    try {
        const plans = await Plan.find();
        res.status(200).json({ status: 'success', data: plans });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updatePlan = async (req, res) => {
    try {
        const { id, price, features, displayFeatures } = req.body;
        // Construct update object dynamically to allow partial updates
        const updateData = { price };
        if (features) updateData.features = features;
        if (displayFeatures) updateData.displayFeatures = displayFeatures;

        await Plan.findByIdAndUpdate(id, updateData);
        res.status(200).json({ status: 'success', message: 'Plan updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
