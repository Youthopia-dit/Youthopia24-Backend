const express = require('express');
const router = express.Router();
const UserMailerController = require('../controllers/userMailerController'); 

// Route for registration mail
router.post('/register', UserMailerController.sendRegistrationMail);

// Route for forgot password mail
router.post('/forgot-password', UserMailerController.sendForgotPasswordMail);

// Route to check OTP during password reset
router.post('/check-otp', UserMailerController.checkOtp);

// Route for sending event ticket and receipt
router.post('/send-ticket', UserMailerController.sendTicketReceiptMail);

// Route for generating OTP
router.post('/generate-otp', UserMailerController.generateOtp);

// Route for validating OTP
router.post('/validate-otp', UserMailerController.validateOtp);

module.exports = router;
