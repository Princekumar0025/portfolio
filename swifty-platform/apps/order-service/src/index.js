const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const orderRoutes = require('./routes/order.routes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Main Routes
app.use('/api/v1/orders', orderRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', service: 'order-service' });
});

app.listen(PORT, () => {
    console.log(`🚀 Order Service running on port ${PORT}`);
});
