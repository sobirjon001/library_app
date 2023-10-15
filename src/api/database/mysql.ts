// import libraries
import { createPool, Pool } from 'mysql';

// creating mysql connection
export const pool: Pool = createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'root',
  database: process.env.MYSQL_DATABASE || 'library_db',
  connectionLimit: 10,
  dateStrings: true,
});
