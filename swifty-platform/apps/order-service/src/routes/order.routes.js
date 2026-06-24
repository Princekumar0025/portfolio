const express = require('express');
const { createOrder } = require('../controllers/order.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const orderLimiter = rateLimit({ windowMs: 1 * 60 * 1000, max: 10 }); // 10 orders/min

router.post('/checkout', verifyToken, orderLimiter, createOrder);

module.exports = router;
