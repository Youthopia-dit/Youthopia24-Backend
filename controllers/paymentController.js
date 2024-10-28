const Registration=require('../models/registrationModel')
const { v4: uuidv4 } = require("uuid");
const crypto = require('crypto-js')
const secret_key =process.env.RazorpayKeySecret
require('dotenv')
const Razorpay=require('razorpay')



// exports.setPayment=async(req,res)=>{
//     const {email,registrationIDs,paymentInfo,paymentSuccess}=req.body;
//     registrationIDs.array.forEach(element => {
//         const updateRegistration=await Registration.findOneAndUpdate({regID:element},{"payment.paid":true},{new: true});
//     });
// }
key_id=process.env.RazorpayKeyID
key_secret=process.env.RazorpayKeyID

exports.RazorpayOrder=async(req,res)=>{
    const razorpay = new Razorpay({
        key_id: process.env.RazorpayKeyID,
        key_secret: process.env.RazorpayKeySecret,
    });

    // setting up options for razorpay order.
    const options = {
        amount: req.body.amount,
        currency: "INR",
        receipt: uuidv4(),
        payment_capture: 1
    };
    try {
        const response = await razorpay.orders.create(options)
        res.json({
            order_id: response.id,
            currency: response.currency,
            amount: response.amount,
        })
    } catch (err) {
       res.status(400).json({message:'Not able to create order. Please try again!',err});
    }
}


exports.RazorpayCapture=async(req,res)=>{
    const { registrationIDs, orderDetails, email } = req.body;
  const { order_id, payment_id, signature } = orderDetails;

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RazorpayKeySecret)
    .update(`${order_id}|${payment_id}`)
    .digest('hex');

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
        order_id: order_id,
        payment_id: payment_id
      },
      paymentSuccess: true,
    });

    await paymentRecord.save();

    res.status(200).json({ message: 'Payment verified and registrations updated', paymentRecord });
  } catch (error) {
    res.status(500).json({ message: 'Error updating payment status', error: error.message });
  }
}