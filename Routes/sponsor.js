
const express = require("express");
const sponsorController = require("../controllers/sponsorController");
const router = express.Router();


router.get("/getSponsors", sponsorController.getAllSponsors);

// // Signup route
// router.post("/signup", sponsorController.sponsorSignup);

// // Email verification route
// router.get("/verify-email", sponsorController.verifyEmail);

module.exports = router;


