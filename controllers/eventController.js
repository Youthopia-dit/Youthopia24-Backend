const Event = require("../models/eventModel"); // Importing the Event model

exports.createEvent = async (req, res) => {
  const { event_id, event_name } = req.body;

  try {
    // Check for duplicate event ID or name
    const existingEvent = await Event.findOne({
      $or: [{ event_id: event_id }, { event_name: event_name }],
    });
    if (existingEvent) {
      return res
        .status(409)
        .json({ message: "An event with the same ID or name already exists." });
    }

    // If no duplicates, create a new event
    const newEvent = new Event(req.body);
    await newEvent.save();
    res
      .status(201)
      .json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    res
      .status(403)
      .json({ message: "Failed to create the event", error: error.message });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json({ events });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving events", error: error.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findOne({ event_id: req.params.id });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving the event", error: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const e=await Event.findOne({ event_id: req.params.id})
    if (!e) {
        return res.status(404).json({ message: "Event not found" });
      }
    
    const event = await Event.deleteOne({ event_id: req.params.id });
    console.log(event)
    
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete the event", error: error.message });
  }
};
