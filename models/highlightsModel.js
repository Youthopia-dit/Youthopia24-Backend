const mongoose = require('mongoose');

const flagships = new mongoose.Schema({
  events: [],
});

module.exports = mongoose.model('Flagships', flagships);
