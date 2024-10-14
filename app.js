const express = require("express");
const eventRoutes = require("./Routes/events");
// const bodyParser = require('body-parser');
const adminRoutes = require("./Routes/adminRoutes");
const sponsor = require("./Routes/sponsor");
const authRoutes = require("./Routes/authRoutes");
const eventRegisterRoutes = require("./Routes/eventRegisterRoutes");
const mailerRoutes = require("./Routes/mailerRoutes");
const docsRoutes = require("./Routes/pdfRoutes");

require("dotenv").config();

const connectDB = require("./db");

const app = express();

connectDB();

// Middleware
app.use(express.json()); // Parse incoming JSON requests

// Routes
app.use("/api/events", eventRoutes); // Use the events routes
app.use("/api/sponsor", sponsor);
app.use("/api/mailer", mailerRoutes);
// app.use('/api', eventRegisterRoutes);
app.use("/api/docs", docsRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/user", authRoutes);
app.use("/admin", adminRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
