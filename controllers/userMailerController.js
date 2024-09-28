const User = require('../models/user');
const sendMail = require('../utils/mailer');

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const newUser = new User({ name, email, password });

        await newUser.save(); 

        const subject = 'Welcome to Our Platform';
        const text = `Hi ${name}, WElcome to our platform!`;
        const html = `<p>Hi <strong>${name}</strong>,</p><p>Welcome to our platform!</p>`;

        await sendMail(email, subject, text, html);

        res.status(201).json({ message: 'User registered and email sent!'});
    } catch (err) {
        res.status(500).json({ message: 'Server error'});
    }
};
