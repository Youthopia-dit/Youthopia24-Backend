const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { totp } = require("otplib");
const {SendEmail}=require("../utils/mailer")

const sendEmail = (email_id, subject, content) => {
  console.log(content);
};

totp.options = {
  step: 300, // Time step in seconds
  window: 1, // Flexibility in terms of time steps (1 time step before or after)
};

exports.initialSignup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      college,
      branch,
      year,
      collegeId,
      phone,
      governmentId,
    } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: 'Please provide all the details' });
    }

    console.log(req.body);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      college,
      branch,
      year,
      collegeId,
      phone,
      identityNumber: governmentId,
      isVerified: true,
    });
    console.log('user created');
    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
      },
      process.env.JWT_SECRET_KEY_AUTH,
      {
        expiresIn: '10d',
      }
    );
    res.status(201).json({ message: 'Signup successful', token});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({email});
    if (user) {
      return res.status(409).json({ message: 'User already Exists' });
    }
    const otp = totp.generate(email);
    console.log(otp);
    await SendEmail(email, 'Verify Your Email', `Your verification code is: ${otp}`);
    res.status(200).json({ message: 'OTP sent successfully', expiresIn: '5 minutes' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.verifyOtp = async (req, res) => {
  const { email, userOtp } = req.body;

  console.log(email, userOtp);
  try {
    const verification = totp.check(userOtp, email);
    console.log(email);
    if (!verification) {
      return res
        .status(400)
        .json({ message: 'Invalid OTP. Please try again.' });
    } else {
      res.status(200).json({ message: 'OTP verified successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//USER LOGIN CONTROLLERS------>TO BE FIXED

exports.userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'Please enter both email and password.',
    });
  }

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        message: 'Incorrect email or password.',
      });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({
        message: 'Incorrect email or password.',
      });
    }

    const token = jwt.sign({ id: user._id, email: user.email}, process.env.JWT_SECRET_KEY_AUTH, {
      expiresIn: '10d',
    });
    console.log(token);

    // Set the token in an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set secure to true if in production (HTTPS)
      maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days in milliseconds
    });

    res.status(200).json({
      message: 'You have logged in successfully.',
      token,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Enter a valid email' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: 'The email does not exist in the database' });
    }

    const secret = user._id.toString(); // Use user's ID as the secret for TOTP
    const otp = totp.generate(secret);

    await sendEmail(
      email,
      'Verify Your Email',
      `Your verification code is: ${otp}`
    );

    res.status(200).json({
      message:
        'OTP has been sent to your email. Please use it to reset your password.',
      expiresIn: '5 minutes',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.checkOtp = async (req, res) => {
  const { email, userOtp } = req.body;

  if (!userOtp || !email) {
    return res.status(400).json({ message: 'Enter both OTP and email' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const secret = user._id.toString(); // Use the same method to generate the secret as in forgotPassword
    const isValid = totp.check(userOtp, secret);

    if (!isValid) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    const token = jwt.sign(
      { userId: user._id , email: user.email},
      process.env.JWT_SECRET_KEY_AUTH,
      { expiresIn: '15m' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set secure to true if in production (HTTPS)
      maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days in milliseconds
    });

    res.status(200).json({
      message: 'OTP verified. You can now set a new password.',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.resetPasswordController = async (req, res) => {
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ message: 'Please provide a new password.' });
  }

  try {
    const user = await User.findById(req.user.id); // Get user from decoded token
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Re-issue a new token after password reset for security reasons
    const newToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET_KEY_AUTH,
      {
        expiresIn: '10d',
      }
    );

    // Update the token in an HTTP-only cookie
    res.cookie('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Ensure cookies are sent over HTTPS
      maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days in milliseconds
    });

    res.status(200).json({ message: 'Password reset successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const id = req.user._id;
    const userProfile = await User.findOne({ id });
    if (!userProfile) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ profile: userProfile });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: 'Server error.' });
  }
};
