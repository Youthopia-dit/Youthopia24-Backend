const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { totp } = require("otplib");

const sendEmail = (email_id, subject, content) => {
  console.log(content);
};

totp.options = {
  step: 300,  // Time step in seconds
  window: 1   // Flexibility in terms of time steps (1 time step before or after)
};

exports.initialSignup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide name, email, and password" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    
    options = {  ...totp.options }; // Generating OTP valid for 5 minutes
    const otp = totp.generate(email,options);
    // Send the OTP to user's email
    await sendEmail(
      email,
      "Verify Your Email",
      `Your verification code is: ${otp}`
    );

    // For the sake of this example, let's store this hashed password temporarily
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store the user's details temporarily in a secure place or in memory
    // In a production environment, consider securing this data appropriately
    const tempStorage = {
      name,
      email,
      password: hashedPassword,
      otp,
    };

    // Respond to user
    res.status(200).json({
      message:
        "Verification code sent to your email. Please verify to complete registration.",
      tempStorage
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  const { tempStorage, userOtp } = req.body;

  try {
    // Retrieve user's data from temporary storage
    const userData = tempStorage; // Replace with your method of temporary storage retrieval
    const verification = totp.check(userOtp, userData.email);
    console.log(userData.email)
    if (!verification) {
      return res
        .status(400)
        .json({ message: "Invalid OTP. Please try again." });
    }

    // Create the user in the database since OTP is verified
    const newUser = await User.create({
      name: userData.name,
      email: userData.email,
      password: userData.password, // Already hashed
    });

    res.status(201).json({ message: "Signup completed successfully", newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//USER LOGIN CONTROLLERS------>TO BE FIXED

//   async userLogin(req, res) {
//     try {
//       const { email, password } = req.body;

//       if (!(email && password)) {
//         return res.json({
//           message: 'Enter email and password',
//         });
//       }

//       const user = await User.findOne({ email }).select('+password');

//       if (!user || !(await bcrypt.compare(password, user.password))) {
//         return res.status(401).json({
//           message: 'Incorrect email or password',
//         });
//       }

//       const token = jwt.sign(
//         {
//           id: user._id,
//         },
//         process.env.JWT_SECRET_KEY_AUTH,
//         {
//           expiresIn: '10d',
//         }
//       );
//       user.token = token;
//       res.status(200).cookie(token).json({
//         message: 'You have logged in succesfully',
//         token,
//       });
//     } catch (err) {
//       res.send(err.message);
//     }
//   }

//   async forgotPassword(req, res) {
//     try {
//       // Getting the eamil from from client
//       const { email } = req.body;

//       if (!email) {
//         return res.status(400).json({
//           message: 'Enter a valid email',
//         });
//       }

//       // Checking if the user exists or not
//       const user = await User.findOne({ email });
//       if (!user) {
//         return res.status(404).json({
//           message: 'The email does not exist in the database',
//         });
//       }

//       // Generating OTP
//       const { otp, expires } = TOTP.generate(`${process.env.OTP_SECRET_KEY}`, {
//         period: 60 * 30,
//         algorithm: 'SHA-512',
//       });

//       // Sending the otp to the email

//       // Sending message to client
//       res.status(200).json({
//         message: `Otp has been sent to ${email}`,
//         expires,
//       });
//     } catch (err) {
//       res.send(err.message);
//     }
//   }

//   async checkOtp(req, res) {
//     try {
//       const { otp, expiresTime } = req.body;

//       if (!(otp || expiresTime)) {
//         return res.status(400).json({
//           message: 'Enter the otp',
//         });
//       }

//       // Checking if the otp has expired or not
//       const currentTime = Date.now();

//       if (currentTime > expiresTime) {
//         return res.status(410).json({
//           message: 'The otp has expired',
//         });
//       }

//       res.status(200).json({
//         message: 'You can set new password',
//       });
//     } catch (err) {
//       res.send(err.message);
//     }
//   }
// }

// module.exports = new UserAuthController();
