const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
    createExam,
    getExams,
    getExamById,
    submitExamResult,
    getExamHistory,
    getExamBySlug
} = require('../controllers/examController');

router.route('/')
    .get(getExams)
    .post(protect, admin, createExam);

router.route('/slug/:slug')
    .get(getExamBySlug);

router.route('/history')
    .get(protect, getExamHistory);

router.route('/:id')
    .get(protect, getExamById);

router.route('/:id/submit')
    .post(protect, submitExamResult);

module.exports = router;
