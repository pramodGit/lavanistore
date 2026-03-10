import slowDown from "express-slow-down";
import rateLimit from "express-rate-limit";


// const apiLimiter = slowDown({
//   windowMs: 15 * 60 * 1000,
//   delayAfter: 100,
//   delayMs: () => 500,
// });

// const rateLimiter = rateLimit({
//   windowMs: 24 * 60 * 60 * 1000, // 24 hours
//   max: 1000,
//   message: "Too many requests from this IP, try again later.",
//   standardHeaders: true,
//   legacyHeaders: false,
// });
const apiLimiter = slowDown({
  windowMs: 1 * 60 * 1000, // 1 minute
  delayAfter: 200,
  delayMs: () => 100,
});

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1000,
  message: "Too many requests, slow down.",
  standardHeaders: true,
  legacyHeaders: false,
});

export { apiLimiter, rateLimiter };
