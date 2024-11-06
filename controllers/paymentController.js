const Registration = require('../models/registrationModel');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto-js');
const Payment = require('../models/PaymentModel');
const secret_key = process.env.RazorpayKeySecret;
require('dotenv');
const Razorpay = require('razorpay');
const { default: axios } = require('axios');
// const Buffer=require('buffer')

// exports.setPayment=async(req,res)=>{
//     const {email,registrationIDs,paymentInfo,paymentSuccess}=req.body;
//     registrationIDs.array.forEach(element => {
//         const updateRegistration=await Registration.findOneAndUpdate({regID:element},{"payment.paid":true},{new: true});
//     });
// }
key_id = process.env.RazorpayKeyID;
key_secret = process.env.RazorpayKeyID;

exports.RazorpayOrder = async (req, res) => {
  const razorpay = new Razorpay({
    key_id: process.env.RazorpayKeyID,
    key_secret: process.env.RazorpayKeySecret,
  });

  // setting up options for razorpay order.
  const options = {
    amount: req.body.amount,
    currency: 'INR',
    receipt: uuidv4(),
    payment_capture: 1,
  };
  try {
    const response = await razorpay.orders.create(options);
    res.json({
      order_id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Not able to create order. Please try again!', err });
  }
};

exports.RazorpayCapture = async (req, res) => {
  const { registrationIDs, orderDetails } = req.body;
  console.log(orderDetails);
  const email = req.user;
  const { orderId, paymentId, signature } = orderDetails;
  const data = `${orderId}|${paymentId?.current}`;
  const generatedSignature = crypto.HmacSHA256(data, secret_key).toString();
  console.log(generatedSignature, 'Generated Signature');

  if (generatedSignature !== signature) {
    return res.status(400).json({ message: 'Invalid signature' });
  }

  try {
    await Promise.all(registrationIDs.map(async (regID) => {
      await Registration.findOneAndUpdate({ regID }, { "payment.paid": true }, { new: true });
    }));

    const paymentRecord = new Payment({
      email: email,
      registrationIds: registrationIDs,
      paymentInfo: {
        order_id: orderId,
        payment_id: paymentId.current,
        amount: details.amount,
      },
      paymentSuccess: true,
    });

    await paymentRecord.save();

    res.status(200).json({
      message: 'Payment verified and registrations updated',
      paymentRecord,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error updating payment status', error: error.message });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const registrations = await Payment.find(); // retrieves all documents
    res.status(200).json(registrations); // sends all records in the response
  } catch (error) {
    console.error('Error retrieving records:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const getPaymentDetails = async (paymentId) => {
  // const { paymentId } = req.body;
  // const kid = Buffer.from(key_id).toString('base64');
  // const ksec = Buffer.from(key_secret).toString('base64');
  const apiKey = `Basic cnpwX2xpdmVfZWJsZlZ0SllyZk9KNzY6c1VFbTloNTM4TXd5YVNSZGpDb2lCMzhE`;

  try {
    const details = await axios({
      method: 'get',
      url: `https://api.razorpay.com/v1/payments/${paymentId}`,
      headers: {
        Authorization: apiKey,
      },
    });
    // console.log(details.data);
    // res.json(details.data);
    return details.data;
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

exports.UpdateExistingPayments = async (req, res) => {
  try {
    const payments = await Payment.find();

    for (const element of payments) {
      // Await the asynchronous call to get payment details
      const details = await getPaymentDetails(element.paymentInfo.payment_id);

      // Update the amount field if it exists in the fetched details
      if (details && details.amount) {
        element.paymentInfo.amount = details.amount / 100;
      }

      // Save each document individually
      await element.save();
    }

    res.json({ message: 'OK' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
