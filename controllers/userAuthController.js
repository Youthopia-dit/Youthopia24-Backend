const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { TOTP } = require("totp-generator");

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
      return res.send("Fill the credientials");
    }

    //   Check if user alredy exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send("email already exist");
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
        expiresIn: "10d",
      }
    );
    user.token = token;
    res.status(200).cookie(token).json({
      message: "You have signed up succesfully",
    });
  }

  async userLogin(req, res) {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.send("Enter email and password");
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.send("Incorrect email or password");
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET_KEY_AUTH,
      {
        expiresIn: "10d",
      }
    );
    user.token = token;
    res.status(200).cookie(token).json({
      message: "You have logged in succesfully",
      token,
    });
  }

  async forgotPassword(req, res) {
    // Getting the eamil from from client
    const { email } = req.body;

    if (!email) {
      return res.json({
        message: "Enter a valid email",
      });
    }

    // Checking if the user exists or not
    // const user = await User.findOne({ email });
    // if (!user) {
    //   return res.json({
    //     message: "The email does not exist in the database",
    //   });
    // }

    // Generating OTP
    const { otp, expires } = TOTP.generate(`${process.env.OTP_SECRET_KEY}`, {
      period: 60 * 30,
      algorithm: "SHA-512",
    });

    // Sending the otp to the email

    // Sending message to client
    res.json({
      message: `Otp has been sent to ${email}`,
      expires,
    });
  }

  async checkOtp(req, res) {
    const { otp, expiresTime } = req.body;

    console.log(otp);

    if (!(otp || expiresTime)) {
      return res.json({
        message: "Enter the otp",
      });
    }

    // Checking if the otp has expired or not
    const currentTime = Date.now();

    if (currentTime > expiresTime) {
      return res.json({
        message: "The otp has expired",
      });
    }

    res.json({
      message: "You can set new password",
    });
  }
}

module.exports = new UserAuthController();
