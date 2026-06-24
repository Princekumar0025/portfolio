const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Get distinct session IDs with their latest message
router.get('/sessions', async (req, res) => {
    try {
        const sessions = await Message.aggregate([
            { $sort: { timestamp: -1 } },
            { $group: { _id: "$sessionId", latestMessage: { $first: "$$ROOT" } } },
            { $sort: { "latestMessage.timestamp": -1 } }
        ]);
        res.json(sessions.map(s => s.latestMessage));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get messages for a specific session
router.get('/:sessionId', async (req, res) => {
    try {
        const messages = await Message.find({ sessionId: req.params.sessionId }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Send a message
router.post('/', async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ message: 'Message text is required' });
    }

    try {
        // Save user message
        const userMessage = new Message({ text, sender: 'user' });
        await userMessage.save();

        // Generate bot response (Simple rule-based logic for now)
        let botResponseText = "I'm a simple bot. I received your message.";
        if (text.toLowerCase().includes('hello')) {
            botResponseText = "Hello there! How can I help you today?";
        } else if (text.toLowerCase().includes('help')) {
            botResponseText = "I can help you with basic queries. Just ask!";
        } else if (text.toLowerCase().includes('bye')) {
            botResponseText = "Goodbye! Have a great day!";
        }

        // Save bot message
        const botMessage = new Message({ text: botResponseText, sender: 'bot' });
        await botMessage.save();

        res.status(201).json({ userMessage, botMessage });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
