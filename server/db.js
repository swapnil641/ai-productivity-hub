const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  host: process.env.DB_HOST || "3.110.189.247",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "todo_db",
});

module.exports = pool;
