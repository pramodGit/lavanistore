import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Pool for User database
export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB_USER,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Pool for Product database
export const productPool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB_PRODUCTS,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true 
});
