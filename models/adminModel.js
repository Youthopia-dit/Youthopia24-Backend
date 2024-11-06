const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is not present'],
      select: false,
    },
    
    
  },
  { timestamps: true }
);

const User = mongoose.model('admin', userSchema);

module.exports = User;
