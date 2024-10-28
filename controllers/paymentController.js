const Registration = require("../models/registrationModel");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RazorpayKeyID,
  key_secret: process.env.RazorpayKeySecret,
});

exports.RazorpayOrder = async (req, res) => {
  const options = {
    amount: req.body.amount,
    currency: "INR",
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
      .json({
        message: "Failed to create order. Please try again!",
        error: err.message,
      });
  }
};

exports.RazorpayCapture = async (req, res) => {
  const { registrationIDs, orderDetails } = req.body;
  const { email } = req.user;
  const { orderId, paymentId, signature } = orderDetails;
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RazorpayKeySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  if (generatedSignature !== signature) {
    return res.status(400).json({ message: "Invalid signature" });
  }

  try {
    await Promise.all(
      registrationIDs.map(async (regID) => {
        await Registration.findOneAndUpdate(
          { regID },
          { "payment.paid": true },
          { new: true }
        );
      })
    );
    const paymentRecord = new Payment({
      email: email,
      registrationIds: registrationIDs,
      paymentInfo: {
        order_id: order_id,
        payment_id: payment_id,
      },
      paymentSuccess: true,
    });
    await paymentRecord.save();
    res
      .status(200)
      .json({ status: "Payment verified and registrations updated" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error updating registration payment status",
        error: error.message,
      });
  }
};
