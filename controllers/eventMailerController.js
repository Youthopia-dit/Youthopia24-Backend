const Event = require('../models/Event');
const sendMail = require('../utils/mailer');

exports.registerForEvent = async (req, res) => {
  try {
    const { userId, eventId } = req.body;

    // Logic to register the user for the event (not shown)

    // Fetch event details
    const event = await Event.findById(eventId);
    const user = await User.findById(userId);

    // Send a confirmation email with the ticket and receipt
    const subject = 'Event Registration Successful';
    const text = `Hi ${user.name}, You have successfully registered for the event: ${event.name}`;
    const html = `<p>Hi <strong>${user.name}</strong>,</p>
                  <p>You have successfully registered for the event: <strong>${event.name}</strong>.</p>
                  <p>Here is your ticket: <strong>Ticket #12345</strong></p>
                  <p>Receipt: <strong>$100</strong></p>`;

    await sendMail(user.email, subject, text, html);

    res.status(200).json({ message: 'Registered and email sent!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
