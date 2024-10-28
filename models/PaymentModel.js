const mongoose = require("mongoose");
const PaymentSchema = new mongoose.Schema({
  email: { type: String, required: true },
  registrationIds: [{ type: String, required: true }],
  paymentInfo: {
    order_id: {type: String,required: true},
    payment_id:{type: String,required:true}
},
  paymentSuccess: {type: Boolean,required:true}
});

const Payment=mongoose.model('Payment','PaymentSchema');
module.exports=Payment;
