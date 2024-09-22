
const express = require("express");
require("dotenv").config();

const connectDB = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;


connectDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
