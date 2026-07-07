import mysql from "mysql2/promise";
import dotenv from "dotenv";
import os from "os";

dotenv.config();

const numCPUs = os.cpus().length;

// Total connection budget (stay under 80% of MySQL's max_connections)
// Default MySQL max_connections = 151, so budget = ~120
// 2 pools per worker → split equally
const connectionsPerPool = Math.max(2, Math.floor(120 / numCPUs / 2));

// Pool for User database
export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB_USER,
  waitForConnections: true,
  connectionLimit: connectionsPerPool,
  queueLimit: 0,
});

// Pool for Product database
export const productPool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB_PRODUCTS,
  waitForConnections: true,
  connectionLimit: connectionsPerPool,
  queueLimit: 0,
  multipleStatements: true,
});

// Health check — call this before app.listen
export async function validatePools() {
  const [conn1, conn2] = await Promise.all([
    pool.getConnection(),
    productPool.getConnection(),
  ]);
  conn1.release();
  conn2.release();
}