const express = require('express');
const eventRoutes = require('./routes/events');

const app = express();

// Middleware
app.use(express.json());  // Parse incoming JSON requests

// Routes
app.use('/api/events', eventRoutes);  // Use the events routes

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

