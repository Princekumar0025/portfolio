const OrderService = require('../services/order.service');

exports.createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { restaurantId, items, deliveryAddressId } = req.body;

        if (!restaurantId || !items || items.length === 0) {
            return res.status(400).json({ error: "Invalid cart payload." });
        }

        const checkoutPayload = await OrderService.processCheckoutState(userId, restaurantId, items, deliveryAddressId);
        
        res.status(201).json({
            success: true,
            orderId: checkoutPayload.order.id,
            clientSecret: checkoutPayload.stripeClientSecret // Sent to frontend to complete 3D Secure Verification
        });

    } catch (error) {
        console.error("Order Creation Error:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
};
