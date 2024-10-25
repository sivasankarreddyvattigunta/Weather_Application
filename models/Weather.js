
const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
  city: String,
  date: { type: Date, default: Date.now },
  avgTemp: Number,
  maxTemp: Number,
  minTemp: Number,
  dominantCondition: String,
  temperatures: [Number],
  mainConditions: [String]
});

module.exports = mongoose.model('Weather', weatherSchema);
