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
    let { email } = req.body;

    if (!email) {
        res.status(400);
        throw new Error('Please enter your email address');
    }

    email = email.trim().toLowerCase();
    const user = await User.findOne({ email });

    if (!user) {
        // Return 200 to prevent user enumeration attacks and 404 console errors
        return res.status(200).json({
            success: true,
            data: 'If an account exists, a reset link has been sent to your email.'
        });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const frontendUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    const message = `Dear ${user.name || 'User'},\n\nYou requested to reset your password. Please click the link below to proceed:\n\n${frontendUrl}\n\nIf you did not request this, please ignore this email. The link will expire in 10 minutes.\n\nThank you,\nPlacement Track Team\n\nThis is an automated message. Please do not reply to this email.`;

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
        .reset-btn:hover { background-color: #e2e8f0 !important; }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #ffffff;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#000000" style="background-color: #000000; width: 100%; padding: 40px 15px;">
        <tr>
          <td align="center" bgcolor="#000000" style="background-color: #000000;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#0a0a0a" style="max-width: 540px; background-color: #0a0a0a; border: 1px solid #1f2937; border-radius: 12px; padding: 36px 28px; text-align: left;">
              
              <!-- Title -->
              <tr>
                <td align="center" style="padding-bottom: 26px;">
                  <h1 style="color: #ffffff !important; font-size: 24px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">Reset Your Password</h1>
                </td>
              </tr>

              <!-- Greeting -->
              <tr>
                <td style="color: #f1f5f9 !important; font-size: 15px; line-height: 24px; padding-bottom: 16px;">
                  Dear ${user.name || 'User'},
                </td>
              </tr>

              <!-- Instructions -->
              <tr>
                <td style="color: #e2e8f0 !important; font-size: 15px; line-height: 24px; padding-bottom: 30px;">
                  You requested to reset your password. Please click the button below to proceed:
                </td>
              </tr>

              <!-- Action Button -->
              <tr>
                <td align="center" style="padding-bottom: 32px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td align="center" bgcolor="#ffffff" style="border-radius: 6px; background-color: #ffffff;">
                        <a href="${frontendUrl}" target="_blank" style="display: inline-block; background-color: #ffffff; color: #000000 !important; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-family: inherit;">
                          Reset Password
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Expiry Note -->
              <tr>
                <td style="color: #cbd5e1 !important; font-size: 14px; line-height: 22px; padding-bottom: 16px;">
                  If you did not request this, please ignore this email. The link will expire in 10 minutes.
                </td>
              </tr>

              <!-- Fallback Link Instruction -->
              <tr>
                <td style="color: #cbd5e1 !important; font-size: 14px; line-height: 22px; padding-bottom: 8px;">
                  If the button above doesn’t work, copy and paste the following URL into your browser:
                </td>
              </tr>

              <!-- Fallback Link -->
              <tr>
                <td style="padding-bottom: 32px; word-break: break-all;">
                  <a href="${frontendUrl}" target="_blank" style="color: #38bdf8 !important; font-size: 13px; text-decoration: underline; line-height: 20px;">
                    ${frontendUrl}
                  </a>
                </td>
              </tr>

              <!-- Divider -->
              <tr>
                <td style="border-top: 1px solid #1f2937; padding-top: 24px; text-align: center;">
                  <p style="color: #94a3b8 !important; font-size: 14px; margin: 0 0 4px 0;">Thank you,</p>
                  <p style="color: #f1f5f9 !important; font-size: 14px; font-weight: 600; margin: 0 0 16px 0;">Placement Track Team</p>
                  <p style="color: #64748b !important; font-size: 12px; margin: 0;">This is an automated message. Please do not reply to this email.</p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Reset Your Password',
            message,
            html,
        });

        res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
        console.error('Email send error:', err.message);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        console.log(`[DEV MODE] Password Reset Link for ${user.email}: ${frontendUrl}`);

        res.status(500);
        throw new Error('Email could not be sent. Please check your SMTP settings.');
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
