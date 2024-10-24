const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
    regID: {
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
        event_poster: {
          type: String,
          required: true,
        },
    },
    members: [
        {
            name: {
                type: String,
                required: true,
            },
            collegeId: {
                type: String,
                required: true,
            },
            personalId: {
                type: String,
            }
        }
    ],
    payment: {
        paid: {type: Boolean, required: true},
        amount: {type: String, required:true}
    }
});

const Registration = mongoose.model("Registration", registrationSchema);

module.exports = Registration;
