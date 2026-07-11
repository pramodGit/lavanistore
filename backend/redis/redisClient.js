// backend/redis/redisClient.js

import { createClient } from "redis";

let redisClient;

if (process.env.NODE_ENV !== "test") {
  redisClient = createClient({
    socket: {
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: process.env.REDIS_PORT || 6379,
      reconnectStrategy: (retries) => {
        console.log(`🔁 Redis retrying connection: attempt ${retries}`);
        return Math.min(retries * 10000, 30000);
      },
    },
  });

  (async () => {
    try {
      await redisClient.connect();
    } catch (err) {
      console.error("❌ Failed to connect to Redis:", err);
    }
  })();
} else {
  // Mock redis client for Jest
  redisClient = {
    connect: async () => {},
    get: async () => null,
    set: async () => "OK",
    del: async () => 1,
    quit: async () => {},
    exists: async () => 0,
    rPush: async () => 1,
    lRange: async () => [],
    lPop: async () => null,
    expire: async () => 1,
    keys: async () => [],
  };
}

export default redisClient;
