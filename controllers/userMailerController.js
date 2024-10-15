// const nodemailer = require('nodemailer');
// const TOTP = require('otplib').totp; 
// const { OTP_SECRET_KEY } = process.env;

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER, 
//     pass: process.env.EMAIL_PASS   
//   },
//   pool: true,           // Use pooling to keep connection alive
//   maxConnections: 1,    // Max connections at a time
//   rateLimit: 5,         // Max emails per second
//   debug: true,
//   logger: true,
//   connectionTimeout: 60000,  // Connection timeout in ms
//   socketTimeout: 60000,      // Socket timeout in ms
// });

// class UserAuthController {
//   // User Registration Mailer
//   async sendRegistrationMail(req, res) {
//     const { email, username } = req.body;

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'Registration Successful',
//       text: `Hello ${username},\n\nThank you for registering!`,
//       html: `<p>Hello <strong>${username}</strong>,</p><p>Thank you for registering!</p>`
//     };

//     try {
//       await transporter.sendMail(mailOptions);
//       res.status(200).json({ message: 'Registration mail sent successfully' });
//     } catch (error) {
//       res.status(500).json({ message: 'Error sending registration mail', error });
//     }
//   }

//   // Forgot Password Mailer
//   async sendForgotPasswordMail(req, res) {
//     const { email } = req.body;

//     // Generate OTP for password reset
//     const { otp, expires } = TOTP.generate(`${OTP_SECRET_KEY}`, {
//       period: 60 * 30,
//       algorithm: 'SHA-512',
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'Password Reset OTP',
//       text: `Your OTP for password reset is ${otp}. It will expire in 30 minutes.`,
//       html: `<p>Your OTP for password reset is <strong>${otp}</strong>. It will expire in 30 minutes.</p>`
//     };

//     try {
//       await transporter.sendMail(mailOptions);
//       res.status(200).json({ message: `OTP sent to ${email}`, expires });
//     } catch (error) {
//       res.status(500).json({ message: 'Error sending OTP', error });
//     }
//   }

//   // Check OTP for Password Reset
//   async checkOtp(req, res) {
//     const { otp, expiresTime } = req.body;

//     if (!otp || !expiresTime) {
//       return res.status(400).json({ message: 'Enter the OTP' });
//     }

//     const currentTime = Date.now();

//     if (currentTime > expiresTime) {
//       return res.status(410).json({ message: 'The OTP has expired' });
//     }

//     res.status(200).json({ message: 'OTP verified, you can set a new password' });
//   }

//   // Ticket/Receipt Mailer
//   async sendTicketReceiptMail(req, res) {
//     const { email, eventName, ticketURL, receiptURL } = req.body;

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: `Your ticket for ${eventName}`,
//       text: `Here is your ticket and receipt for ${eventName}.`,
//       html: `
//         <p>Thank you for registering for <strong>${eventName}</strong>.</p>
//         <p>Here is your <a href="${ticketURL}">ticket</a> and <a href="${receiptURL}">receipt</a>.</p>
//       `
//     };

//     try {
//       await transporter.sendMail(mailOptions);
//       res.status(200).json({ message: 'Ticket and receipt mail sent successfully' });
//     } catch (error) {
//       res.status(500).json({ message: 'Error sending ticket and receipt mail', error });
//     }
//   }

//   // OTP Generation
//   async generateOtp(req, res) {
//     const { email } = req.body;

//     // Generating OTP
//     const { otp, expires } = TOTP.generate(`${OTP_SECRET_KEY}`, {
//       period: 60 * 30,
//       algorithm: 'SHA-512',
//     });

//     // Sending OTP via email
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'Your OTP',
//       text: `Your OTP is ${otp}. It will expire in 30 minutes.`,
//       html: `<p>Your OTP is <strong>${otp}</strong>. It will expire in 30 minutes.</p>`
//     };

//     try {
//       await transporter.sendMail(mailOptions);
//       res.status(200).json({
//         message: `OTP has been sent to ${email}`,
//         expires
//       });
//     } catch (error) {
//       res.status(500).json({ message: 'Error sending OTP', error });
//     }
//   }

//   // OTP Validation
//   async validateOtp(req, res) {
//     const { otp, expiresTime } = req.body;

//     if (!otp || !expiresTime) {
//       return res.status(400).json({
//         message: 'Enter the OTP',
//       });
//     }

//     const currentTime = Date.now();

//     if (currentTime > expiresTime) {
//       return res.status(410).json({
//         message: 'The OTP has expired',
//       });
//     }

//     res.status(200).json({
//       message: 'OTP is valid',
//     });
//   }
// }



// module.exports = new UserAuthController();
