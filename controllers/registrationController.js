// const express = require('express');
// const Registration = require("../models/registrationModel");

// exports.registerEvent = async(req, res) => {
//     try {
//         const { UID, email, teamName, college, eventDetails, members, payment } = req.body;

//         const registration = new Registration({
//             UID,
//             email,
//             teamName,
//             college,
//             eventDetails,
//             members,
//             payment
//         });

//         await registration.save();

//         res.status(201).json({ message: 'Registartion successful', registration});
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: 'Server error', error});
//     }
// };