const express = require('express');
const {
  userSignup,
  userLogin,
  forgotPassword,
  checkOtp,
} = require('../controllers/userAuthController');

const router = express.Router();

router.post('/api/v1/signup', userSignup);

router.post('/api/v1/login', userLogin);

router.post('/api/v1/forgotpassword', forgotPassword);

router.post('/api/v1/checkotp', checkOtp);

module.exports = router;
