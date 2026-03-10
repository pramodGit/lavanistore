import cluster from "cluster";
import os from "os";
import dotenv from "dotenv";
import { pool } from "./db.js";   // <- MySQL connection
import app from "./app.js";

dotenv.config();

const numCPUs = os.cpus().length;
const port = process.env.PORT || 5000;

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} started`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died, restarting...`);
    cluster.fork();
  });
} else {
  // Test MySQL connection before starting server
  (async () => {
    try {
      const conn = await pool.getConnection();
      await conn.ping();
      conn.release();
      console.log("✅ MySQL DB Connected");

      app.listen(port, "0.0.0.0", () =>
        console.log(
          `🚀 Worker ${process.pid} listening at http://localhost:${port}`
        )
      );
    } catch (err) {
      console.error("❌ DB ERROR =>", err);
      process.exit(1); // Kill worker if DB fails
    }
  })();
}
