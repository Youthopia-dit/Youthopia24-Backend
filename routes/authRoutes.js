const express = require("express");
const authController = require("../controllers/userAuthController");
const userProtectedRoutes = require("../middleware/userProtectedRoutes");

const router = express.Router();

router.post("/initialSignup", authController.initialSignup);

router.post("/verifyOTP", authController.verifyOtp);

// router.post('/api/v1/login', userLogin);

// router.post('/api/v1/forgotpassword', forgotPassword);

// router.post('/api/v1/checkotp', checkOtp);

module.exports = router;
