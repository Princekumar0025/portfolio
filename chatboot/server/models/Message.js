const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        default: 'default',
        required: true,
    },
    text: {
        type: String,
        default: '',
    },
    sender: {
        type: String,
        enum: ['user', 'bot'],
        required: true,
    },
    fileUri: {
        type: String,
        default: null,
    },
    fileUrl: {
        type: String,
        default: null,
    },
    mimeType: {
        type: String,
        default: null,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Message', messageSchema);
