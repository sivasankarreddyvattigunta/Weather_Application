const express = require('express');
const axios = require('axios');
const Weather = require('../models/Weather');
const router = express.Router();

const kelvinToCelsius = temp => (temp - 273.15).toFixed(2);

router.get('/fetch/:city', async (req, res) => {
  try {
    const city = req.params.city;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);

    const data = response.data;
    const weatherData = {
      city,
      avgTemp: kelvinToCelsius(data.main.temp),
      maxTemp: kelvinToCelsius(data.main.temp_max),
      minTemp: kelvinToCelsius(data.main.temp_min),
      dominantCondition: data.weather[0].main,
    };

    res.json(weatherData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching weather data' });
  }
});

// Save daily summary
router.post('/save', async (req, res) => {
  const { city, avgTemp, maxTemp, minTemp, dominantCondition, temperatures, mainConditions } = req.body;
  const weatherSummary = new Weather({
    city,
    avgTemp,
    maxTemp,
    minTemp,
    dominantCondition,
    temperatures,
    mainConditions
  });

  try {
    const savedSummary = await weatherSummary.save();
    res.status(201).json(savedSummary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving weather data' });
  }
});

module.exports = router;
