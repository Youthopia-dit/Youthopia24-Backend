const Event = require('../models/eventModel');

const dummyEvents = [
  {
    event_id: 'EVT12345',
    event_name: 'Annual Tech Symposium',
    event_description:
      'A day-long event featuring workshops, coding competitions, and tech talks by industry leaders.',
    event_poster: 'https://example.com/techsymposium_poster.jpg',
    venue: 'Main Auditorium, College Campus',
    date: '2024-12-20',
    start_time: '09:00 AM',
    end_time: '05:00 PM',
    coordinator: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+919876543210',
    },
    rules: [
      'Participants must bring their own laptops.',
      'Team sizes can range from 1 to 4 members.',
      'All participants must register at least one week prior to the event.',
    ],
    club_name: 'Tech Club',
    overall_head: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+919812345678',
    },
    participant_max: 4,
    participant_min: 1,
    category: 'Technical',
    prices: [
      {
        team_size: 1,
        price_dit: 50,
        price_non_dit: 100,
      },
      {
        team_size: 2,
        price_dit: 80,
        price_non_dit: 150,
      },
      {
        team_size: 4,
        price_dit: 120,
        price_non_dit: 200,
      },
    ],
  },
  {
    event_id: 'EVT67890',
    event_name: 'Cultural Fest',
    event_description:
      'A vibrant cultural festival showcasing various art forms.',
    event_poster: 'https://example.com/culturalfest_poster.jpg',
    venue: 'Open Grounds, College Campus',
    date: '2024-11-15',
    start_time: '10:00 AM',
    end_time: '08:00 PM',
    coordinator: {
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      phone: '+919812345678',
    },
    rules: [
      'Solo and group performances are allowed.',
      'The event will be judged by external artists.',
      'The maximum group size is 5 members.',
    ],
    club_name: 'Cultural Club',
    overall_head: {
      name: 'Bob Martin',
      email: 'bob.martin@example.com',
      phone: '+919876543210',
    },
    participant_max: 5,
    participant_min: 1,
    category: 'Cultural',
    prices: [
      {
        team_size: 1,
        price_dit: 30,
        price_non_dit: 60,
      },
      {
        team_size: 3,
        price_dit: 90,
        price_non_dit: 180,
      },
    ],
  },
];

exports.createEvent = async (req, res) => {
  const {
    event_id,
    event_name,
    event_description,
    event_poster,
    venue,
    date,
    start_time,
    end_time,
    coordinator,
    rules,
    club_name,
    overall_head,
    participant_max,
    participant_min,
    category,
    prices,
  } = req.body;

  // Ensure required fields are provided
  // if (!name || !description || !date || !location || !prices || prices.length === 0) {
  //   return res.status(400).json({ message: 'All fields except image are required, including at least one price entry.' });
  // }

  // Validate the prices array
  for (const price of prices) {
    if (!price.teamSize || !price.priceDit || !price.priceNonDit) {
      return res
        .status(400)
        .json({
          message:
            'Each price entry must include teamSize, priceDit, and priceNonDit.',
        });
    }
  }

  const newEvent = {
    event_id,
    event_name,
    event_description,
    event_poster,
    venue,
    date,
    start_time,
    end_time,
    coordinator,
    rules,
    club_name,
    overall_head,
    participant_max,
    participant_min,
    category,
    prices, // Array of price objects
  };

  try {
    // Push the new event into dummyEvents array
    dummyEvents.push(newEvent);
    res.status(201).json({ message: 'Event created', event: newEvent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    // const events = await Event.find();
    res.json(dummyEvents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    //   const event = await Event.findById(req.params.id);
    const event = dummyEvents[req.params.id];
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
