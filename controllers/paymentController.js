const Registration=require('../models/registrationModel')
const { v4: uuidv4 } = require("uuid");
require('dotenv')




// exports.setPayment=async(req,res)=>{
//     const {email,registrationIDs,paymentInfo,paymentSuccess}=req.body;
//     registrationIDs.array.forEach(element => {
//         const updateRegistration=await Registration.findOneAndUpdate({regID:element},{"payment.paid":true},{new: true});
//     });
// }

exports.RazorpayOrder=async(req,res)=>{
    const razorpay = new Razorpay({
        key_id: process.env.RazorpayKeyID,
        key_secret: process.env.RazorpayKeyID,
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
       res.status(400).send('Not able to create order. Please try again!');
    }
}
