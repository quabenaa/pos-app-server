require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

//user defined modules
const color = require('../utils').color;

//Import routes
const users = require('../routes/users');

//Global Constants
const log = console.log;
const port = process.env.PORT;

const init = () => {
  const app = express();

  //Body Parser Middleware
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  //Passport Middleware
  app.use(passport.initialize());
  app.use(passport.session());
  require('../middleware/authentication')(passport);

  app.get('/', (request, response) => {
    response.send('POS is online');
  });

  /**
   * Routes for the api
   */
  //Users Route
  app.use('/api/user', users);

  //Starting the Listener
  app.listen(port, () => {
    log(color.success('*** Server has STARTED ***'));
    log(color.info(`*** PORT : ${process.env.PORT} ***`));
  });
};

module.exports.init = init;
