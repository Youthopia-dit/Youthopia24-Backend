const express = require("express");
require("dotenv").config();
const authRouter = require("./routes/user");

const connectDB = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/", authRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});