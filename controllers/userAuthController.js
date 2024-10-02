const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { TOTP } = require('totp-generator');

class UserAuthController {
  constructor() {}

  async userSignup(req, res) {
    // Get all data from body
    const {
      name,
      password,
      email,
      phoneNumber,
      college,
      year,
      identityNumber,
    } = req.body;

    // All data should exist
    if (!(name && password && email)) {
      return res.status(401).json({
        message: 'Fill the credientials',
      });
    }

    //   Check if user alredy exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: 'email already exist',
      });
    }

    // encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user in DB
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      college,
      year,
      identityNumber,
    });

    // Generate a user and send it
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET_KEY_AUTH,
      {
        expiresIn: '10d',
      }
    );
    res.status(200).cookie(token).json({
      message: 'You have signed up succesfully',
    });
  }

  async userLogin(req, res) {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(401).json({
        message: 'Enter email and password',
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: 'Incorrect email or password',
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET_KEY_AUTH,
      {
        expiresIn: '10d',
      }
    );
    user.token = token;
    res.status(200).cookie(token).json({
      message: 'You have logged in succesfully',
    });
  }

  async changePassword(req, res) {
    // Getting data from frontend
    const { email, newPassword, repeatPassword } = req.body;

    // checking if the password and repeatPassword are same
    if (!(newPassword === repeatPassword)) {
      return res.json({
        message: 'repeat password and the new password are not same',
      });
    }

    // Finding the user
    const user = await User.findOne({ email });
    const userId = user._id;

    // Checking if the user exist or not
    if (!user) {
      return res.json({
        message: 'User does not exist',
      });
    }

    // Hasing the password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Storing the new password in the database
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    res.json({
      message: 'your password has been changed',
    });
  }

  async forgotPassword(req, res) {
    // Getting the eamil from from client
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: 'Enter a valid email',
      });
    }

    // Checking if the user exists or not
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: 'The email does not exist in the database',
      });
    }

    // Generating OTP
    const { otp, expires } = TOTP.generate(`${process.env.OTP_SECRET_KEY}`, {
      period: 60 * 30,
      algorithm: 'SHA-512',
    });

    // Sending the otp to the email

    // Sending message to client
    res.status(200).json({
      message: `Otp has been sent to ${email}`,
      expires,
    });
  }

  async checkOtp(req, res) {
    const { otp, expiresTime } = req.body;

    if (!(otp || expiresTime)) {
      return res.status(400).json({
        message: 'Enter the otp',
      });
    }

    // Checking if the otp has expired or not
    const currentTime = Date.now();

    if (currentTime > expiresTime) {
      return res.status(410).json({
        message: 'The otp has expired',
      });
    }

    res.status(200).json({
      message: 'You can set new password',
    });
  }
}

module.exports = new UserAuthController();
