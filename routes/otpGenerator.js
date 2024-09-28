const express = require('express');
const router = express.Router();
const otpGenerator = require('../controllers/otpGenerator');

router.get('/', otpGenerator.opt);

router.post('/', req.body);

module.exports = router;