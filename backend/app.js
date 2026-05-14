import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import errorHandler from "./middlewares/error.js";
import { apiLimiter, rateLimiter } from "./middlewares/rate-slow.js";
import { redisMiddleware } from "./middlewares/redis.js";
import { initRabbitMQ, closeRabbitMQ } from "./rabbitmq/rabbitmq.js";
import auth_routes from "./routes/authRoutes.js";
import swagger_routes from "./routes/swagger-routes.js";
import routes from "./routes/index.js";

const app = express();

// middleware configs
const corsConfig = {
  origin: true,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsConfig));
app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json({ limit: "50kb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("trust proxy", 1);
if (process.env.USE_REDIS === "true") {
  app.use(redisMiddleware);
}

// Error +   limit
app.use(errorHandler);
app.use(apiLimiter);
app.use(rateLimiter);

// Routes
app.use("/api-doc", swagger_routes);
app.use("/api/auth", auth_routes);
app.use("/api", routes);

// Root
app.get("/", (req, res) => {
  return res.json({ message: "Hello from API_Gateway_Node Server" });
});

// Swagger
const swaggerDocument = YAML.load("swagger/swagger-api.yaml");
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


/**
 * Initialize RabbitMQ
 */
// (async () => {
//   try {
//     await initRabbitMQ();
//     console.log("✅ RabbitMQ initialized from app.js");
//   } catch (err) {
//     console.error("❌ Failed to initialize RabbitMQ:", err);
//   }
// })();

/**
 * Graceful shutdown handlers
 */
// process.on("SIGINT", async () => {
//   console.log("\n🛑 SIGINT received — closing RabbitMQ...");
//   await closeRabbitMQ();
//   process.exit(0);
// });

// process.on("SIGTERM", async () => {
//   console.log("\n🛑 SIGTERM received — closing RabbitMQ...");
//   await closeRabbitMQ();
//   process.exit(0);
// });

export default app;
