const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get current user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
    const { firstName, lastName, contact } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (contact) user.contact = contact;
        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user addresses
router.get('/addresses', auth, async (req, res) => {
    res.json(req.user.addresses);
});

// Add address
router.post('/addresses', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.addresses.push(req.body);
        await user.save();
        res.json(user.addresses);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete address
router.delete('/addresses/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.id);
        await user.save();
        res.json(user.addresses);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Cart operations
router.get('/cart', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        // Clean up invalid product IDs that might have slipped in
        user.cart = user.cart.filter(item => mongoose.Types.ObjectId.isValid(item.productId));
        await user.save();

        const populatedUser = await User.findById(req.user.id).populate('cart.productId');
        res.json(populatedUser.cart);
    } catch (err) {
        console.error('Error fetching cart:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.post('/cart', auth, async (req, res) => {
    const { productId, quantity, size, price } = req.body;
    try {
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }
        const user = await User.findById(req.user.id);
        const cartItem = user.cart.find(item => item.productId && item.productId.toString() === productId);

        if (cartItem) {
            cartItem.quantity += quantity;
        } else {
            user.cart.push({ productId, quantity, size, price });
        }

        await user.save();
        res.json(user.cart);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/cart/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.cart = user.cart.filter(item => item._id.toString() !== req.params.id);
        await user.save();
        res.json(user.cart);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
