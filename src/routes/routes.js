const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../config/.env'),
});
const router = require('express').Router();
const moment = require('moment'); // required for getting time and date
const gmailTransporter = require('../email/email.js');
const Crypto = require('crypto');
let randomChar;

router.get('/timeDate', (req, res) => {
  const dateTime = moment().format('[©]YYYY. [Time: ]h:mm:ss A');
  res.send(dateTime);
});

// Front Page
router.get('/', (req, res) => {
  res.render('index', { title: 'Home Page' });
});

// Quiz Page
router.get('/quiz', (req, res) => {
  res.render('quiz', { title: 'Quiz page' });
});

// Practice test Page
router.get('/practice-test', (req, res) => {
  res.render('practice', { title: 'Practice Page' });
});

//Contact page
router.get('/contact', async (req, res) => {
  randomChar = Crypto.randomBytes(21).toString('base64').slice(0, 5);
  res.render('contact', { randomChar });
});

module.exports = router;
