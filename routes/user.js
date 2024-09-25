const express = require("express");
const { userSignup, userLogin } = require("../controllers/user");

const router = express.Router();

router.post("/api/v1/signup", userSignup);

router.post("/api/v1/login", userLogin);

module.exports = router;