// const express = require('express');
// const router = express.Router();
// const sendMail = require('../utils/mailer'); // Import the mailer utility

// router.post('/send-test-email', async (req, res) => {
//   try {
//     const { email } = req.body;

//     // Subject and content of the test email
//     const subject = 'Test Email from Node.js';
//     const text = 'This is a test email sent from the Node.js backend using Nodemailer!';
//     const html = '<p>This is a <strong>test email</strong> sent from the Node.js backend using <strong>Nodemailer</strong>!</p>';

//     // Send the email
//     await sendMail(email, subject, text, html);

//     res.status(200).json({ message: 'Test email sent successfully!' });
//   } catch (err) {
//     console.error('Error sending email:', err);
//     res.status(500).json({ message: 'Error sending email', error: err });
//   }
// });

// module.exports = router;
