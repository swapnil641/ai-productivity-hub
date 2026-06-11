const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: "postgres",
  host: "postgres",
  port: 5432,
  database: "todo_db",
});

module.exports = pool;
