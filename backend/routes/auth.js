const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @route   POST api/auth/signup
// @desc    Register user
router.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password, contact } = req.body;

    try {
        let userByEmail = await User.findOne({ email });
        if (userByEmail) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        if (contact) {
            let userByPhone = await User.findOne({ contact });
            if (userByPhone) {
                return res.status(400).json({ message: 'User with this phone number already exists' });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            contact
        });

        await user.save();

        const token = generateToken(user._id);
        res.cookie('token', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
        res.status(201).json({
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST api/auth/login
// @desc    Login user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.password) {
            return res.status(400).json({ message: 'Please login using Google' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);
        res.cookie('token', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
        res.json({
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST api/auth/forgot-password
// @desc    Send OTP for password reset
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        await sendEmail({
            email: user.email,
            subject: 'Password Reset OTP',
            html: `<h3>Your OTP for password reset is: <b>${otp}</b></h3><p>It is valid for 1 hour.</p>`
        });

        res.json({ message: 'OTP sent to email' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST api/auth/reset-password
// @desc    Reset password using OTP
router.post('/reset-password', async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const user = await User.findOne({
            email,
            resetPasswordOTP: otp,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: 'Password reset successful' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST api/auth/google
// @desc    Login with Google
router.post('/google', async (req, res) => {
    const { email, firstName, lastName, googleId } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
        } else {
            user = new User({
                firstName,
                lastName,
                email,
                googleId,
                password: crypto.randomBytes(16).toString('hex') // Dummy password
            });
            await user.save();
        }

        const token = generateToken(user._id);
        res.cookie('token', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
        res.json({
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST api/auth/logout
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;
