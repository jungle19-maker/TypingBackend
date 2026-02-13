const express = require('express');
const router = express.Router();
const typingController = require('./typing.controller');
const { protect, admin } = require('../../middlewares/auth.middleware');

// Public Typing Routes
router.get('/words', typingController.getWords);
router.get('/capitals', typingController.getCapitals);
router.get('/paragraphs', typingController.getParagraphs);

// Hindi Routes
router.get('/hindi/words', typingController.getHindiWords);
router.get('/hindi/sentences', typingController.getHindiSentences);
router.get('/hindi/paragraphs', typingController.getHindiParagraphs);

// Result Routes (Private)
router.post('/result', protect, typingController.saveResult);
router.get('/history', protect, typingController.getHistory);

// Admin Content Routes (Private & Admin)
router.get('/content', protect, admin, typingController.getContent);
router.post('/content', protect, admin, typingController.addContent);
router.patch('/content', protect, admin, typingController.updateContent);
router.delete('/content', protect, admin, typingController.deleteContent);

module.exports = router;
