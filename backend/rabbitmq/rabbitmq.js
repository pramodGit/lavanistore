import amqplib from "amqplib";

let channel;
let connection;

/**
 * Connect to RabbitMQ with retry logic
 */
export const initRabbitMQ = async (retries = 5, delay = 5000) => {
  try {
    connection = await amqplib.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log("🐇 RabbitMQ connected");

    connection.on("error", (err) => {
      console.error("❌ RabbitMQ connection error:", err.message);
    });

    connection.on("close", () => {
      console.warn("⚠️ RabbitMQ connection closed, retrying...");
      reconnect(retries, delay);
    });
  } catch (err) {
    console.error("❌ RabbitMQ init error:", err.message);
    reconnect(retries, delay);
  }
};

/**
 * Reconnect helper
 */
const reconnect = async (retries, delay) => {
  if (retries <= 0) {
    console.error("🚫 RabbitMQ failed to reconnect, exiting...");
    process.exit(1);
  }
  console.log(`🔄 Attempting RabbitMQ reconnect in ${delay / 1000}s...`);
  setTimeout(async () => {
    await initRabbitMQ(retries - 1, delay);
  }, delay);
};

/**
 * Publish to queue safely
 */
export const publishToQueue = async (queueName, data) => {
  if (!channel) {
    console.error("🚫 RabbitMQ channel not initialized!");
    return;
  }

  try {
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), {
      persistent: true,
    });
  } catch (err) {
    console.error("❌ Failed to publish message:", err.message);
  }
};

/**
 * Gracefully close RabbitMQ
 */
export const closeRabbitMQ = async () => {
  try {
    if (channel) {
      await channel.close();
      console.log("✅ RabbitMQ channel closed");
    }
    if (connection) {
      await connection.close();
      console.log("✅ RabbitMQ connection closed");
    }
  } catch (err) {
    console.error("❌ Error closing RabbitMQ:", err.message);
  }
};
