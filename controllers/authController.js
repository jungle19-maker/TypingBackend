const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Plan = require('../models/Plan');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Helper: Enrich user with dynamic plan features
const enrichUserResponse = async (user) => {
    let allowedFeatures = [];
    let planName = user.subscription?.planName || 'free';

    try {
        // Try to find the plan by name (case-insensitive)
        const plan = await Plan.findOne({ name: { $regex: new RegExp(`^${planName}$`, 'i') } });

        if (plan && plan.features) {
            // Convert boolean feature flags to array of strings for frontend
            allowedFeatures = Object.keys(plan.features).filter(key => plan.features[key] === true);
        } else {
            // Fallback if DB plan missing (Should not happen if seeded)
            console.warn(`Plan ${planName} not found in DB, using fallback basic features.`);
            allowedFeatures = ['englishPractice', 'hindiWordPractice', 'classicGameMode'];
        }
    } catch (err) {
        console.error('Error fetching plan features:', err);
        allowedFeatures = ['englishPractice', 'hindiWordPractice', 'classicGameMode'];
    }

    return {
        _id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        subscription: user.subscription,
        allowedFeatures, // Dynamic array from DB
        token: generateToken(user.id),
    };
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });

    if (user) {
        const response = await enrichUserResponse(user);
        res.status(201).json(response);
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        const response = await enrichUserResponse(user);
        res.json(response);
    } else {
        res.status(400).json({ message: 'Invalid credentials' });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    const response = await enrichUserResponse(req.user);
    // Remove token from getMe response if preferred, but keeping it hurts nothing
    delete response.token;
    res.status(200).json(response);
};

// @desc    Upgrade user subscription
// @route   POST /api/auth/upgrade
// @access  Private
const upgradeSubscription = async (req, res) => {
    const { plan } = req.body;

    if (!['free', 'starter', 'pro', 'premium'].includes(plan)) {
        return res.status(400).json({ message: 'Invalid plan' });
    }

    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the Plan ID to link it properly
        const planDoc = await Plan.findOne({ name: { $regex: new RegExp(`^${plan}$`, 'i') } });

        user.subscription = {
            planId: planDoc ? planDoc._id : undefined,
            planName: plan,
            status: 'active',
            startDate: new Date(),
        };

        await user.save();

        const response = await enrichUserResponse(user);

        res.status(200).json({
            status: 'success',
            data: {
                user: response
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Plan model already imported at top

// ... (existing imports)

// @desc    Get all plans (Public)
// @route   GET /api/auth/plans
// @access  Public
const getPlans = async (req, res) => {
    try {
        const plans = await Plan.find().sort({ price: 1 });
        res.status(200).json({ status: 'success', data: plans });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// ... (existing functions)

module.exports = {
    registerUser,
    loginUser,
    getMe,
    upgradeSubscription,
    getPlans
};
