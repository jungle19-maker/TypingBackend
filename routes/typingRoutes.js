const express = require('express');
const router = express.Router();
const typingController = require('../controllers/typingController');

router.get('/words', typingController.getWords);
router.get('/capitals', typingController.getCapitals);
router.get('/paragraphs', typingController.getParagraphs);

// Hindi Routes
router.get('/hindi/words', typingController.getHindiWords);
router.get('/hindi/sentences', typingController.getHindiSentences);
router.get('/hindi/paragraphs', typingController.getHindiParagraphs);

router.post('/result', typingController.saveResult);

module.exports = router;
