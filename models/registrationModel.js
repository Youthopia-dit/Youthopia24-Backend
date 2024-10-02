const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        eventID: {
            type: String,
            required: true,
        },
        eventName: {
            type: String,
            required: true,
        },
        eventCategory: {
            type: String,
            required: true,
        },
        venue: {
            type: String,
            required: true,
        },
    });

const memberSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        contactNumber: {
            type: String,
            required: true,
        },
        emailID: {
            type: String,
            required: true,
        },
        id: {
            type: String,
            required: true,
        },
    });

const paymentSchema = new mongoose.Schema(
    {
        mode: {
            type: String,
            required: true,
        },
        amount: {
            type: String,
            required: true,
        },
        transaction: {
            type: String,
            required: true,
        },
        billing: {
            type: String,
            required: true,
        },
    });


const registrationSchema = new mongoose.Schema({
    UID: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    teamName: {
        type: String,
        required: true,
    },
    college: {
        type: String,
        required: true,
    },
    eventDetails: {
        type: eventSchema,
        required: true,
    },
    members: [memberSchema], 
    payment: {
        type: paymentSchema,
        required: true,
    }
});

const Registration = mongoose.model("Registration", registrationSchema);

module.exports = Registration;