const express = require('express');
const router = express.Router();
const typingController = require('../controllers/typingController');

router.get('/words', typingController.getWords);
router.get('/capitals', typingController.getCapitals);
router.get('/paragraphs', typingController.getParagraphs);
router.post('/result', typingController.saveResult);

module.exports = router;
