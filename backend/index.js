import cluster from "cluster";
import os from "os";
import dotenv from "dotenv";
import app from "./app.js";
import { validatePools } from "./db.js";

dotenv.config();

const numCPUs = os.cpus().length;
const PORT = process.env.PORT || 5000;

if (cluster.isPrimary) {

  console.log(`Master ${process.pid} started — forking ${numCPUs} workers`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died (${signal || code}), restarting...`);
    cluster.fork();
  });

} else {

  validatePools()
    .then(() => {
      if (cluster.worker.id === 1) {
        console.log("✅ MySQL Pools Connected");
        console.log(`   User pool:    ${process.env.MYSQL_DB_USER}`);
        console.log(`   Product pool: ${process.env.MYSQL_DB_PRODUCTS}`);
      }
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`🚀 Worker ${process.pid} listening at http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error(`❌ Worker ${process.pid} DB pool failed:`, err.message);
      process.exit(1); // cluster auto-restarts this worker
    });

}