const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../config/.env'),
});
const router = require('express').Router();
const axios = require('axios');

// Get a practiceQuestion
router.get('/practiceQuestion', async (req, res) => {
  const url = `https://questions.aloc.com.ng/api/v2/q?subject=${req.query.subject}&type=${req.query.type}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        AccessToken: process.env.ALOC_ACCESS_TOKEN,
      },
    });

    // Sending the data back to the client
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('An error occurred while fetching data');
  }
});

//Get many practiceQuestion
router.get('/quizQuestions', async (req, res) => {
  const url = `https://questions.aloc.com.ng/api/v2/m?subject=${req.query.subject}&type=${req.query.type}&year=${req.query.year}`;
  try {
    const response = await axios.get(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        AccessToken: process.env.ALOC_ACCESS_TOKEN,
      },
    });

    // Sending the data back to the client
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('An error occurred while fetching data');
  }
});

module.exports = router;
