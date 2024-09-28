const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is not present"],
  },
  email: {
    type: String,
    required: [true, "Email is not present"],
  },
  password: {
    type: String,
    required: [true, "Password is not present"],
    select: false,
  },
  phoneNumber: {
    type: Number,
  },
  college: {
    type: String,
  },
  year: {
    type: Number,
  },
  identityNumber: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("User", userSchema);
