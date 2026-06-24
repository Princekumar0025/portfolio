const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const path = require('path');
const multer = require('multer');
const { Server } = require('socket.io');
const chatRoutes = require('./routes/chatRoutes');
const Message = require('./models/Message');
const { generateChatStream, generateChatResponseWithFile } = require('./services/gemini');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const fs = require('fs');

// Set up Multer for disk storage to statically serve pictures in chat logs
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname.replace(/\\s+/g, '-'))
    }
});
const upload = multer({ storage: storage });

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/chat', chatRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/api/upload', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');

    try {
        // Upload the file to Gemini Server and get its URI reference
        const geminiFileUri = await generateChatResponseWithFile(req.file);
        const fileUrl = `/uploads/${req.file.filename}`;

        res.json({ fileUri: geminiFileUri, fileUrl: fileUrl, mimeType: req.file.mimetype });
    } catch (err) {
        console.error('File upload error:', err);
        res.status(500).send('Failed to upload file to Gemini');
    }
});

// Serve static assets if in production
if (process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'production') {
    // Set static folder
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('API is running...');
    });
}

// Socket.io Implementation
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('sendMessage', async (payload) => {
        try {
            const sessionId = payload.sessionId || 'default';
            const textContent = payload.text || (typeof payload === 'string' ? payload : '');
            const fileUri = payload.fileUri || null;
            const fileUrl = payload.fileUrl || null;
            const mimeType = payload.mimeType || null;

            // Save user message
            const userMessage = new Message({
                sessionId,
                text: textContent,
                sender: 'user',
                fileUri,
                fileUrl,
                mimeType
            });
            await userMessage.save();

            // Emit user message to all connected clients
            io.emit('receiveMessage', userMessage);

            // Fetch a few recent messages for context
            const history = await Message.find({ sessionId }).sort({ timestamp: -1 }).limit(6).lean();
            history.reverse();

            // Generate bot response stream using Gemini
            const stream = await generateChatStream(payload, history.slice(0, -1));

            // Save empty placeholder for the bot response
            const botMessage = new Message({
                sessionId,
                text: '',
                sender: 'bot'
            });
            await botMessage.save();

            // Emit the placeholder instantly
            io.emit('receiveMessage', botMessage);

            let streamedText = "";
            if (typeof stream === 'string') {
                // Handle API error fallbacks
                streamedText = stream;
                io.emit('streamChunk', { messageId: botMessage._id, sessionId: sessionId, text: stream });
            } else {
                for await (const chunk of stream) {
                    if (chunk.text) {
                        streamedText += chunk.text;
                        io.emit('streamChunk', { messageId: botMessage._id, sessionId: sessionId, text: chunk.text });
                    }
                }
            }

            // Save final aggregated text
            botMessage.text = streamedText;
            await botMessage.save();

            // Notify completion
            io.emit('streamEnd', { messageId: botMessage._id, sessionId: sessionId });

        } catch (err) {
            console.error('Socket message error:', err);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start Server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
