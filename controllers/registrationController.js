const express = require("express");
const Registration = require("../models/registrationModel");
const Event = require("../models/eventModel");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const { SendEmail } = require("../utils/mailer");
const { getData } = require("./pdfEditorController");

exports.registerEvent = async (req, res) => {
  try {
    const { teamName, college, eventId, members, payment, isDIT } = req.body;
    const { email } = req.user; // Extract email from the middleware

    const regID = uuidv4();
    const event = await Event.findOne({ event_id: eventId });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    console.log(req.body)

    const membersWithIds = members.map((member) => ({
      ...member,
      id: new mongoose.Types.ObjectId(), // Automatically generate ObjectId for each member
    }));

    const registration = new Registration({
      regID,
      email,
      teamName,
      college,
      eventDetails: {
        eventID: event.event_id,
        eventName: event.event_name,
        eventCategory: event.category,
        venue: event.venue,
        event_poster: event.event_poster,
      },
      members: members,
      payment: {
        paid: payment.paid,
        amount: payment.amount,
      },
    });

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await registration.save();

    user.registeredEvent.push(registration.regID);
    await user.save();
    console.log(college)
    if(college === "DIT University"){
      SendEmail(
        email,
        "Registration Confirmation",
        `Your registration for the ${event.event_name} has been successful. You can now proceed for payment.`
      );
      return res.status(201).json({ message: "Registration successful"});
    }

    const pdfData = [
      {
        regID: registration.regID,
        eventID: event.event_id,
        eventName: event.event_name,
        eventDate: event.date,
        Venue: event.venue,
        collegeName: college,
        email: email,
        participants: members.map((member, index) => ({
          Sno: index + 1,
          name: member.name,
          collegeId: member.collegeId,
          governmentId: member.personalId,
        })),
      },
    ];
    const pdfPaths = await getData([pdfData] );

    if (pdfPaths && pdfPaths.length > 0) {
      SendEmail(
        email,
        "Registration Confirmation",
        "Your registration for the event has been successful. Please find the attached Gate Pass that needs to be certified from your college Authorities. You ca nnow proceed for payment.",
        pdfPaths[0]
      );
    } else {
      SendEmail(
        email,
        "Registration Confirmation",
        "Your registration for the event has been successful. You can now proceed for payment."
      );
    }

    res.status(201).json({ message: "Registration successful"});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getRegistrationsByIds = async (req, res) => {
  try {
    const { registrationIds } = req.body;

    if (!registrationIds || !Array.isArray(registrationIds)) {
      return res.status(400).json({ message: "Invalid registration IDs format" });
    }

    const registrations = await Registration.find({
      regID: { $in: registrationIds },
    });

    if (registrations.length === 0) {
      return res.status(404).json({ message: 'No registrations found' });
    }

    res.status(200).json({ registrations });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getRegistrations = async (req, res) => {
  try {
    const {eventId} = req.params;

    const registrations = await Registration.find({ 'eventDetails.eventID': eventId });

    if (registrations.length === 0) {
      return res.status(404).json({ message: 'No registrations found' });
    }

    res.status(200).json({ registrations });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error', error });
  }
}
