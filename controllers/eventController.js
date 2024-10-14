const Event = require("../models/eventModel");

exports.createEvent = async (req, res) => {
    const { event_id, event_name, event_poster } = req.body;
    
    try {
      let event = await Event.findOne({ event_id });
  
      if (event) {
        Object.assign(event, req.body);
        await event.save();
        return res.json({ message: "Event updated successfully", event });
      } else {
        const newEvent = new Event(req.body);
        await newEvent.save();
        res.status(201).json({ message: "Event created successfully", event: newEvent });
      }
    } catch (error) {
      console.log(error);
        res.status(500).json({ message: "Failed to process the event", error: error.message });
    }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json({ events });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving events", error: error.message });
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
    res.status(500).json({ message: "Error retrieving the event", error: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({ event_id: req.params.id });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete the event", error: error.message });
  }
};
