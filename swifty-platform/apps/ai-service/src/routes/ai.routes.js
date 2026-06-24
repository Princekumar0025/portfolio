const express = require('express');
const { getRecommendations, processVoiceOrder } = require('../controllers/ai.controller');

const router = express.Router();

router.get('/recommendations', getRecommendations);
router.post('/chatbot', processVoiceOrder);

module.exports = router;
