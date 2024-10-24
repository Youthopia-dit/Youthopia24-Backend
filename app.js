const express = require('express');
const eventRoutes = require('./Routes/events');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
// const adminRoutes = require("./Routes/adminRoutes");
// const sponsor = require("./Routes/sponsor");
const authRoutes = require('./Routes/authRoutes');
const eventRegisterRoutes = require("./Routes/eventRegisterRoutes");
const mailerRoutes = require("./Routes/mailerRoutes");
const docsRoutes = require("./Routes/pdfRoutes");
const highlightRoutes = require('./Routes/highlightsRoutes');

require('dotenv').config();

const connectDB = require('./db');

const app = express();

connectDB();
app.use(cors());

app.use(express.json()); // Parse incoming JSON requests

// Routes
app.use('/api/events', eventRoutes); // Use the events routes
// app.use("/api/sponsor", sponsor);
app.use("/api/mailer", mailerRoutes);
app.use("/api/register/", eventRegisterRoutes);
app.use("/api/docs", docsRoutes);
app.use('/api/gethighlights', highlightRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});


const options = {
  key: fs.readFileSync('./private.key'),  // Private key
  cert: fs.readFileSync('./certificate.crt'), // Certificate
  ca: fs.readFileSync('./ca_bundle.crt')
};

app.use('/api/user', authRoutes);
// app.use("/admin", adminRoutes);

const PORT = 4000;
const server = https.createServer(options, app);
server.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
// app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
