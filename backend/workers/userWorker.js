import amqplib from "amqplib";
import sendEmail from "../utils/sendEmail.js";

const QUEUE = "user_registration_queue";

let connection;
let channel;

/**
 * Connect to RabbitMQ with retry logic
 */
const connectRabbitMQ = async (retries = 5, delay = 5000) => {
  try {
    connection = await amqplib.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE, { durable: true });

    console.log(`👷 Worker connected to RabbitMQ queue: ${QUEUE}`);

    // Handle unexpected close
    connection.on("close", () => {
      console.warn("⚠️ RabbitMQ connection closed, retrying...");
      reconnect(retries, delay);
    });

    connection.on("error", (err) => {
      console.error("❌ RabbitMQ connection error:", err.message);
    });

    startConsuming();
  } catch (err) {
    console.error("❌ Worker failed to connect:", err.message);
    reconnect(retries, delay);
  }
};

/**
 * Retry logic
 */
const reconnect = (retries, delay) => {
  if (retries <= 0) {
    console.error("🚫 Worker failed to reconnect, exiting...");
    process.exit(1);
  }
  console.log(`🔄 Worker retrying RabbitMQ connection in ${delay / 1000}s...`);
  setTimeout(() => connectRabbitMQ(retries - 1, delay), delay);
};

/**
 * Consume messages from queue
 */
const startConsuming = () => {
  channel.consume(
    QUEUE,
    async (msg) => {
      if (!msg) return;
      const { type, data } = JSON.parse(msg.content.toString());
      console.log("📩 Received message:", type, data);

      try {
        if (type === "USER_REGISTERED") {
          await sendEmail(
            data.email,
            "Welcome to LavaniStore!",
            `Hello ${data.firstName},\n\nYour account ${data.userName} has been successfully created.\n\nRegards,\nLavaniStore Team`
          );
        }
      } catch (err) {
        console.error("❌ Error processing message:", err.message);
      }

      channel.ack(msg);
    },
    { noAck: false }
  );
};

/**
 * Graceful shutdown
 */
const closeWorker = async () => {
  try {
    if (channel) await channel.close();
    if (connection) await connection.close();
    console.log("✅ Worker RabbitMQ connection closed");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error closing worker:", err.message);
    process.exit(1);
  }
};

// Listen for shutdown signals
process.on("SIGINT", closeWorker);
process.on("SIGTERM", closeWorker);

// Start the worker
connectRabbitMQ();
