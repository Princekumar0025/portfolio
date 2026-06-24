const AIService = require('../services/ai.service');

exports.getRecommendations = async (req, res) => {
    try {
        const userId = req.query.userId || 'anonymous';
        const currentHour = new Date().getHours();
        
        const feed = await AIService.getPersonalizedFeed(userId, currentHour);
        res.status(200).json({ success: true, feed });
    } catch (error) {
        console.error("AI Recommendation Error:", error);
        res.status(500).json({ error: "Failed to generate AI feed" });
    }
};

exports.processVoiceOrder = async (req, res) => {
    try {
        const { query, lat, lng } = req.body;
        if (!query) return res.status(400).json({ error: "Missing text query" });

        const results = await AIService.parseOrderIntent(query, lat, lng);
        res.status(200).json({ success: true, results });
    } catch (error) {
        console.error("NLP Error:", error);
        res.status(500).json({ error: "Failed to process natural language request" });
    }
};
