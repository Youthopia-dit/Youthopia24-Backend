const express = require('express');
const eventRoutes = require('./routes/events');
const adminRoutes = require("./routes/adminRoutes");
const sponsor = require('./routes/sponsor');
const authRoutes = require('./routes/authRoutes');
const mailerRoutes = require('./routes/mailerRoutes');
const eventRegisterRoutes = require('./routes/eventRegisterRoutes');

require("dotenv").config();

const connectDB = require("./db");

const app = express();

connectDB();

// Middleware
app.use(express.json());  // Parse incoming JSON requests

// Routes
app.use('/api/events', eventRoutes);  // Use the events routes
app.use('/api/sponsor', sponsor);
app.use('/api/mailer', mailerRoutes);
app.use('/api', eventRegisterRoutes);

app.get("/", (req, res) => {
    res.send("Hello World!");
  });
  
app.use("/", authRoutes);
app.use("/", adminRoutes);


// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

