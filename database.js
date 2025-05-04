const { Pool } = require('pg');
require('dotenv').config(); 

const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};