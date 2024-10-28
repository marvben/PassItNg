const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../../config/.env'),
});
const nodemailer = require('nodemailer');

function gmailTransporter(formData) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_STRING,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: formData.email,
    to: process.env.RECEIVING_EMAIL,
    subject: 'Message From My Personal Site',
    html: `<h1>Message from ${formData.name}</h1>
                  <p>Email: ${formData.email}</p>
                  <p>Name: ${formData.name}</p>
                  <p>Tel: ${formData.tel}</p>
                  <p>Message: ${formData.content}</p>
                  <p>${new Date().toLocaleString()}</p>`,
  };
  return { transporter, mailOptions };
}

module.exports = gmailTransporter;
