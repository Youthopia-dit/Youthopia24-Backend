const Registration=require('../models/registrationModel')
const { v4: uuidv4 } = require("uuid");
const crypto = require('crypto')
const secret_key = '1234567890'
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
    const data = crypto.createHmac('sha256', secret_key)

   data.update(JSON.stringify(req.body))
   console.log(data)

   const digest = data.digest('hex')

if (digest === req.headers['x-razorpay-signature']) {

       console.log('request is legit')

       //We can send the response and store information in a database.

       res.json({

           status: 'ok'

       })

} else {

       res.status(400).send('Invalid signature');

   }
}