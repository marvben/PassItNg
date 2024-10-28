require('dotenv').config();

const compression = require('compression');
const express = require('express');
const app = express();
const path = require('path');
const routes = require('./routes/routes');
const apis = require('./utils/api/aloc');

const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// compress all responses. Should be placed before all routes
app.use(compression());
app.use('/', routes);
app.use('/', apis);
app.use(express.static(path.join(__dirname, '../public')));

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

//adding expire headers
app.use(
  express.static(path.join(__dirname, '../public'), {
    maxAge: 86400000,
    setHeaders: function (res, path) {
      res.setHeader(
        'Expires',
        new Date(Date.now() + 2592000000 * 30).toUTCString()
      );
    },
  })
);

// Catch-all route for 404 errors
app.use((req, res) => {
  res.status(404).render('404');
});

// Start the server
app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server is running on http://localhost:${PORT}`);
});
