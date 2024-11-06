const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/userProtectedRoutes');
const Payment = require('../models/PaymentModel');

router.post(
  '/order',
  // authMiddleware,
  PaymentController.RazorpayOrder
);

router.post(
  '/capturePayment',
  //   authMiddleware,
  PaymentController.RazorpayCapture
);
router.get('/getPayments', PaymentController.getAllPayments);

router.get('/paymentDetails', PaymentController.UpdateExistingPayments);
//   const payments = await Payment.find();

module.exports = router;
