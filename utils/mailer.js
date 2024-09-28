const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

const sendMail = (to, subject, text, html) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        html,
        attachments: [
            {
              filename: 'ticket.pdf',
              path: './path-to-ticket.pdf', 
            },
        ],
    };

    return transporter.sendMail(mailOptions);
};

module.exports = sendMail;