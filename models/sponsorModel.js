const mongoose = require("mongoose");

const sponsorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    company: {
      type: String,
      required: true,
    },
    event: {
      type: String,
      required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    }
  },
  { timestamps: true }
);

const Sponsor = mongoose.model("Sponsor", sponsorSchema);

module.exports = Sponsor;