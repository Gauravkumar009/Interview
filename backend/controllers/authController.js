const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');




const registerUser = asyncHandler(async (req, res) => {
    let { name, email, password } = req.body;

    
    if (email) email = email.toLowerCase();

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    
    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});




const loginUser = asyncHandler(async (req, res) => {
    let { email, password } = req.body;
    if (email) email = email.toLowerCase();

    
    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid credentials');
    }
});




const getMe = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};







const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    
    const resetUrl = `${req.protocol}://${req.get(
        'host'
    )}/reset-password/${resetToken}`;
    

    
    const frontendUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${frontendUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Token',
            message,
        });

        res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
        console.error(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        res.status(500);
        throw new Error('Email could not be sent');
    }
});




const resetPassword = asyncHandler(async (req, res) => {
    
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        res.status(400);
        throw new Error('Invalid token');
    }

    
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(201).json({
        success: true,
        token: generateToken(user._id),
    });
});

module.exports = {
    registerUser,
    loginUser,
    getMe,
    forgotPassword,
    resetPassword,
};
