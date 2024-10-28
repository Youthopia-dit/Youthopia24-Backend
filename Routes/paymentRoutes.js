const express = require('express');
const router = express.Router();
const PaymentController=require('../controllers/paymentController')
const authMiddleware=require('../middleware/userProtectedRoutes')

router.post('/order',authMiddleware,PaymentController.RazorpayOrder)

router.post('/capturePayment',authMiddleware,PaymentController.RazorpayCapture)
router.get('/getPayments',PaymentController.getAllPayments)

module.exports=router