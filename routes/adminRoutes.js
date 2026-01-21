const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getDashboardStats, getContent, addContent, updateContent, deleteContent, getUsers, updateUser, getPlans, updatePlan } = require('../controllers/adminController');

// All routes are protected and require admin role
router.use(protect, admin);

router.get('/stats', getDashboardStats);

// Content
router.get('/content', getContent);
router.post('/content', addContent);
router.patch('/content', updateContent);
router.delete('/content', deleteContent);

// Users
router.get('/users', getUsers);
router.patch('/users', updateUser);

// Plans
router.get('/plans', getPlans);
router.patch('/plans', updatePlan);

module.exports = router;
