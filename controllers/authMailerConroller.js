const User = require('../models/user');
const sendMail = require('../utils/mailer');
const crypto = require('crypto');

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto.createHash(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 3600000;

        await user.save();

        const resetURL = ``;
        const subject = 'Password Reset Request';
        const text = `You requested a password reset. Click the link below to reset your password: ${resetURL}`;
        const html = `<p>You requested a password reset.</p><p>Click <a href="${resetURL}">here</a> to reset your password.</p>`;

        await sendMail(email, subject, text, html);

        res.json({ message: 'Password reset email sent!'});
        } catch (err) {
        res.status(500).json({ message: 'Server error'});
        }
        
};