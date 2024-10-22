const Flagships = require('../models/highlightsModel');
const Event = require('../models/eventModel');

const highlightController = async (req, res) => {
  try {
    const [{ events }] = await Flagships.find();

    const allEvents = await Event.find({ event_id: { $in: events } });

    res.status(200).json({
      message: 'All events',
      data: allEvents,
    });
  } catch (err) {
    res.json(err);
  }
};

module.exports = highlightController;
