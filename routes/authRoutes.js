const express = require("express");
const {
  userSignup,
  userLogin,
  forgotPassword,
} = require("../controllers/UserAuthController");

const router = express.Router();

router.post("/api/v1/signup", userSignup);

router.post("/api/v1/login", userLogin);

router.post("/api/v1/forgotpassword", forgotPassword);

module.exports = router;
