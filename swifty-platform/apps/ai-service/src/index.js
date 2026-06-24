const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const aiRoutes = require('./routes/ai.routes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/v1/ai', aiRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', service: 'ai-service' });
});

app.listen(PORT, () => {
    console.log(`🧠 AI Service running on port ${PORT}`);
});
