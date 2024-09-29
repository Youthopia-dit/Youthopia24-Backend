const express = require('express');
const router = express.Router();
const { generateOtp, verifyOtp } = require('../controllers/otpGenerator');

router.get('/generate-otp', generateOtp);

router.post('/verify-otp', verifyOtp);

module.exports = router;