const express = require('express');
const router = express.Router();
const { saveResult, getHistory } = require('../controllers/resultController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, saveResult);
router.get('/history', protect, getHistory);

module.exports = router;
