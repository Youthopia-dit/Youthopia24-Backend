const express = require("express");
const authController = require("../controllers/userAuthController");
const userProtectedRoutes = require("../middleware/userProtectedRoutes");

const router = express.Router();

router.post("/initialSignup", authController.initialSignup);
router.post("/sendOTP", authController.sendOtp);
router.post("/verifyOTP", authController.verifyOtp);
router.post('/login', authController.userLogin);
router.post('/forgotpassword', authController.forgotPassword);
router.post('/passwordResetCheckotp', authController.checkOtp);
router.post('/resetPassword',userProtectedRoutes,authController.resetPasswordController)
router.get('/getProfile',userProtectedRoutes,authController.getUserProfile)
module.exports = router;
