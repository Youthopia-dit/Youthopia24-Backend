const express = require('express');
const eventRoutes = require('./routes/events');
const adminRoutes = require("./routes/adminRoutes");
const testMailerRoute = require('./routes/testMailer');
const authRoutes = require('./routes/authRoutes');
require("dotenv").config();

const connectDB = require("./db");

const app = express();

connectDB();

// Middleware
app.use(express.json());  // Parse incoming JSON requests

// Routes
app.use('/api/events', eventRoutes);  // Use the events routes
app.use('/api/test', testMailerRoute);

app.get("/", (req, res) => {
    res.send("Hello World!");
  });
  
app.use("/", authRoutes);
app.use("/", adminRoutes);


// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

