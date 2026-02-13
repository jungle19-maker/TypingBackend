const User = require('./user.model');
const Plan = require('./plan.model');

/**
 * Get all users
 * @returns {Promise<Array>} List of users
 */
const getAllUsers = async () => {
    return await User.find().select('-password').limit(50);
};

/**
 * Update user details
 * @param {string} id - User ID
 * @param {string} action - Update action (role, status, plan)
 * @param {string} value - New value
 * @returns {Promise<Object>} Updated user
 */
const updateUser = async (id, action, value) => {
    const user = await User.findById(id);
    if (!user) throw new Error('User not found');

    if (!user.subscription) {
        user.subscription = { planName: 'free', status: 'active' };
    }

    if (action === 'role') {
        user.role = value;
    } else if (action === 'status') {
        user.subscription.status = value;
    } else if (action === 'plan') {
        user.subscription.planName = value;
        user.subscription.status = 'active';
    }

    return await user.save();
};

/**
 * Get all plans
 * @returns {Promise<Array>} List of plans
 */
const getAllPlans = async () => {
    return await Plan.find();
};

/**
 * Update plan details
 * @param {string} id - Plan ID
 * @param {Object} data - Data to update
 * @returns {Promise<Object>} Updated plan
 */
const updatePlan = async (id, data) => {
    return await Plan.findByIdAndUpdate(id, data, { new: true });
};

module.exports = {
    getAllUsers,
    updateUser,
    getAllPlans,
    updatePlan
};
