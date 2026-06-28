import mysql from 'mysql2/promise'; // mysql driver 
import { env } from './env.js'; // import environment variables

// create a connection pool to the MySQL database using the environment variables
export const pool = mysql.createPool({
  host: env.dbHost,
  port: env.dbPort,
  user: env.dbUser,
  password: env.dbPass,
  database: env.dbName,
  waitForConnections: true,
  connectionLimit: 10,
  // Return DATETIME columns (tasks.due_date) as plain "YYYY-MM-DD HH:mm:ss"
  // strings instead of JS Date objects. Without this, mysql2 converts the
  // naive value to a Date using the server's local timezone, then JSON
  // serialization re-converts it to UTC — so a due time set on a server in
  // one timezone can render shifted in a browser in another. Keeping it as
  // a plain string preserves exactly the wall-clock time the user picked.
  dateStrings: ['DATETIME'],
});

export const testConnection = async () => {
  const conn = await pool.getConnection();
  await conn.ping();
  conn.release();
};
