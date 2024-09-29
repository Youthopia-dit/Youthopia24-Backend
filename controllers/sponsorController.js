//const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Sponsor = require("../models/sponsorModel");


class sponsorController {
  constructor() {}

  async sponsorSignup(req, res) {
    // Get all data from body
    const {
      name,
      company,
      email,
      phoneNumber,
    } = req.body;

    // All data should exist
    if (!(name && password && email)) {
      return res.send("Fill the credientials");
    }

    //   Check if user alredy exist
    const existingUser = await Sponsor.findOne({ email });
    if (existingUser) {
      return res.send("email already exist");
    }

    // Save the user in DB
    const sponsor = await Sponsor.create({
      name,
      email,
      company,
      phoneNumber,
      isVerified: false,
    });

    // Generate a sponser and send it
    const token = jwt.sign(
      {
        id: sponsor._id,
      },
      process.env.JWT_SECRET_KEY_AUTH,
      {
        expiresIn: "10d",
      }
    );
    sponsor.token = token;
    res.status(200).cookie(token).json({
      message: "You have signed up succesfully",
    });
}

async verifyEmail(req, res) {
    const { email } = req.query;

    // Check if email is provided
    if (!email) {
      return res.status(400).send("No email provided.");
    }

    // Find the sponsor by email
    const sponsor = await Sponsor.findOne({ email });

    if (!sponsor) {
      return res.status(400).send("Invalid email address.");
    }

    // Check if the sponsor is already verified
    if (sponsor.isVerified) {
      return res.status(400).send("Email is verified.");
    }

    // Mark the sponsor as verified
    sponsor.isVerified = true;
    await sponsor.save();

    res.status(200).json({
      message: "Email verified successfully.",
    });
  }
}

module.exports = new sponsorController();