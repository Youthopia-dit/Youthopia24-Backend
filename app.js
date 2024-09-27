const express = require("express");
const eventRoutes = require("./routes/events");
const authRouter = require("./routes/authRoutes");
require("dotenv").config();

const connectDB = require("./db");

const app = express();

connectDB();

// Middleware
app.use(express.json()); // Parse incoming JSON requests

// Routes
app.use("/api/events", eventRoutes); // Use the events routes

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/", authRouter);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
