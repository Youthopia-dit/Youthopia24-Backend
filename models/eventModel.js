const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema({
    teamSize: {
      type: Number,
      required: true
    },
    priceDit: {
      type: Number,
      required: true
    },
    priceNonDit: {
      type: Number,
      required: true
    }
  }, { _id: false });

  
const eventSchema = new mongoose.Schema({
  event_id: {
    type: String,
    required: true,
  },
  event_name: {
    type: String,
    required: true,
  },
  event_description: {
    type: String,
    required: true,
  },
  event_poster: {
    type: String,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  date: {
    type: String, 
    required: true,
  },
  start_time: {
    type: String,
    required: true,
  },
  end_time: {
    type: String,
    required: true,
  },
  coordinator: {
    type: {}, // Array of strings
    required: true,
  },
  rules: {
    type: [String],
    required: true,
  },
  club_name: {
    type: String,
    required: true,
  },
  overall_head: {
    type: {},
    required: true,
  },
  participant_max: {
    type: Number,
    required: true,
  },
  participant_min: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  prices: [priceSchema],  // Array of prices based on team size
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;