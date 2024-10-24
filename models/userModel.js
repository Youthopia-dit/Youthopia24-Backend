const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is not present'],
  },
  email: {
    type: String,
    required: [true, 'Email is not present'],
  },
  password: {
    type: String,
    required: [true, 'Password is not present'],
    select: false,
  },
  phone: {
    type: String,
    default: null,
  },
  college: {
    type: String,
    default: null,
  },
  branch: {
    type: String,
    default: null,
  },
  year: {
    type: String,
    default: null,
  },
  identityNumber: {
    type: String,
    default: "",
  },
  profilePictureUrl: {
    type: String,
    default: null,
  },
  collegeId: {
    type: String,
    default: null,
  },
  registeredEvent: {
    type: Array,
    default: [],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('User', userSchema);
