const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../config/.env'),
});
const router = require('express').Router();
const axios = require('axios');

// Get a quizQuestion
router.get('/quizQuestion', async (req, res) => {
  const url = `https://questions.aloc.com.ng/api/v2/q?subject=${req.query.subject}&year=${req.query.year}&type=${req.query.type}`;

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

//Exam questions
router.get('/exam-questions', async (req, res) => {
  // Get a question
  // const url = `https://questions.aloc.com.ng/${process.env.ALOC_ACCESS_TOKEN}/v2/q?subject=${req.query.subject}`;

  //   Get many questions (returns 40 questions)
  // https://questions.aloc.com.ng/api/v2/m?subject=chemistry

  const url = `https://questions.aloc.com.ng/${process.env.ALOC_ACCESS_TOKEN}/v2/q?subject=chemistry&year=2010&type=utme`;
  try {
    const response = await axios.get(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        AccessToken: process.env.ACCESS_TOKEN,
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