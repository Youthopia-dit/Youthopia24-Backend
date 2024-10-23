const express = require("express");
const Registration = require("../models/registrationModel");
const Event = require("../models/eventModel");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/userModel");

exports.registerEvent = async (req, res) => {
  try {
    const {
      email,
      eventId,
      teamName,
      college,
      members,
      phone
    } = req.body;
    const regID = uuidv4();
    const event = await Event.findOne({ event_id: eventId });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const registration = new Registration({
      regID,
      email,
      teamName,
      college,
      phone,
      eventDetails: {
        eventID: event.event_id,
        eventName: event.event_name,
        eventCategory: event.category,
        venue: event.venue,
      },
      members,
    });
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.registeredEvent.push(registration.regID);
    await user.save();
    await registration.save();

    res.status(201).json({ message: "Registration successful", registration });    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// exports.registerEvent = async (req, res) => {
//   try {
//     const {
//       email,
//       teamName,
//       college,
//       eventDetails,
//       members,
//       payment,
//       isDIT,
//     } = req.body;
//     const regID=uuidv4();
//     const event = await Event.findOne({ event_id: eventDetails.eventID });
//     if (!event) {
//       return res.status(404).json({ message: "Event not found" });
//     }

//     const teamSize = members.length;

//     const priceDetails = event.prices.find(
//       (price) => price.teamSize === teamSize
//     );
//     if (!priceDetails) {
//       return res
//         .status(400)
//         .json({ message: "Invalid team size for this event" });
//     }

//     const amount = isDIT ? priceDetails.priceDit : priceDetails.priceNonDit;

//     const registration = new Registration({
//       regID,
//       email,
//       teamName,
//       college,
//       eventDetails: {
//         eventID: event.event_id,
//         eventName: event.event_name,
//         eventCategory: event.category,
//         venue: event.venue,
//       },
//       members,
//       payment: {
//         paid: payment.paid,
//         amount: amount.toString(),
//       },
//     });

//     await registration.save();

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     user.registeredEvent.push(registration.regID);
//     await user.save();

//     res.status(201).json({ message: "Registration successful", registration });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };

exports.getRegistrationsByIds = async (req, res) => {
  try {
    const { registrationIds } = req.body;

    if (!registrationIds || !Array.isArray(registrationIds)) {
      return res
        .status(400)
        .json({ message: "Invalid registration IDs format" });
    }

    const registrations = await Registration.find({
      _id: { $in: registrationIds },
    });

    if (registrations.length === 0) {
      return res.status(404).json({ message: "No registrations found" });
    }

    res.status(200).json({ registrations });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};
