require('dotenv').config();
const color = require('../utils').color;
const { Pool } = require('pg');

//Global Constants
const log = console.log;

const database = () => {
  const config = {
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
  };

  return new Pool(config);
};

module.exports = database;
