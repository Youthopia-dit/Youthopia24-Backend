const mongoose = require("mongoose");
const PaymentSchema = new mongoose.Schema({
  email: { type: String, required: true },
  registrationIds: [{ type: String, required: true }],
  paymentInfo: {
    id: {type: String,required:true},
    entity: {type: String,required:true},
    amount: {type: Number,required: true},
    currency: {type: String,required:true},
    method:{type: String,required:true},

  },
  paymentSuccess: {type: Boolean,required:true}
});

const Payment=mongoose.model('Payment','PaymentSchema');
module.exports=Payment;
