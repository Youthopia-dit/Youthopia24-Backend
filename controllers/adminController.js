const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/adminModel");

const userSignup = async (req, res) => {
  const { name, password, email, eventCategory, event } = req.body;

  if (!(name && password && email)) {
    return res.status(400).json({ message: "Fill all credentials" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      eventCategory,
      event
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET_KEY_AUTH,
      { expiresIn: "10d" }
    );

    res.status(201).cookie('token', token, { httpOnly: true }).json({
      message: "You have signed up successfully",
      token
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    return res.status(400).json({ message: "Enter email and password" });
  }

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET_KEY_AUTH,
      { expiresIn: "10d" }
    );

    res.status(200).cookie('token', token, { httpOnly: true }).json({
      message: "You have logged in successfully",
      token
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = { userSignup, userLogin };
