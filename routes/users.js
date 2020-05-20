'use strict';

require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');

// Load User define details
const UsersController = require('../database/controllers/users');

/**
 * @route POST api/users/register
 * @desc  Register New User / Returning
 * @access Public
 *
 */
router.post('/register', [UsersController.register]);

/**
 * @route POST api/users/login
 * @desc  Login User / Returning
 * @access Public
 *
 */
router.post('/login', [UsersController.login]);

/**
 * @route POST api/users/update
 * @desc  Update User profile / Returning
 * @access Public
 *
 */
router.post('/update', [UsersController.update]);

/**
 * @route POST api/users/deactivate
 * @desc  Deactivate User profile / Returning
 * @access Public
 *
 */
router.post('/deactivate', [UsersController.deactivate]);

/**
 * @route GET api/users/query
 * @desc  Query all registered Users / Returning
 * @access Public
 *
 */
router.get('/query', passport.authenticate('jwt', { session: false }), [
  UsersController.query,
]);

/**
 * @route GET api/users/query
 * @desc  Query all registered Users / Returning
 * @access Public
 *
 */
router.get('/query/:id', passport.authenticate('jwt', { session: false }), [
  UsersController.queryOne,
]);

module.exports = router;
