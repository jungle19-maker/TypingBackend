const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getMe,
    upgradeSubscription,
    getPlans
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/upgrade', protect, upgradeSubscription);
router.get('/plans', getPlans);

module.exports = router;
