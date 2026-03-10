import redisClient from "../redis/redisClient.js";

export const redisMiddleware = async (req, res, next) => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    req.redis = redisClient;
    next();
  } catch (error) {
    console.error('Redis connection failed:', error);
    res.status(503).json({ message: 'Redis unavailable' });
  }
};