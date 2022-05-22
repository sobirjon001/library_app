// import libraries
const { createPool } = require("mysql");

// creating mysql connection
const pool = createPool({
  host: process.env.MYSQL_HOST || "localhost",
  port: process.env.MYSQL_PORT || "3306",
  user: process.env.MYSQL_USER || "library",
  password: process.env.MYSQL_PASSWORD || "library_app",
  database: process.env.MYSQL_DATABASE || "library_db",
  connectionLimit: 10,
  dateStrings: true,
});

module.exports = pool;
