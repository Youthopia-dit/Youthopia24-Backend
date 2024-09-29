const express = require("express");
const { userSignup, userLogin } = require("../controllers/user");

const router = express.Router();

router.post("/api/v2/signup", userSignup);

router.post("/api/v2/login", userLogin);

module.exports = router;