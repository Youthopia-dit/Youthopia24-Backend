const express = require('express');
const router = express.Router();
const PaymentController=require('../controllers/paymentController')

router.post('/order',PaymentController.RazorpayOrder)