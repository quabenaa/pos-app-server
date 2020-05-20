'use strict';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserModel = require('../models/Users');

const register = (req, res) => {
  let {
    username,
    password,
    firstname,
    lastname,
    email,
    access_level,
  } = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    if (err) throw err;
    bcrypt.hash(password, salt, (err, hashedpassword) => {
      //return encrypted password
      password = hashedpassword;

      //save new user
      UserModel.createUserModel({
        username,
        password,
        salt,
        firstname,
        lastname,
        email,
        access_level,
      })
        .then((user) => res.send({ success: true, user }))
        .catch((e) =>
          res
            .status(404)
            .send({ success: false, error: 'User Creationed Failed' })
        );
    });
  });
};

const login = (req, res) => {
  let { username, password } = req.body;

  //get User details
  UserModel.loginUserModel({ username })
    .then((user) => {
      if (!user)
        res.status(404).send({ success: false, error: 'User Not Found' });

      //authenticate the username and password
      bcrypt
        .compare(password, user.password)
        .then((isMatch) => {
          if (isMatch) {
            const payload = {
              id: user.id,
              username: user.username,
              access_level: user.access_level,
            };

            const SignOptions = { expiresIn: process.env.TOKENEXPIRY };

            // JWT Sign and return 'Bearer' token
            jwt.sign(payload, process.env.SECRET, SignOptions, (err, token) => {
              if (err)
                res.status(500).send({
                  success: false,
                  error: 'Error signing token',
                });

              res.send({
                success: true,
                token: 'Bearer ' + token,
                payload,
              });
            });
          } else {
            res
              .status(404)
              .send({ success: false, error: 'User Authentication Failed' });
          }
        })
        .catch((e) => {
          console.log(e.stack);
          res.res
            .status(404)
            .send({ error: 'Failed to Login. Please try again later' });
        });
    })
    .catch((e) => {
      console.log(e.stack);
      res.res
        .status(404)
        .send({ error: 'Failed to Login. Please try again later' });
    });
};

const update = (req, res) => {
  //let { firstname, lastname, username, email, password } = req.body;

  console.log(req.body);
  res.send(req.body);
};

const deactivate = (req, res) => {
  //let { firstname, lastname, username, email, password } = req.body;

  console.log(req.body);
  res.send(req.body);
};

const query = (req, res) => {
  UserModel.queryUserModel()
    .then((users) => {
      res.send({ success: true, users });
    })
    .catch((error) => {
      console.log(error.stack);
      res.res.status(404).send({
        success: false,
        error: 'Failed to Login. Please try again later',
      });
    });
};

const queryOne = (req, res) => {
  const username = req.params.id;
  UserModel.queryOneUserModel({ username })
    .then((users) => {
      res.send(users);
    })
    .catch((error) => {
      console.log(error.stack);
      res.res.status(404).send({
        success: false,
        error: 'Failed to Login. Please try again later',
      });
    });
};

module.exports = {
  register,
  login,
  query,
  queryOne,
  update,
  deactivate,
};
