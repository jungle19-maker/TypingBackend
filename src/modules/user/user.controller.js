const userService = require('./user.service');

const getUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({ status: 'success', data: users });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id, action, value } = req.body;
        const user = await userService.updateUser(id, action, value);
        res.status(200).json({ status: 'success', data: user });
    } catch (error) {
        console.error('Update User Error:', error);
        if (error.message === 'User not found') {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getPlans = async (req, res) => {
    try {
        const plans = await userService.getAllPlans();
        res.status(200).json({ status: 'success', data: plans });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const updatePlan = async (req, res) => {
    try {
        const { id, price, features, displayFeatures } = req.body;
        const updateData = { price };
        if (features) updateData.features = features;
        if (displayFeatures) updateData.displayFeatures = displayFeatures;

        await userService.updatePlan(id, updateData);
        res.status(200).json({ status: 'success', message: 'Plan updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getUsers,
    updateUser,
    getPlans,
    updatePlan
};
