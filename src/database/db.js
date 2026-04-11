const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "your_database_name",
  password: "your_password",
  port: 5432,
});

module.exports = pool;