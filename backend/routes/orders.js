const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');

// Get user orders
router.get('/my-orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new order
router.post('/', auth, async (req, res) => {
    const { items, totalAmount, shippingAddress, paymentId, orderId } = req.body;
    try {
        const order = new Order({
            user: req.user.id,
            items,
            totalAmount,
            shippingAddress,
            paymentId,
            orderId,
            paymentStatus: 'paid' // Assuming payment is done via Razorpay before this
        });

        await order.save();

        // Clear user cart after order
        req.user.cart = [];
        await req.user.save();

        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
