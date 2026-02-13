const express = require('express');
const router = express.Router();
const { getUsers, updateUser, getPlans, updatePlan } = require('./user.controller');
const { protect, admin } = require('../../middlewares/auth.middleware');

// All routes are protected and require admin role
router.use(protect, admin);

// User Management
router.get('/users', getUsers);
router.patch('/users', updateUser);

// Plan Management
router.get('/plans', getPlans);
router.patch('/plans', updatePlan);

module.exports = router;
