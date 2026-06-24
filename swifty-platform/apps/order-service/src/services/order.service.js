const prisma = require('../config/prisma');
const kafka = require('../config/kafka');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_demo');

class OrderService {
    static async processCheckoutState(userId, restaurantId, items, deliveryAddressId) {
        // Calculate Total
        const totalAmount = items.reduce((acc, item) => acc + (parseFloat(item.price) * parseInt(item.quantity)), 0);
        
        // Add dynamic delivery fee and taxes
        const deliveryFee = 40.00; // Mocked - actual is calculated via Google Distance Matrix
        const tax = totalAmount * 0.05;
        const finalAmount = totalAmount + deliveryFee + tax;

        // Create Stripe Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(finalAmount * 100), // Stripe expects cents/paise
            currency: 'inr',
            metadata: { userId, restaurantId }
        });

        // Create Order in PostgreSQL
        const order = await prisma.order.create({
            data: {
                userId,
                restaurantId,
                totalAmount: finalAmount,
                status: 'PENDING_PAYMENT',
                deliveryId: deliveryAddressId,
                items: {
                    create: items.map(i => ({ foodId: i.id, quantity: i.quantity, price: parseFloat(i.price) }))
                }
            }
        });

        // Fire Kafka Event (Asynchronous Microservice Communication)
        await kafka.publish('ORDER_TOPIC', 'ORDER_INITIATED', {
            orderId: order.id,
            userId,
            amount: finalAmount,
            timestamp: new Date()
        });

        return { order, stripeClientSecret: paymentIntent.client_secret };
    }
}

module.exports = OrderService;
