const mongoose = require("mongoose");

const sponsorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const Sponsor = mongoose.model("sponsors", sponsorSchema);

module.exports = Sponsor;