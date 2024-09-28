const express = require('express');
const router = express.Router();
const otpGenerator = require('../controllers/otpGenerator');

router.get('/', otpGenerator.generateOtp);

router.post('/', otpGenerator.verifyOtp);

module.exports = router;