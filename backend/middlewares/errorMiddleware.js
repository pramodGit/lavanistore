import { EventEmitter } from "node:events";
import { AppError } from "../errors/AppError.js";

export default function errorHandler(err, req, res, next) {

  // -----------------------------
  // Internal Logging
  // -----------------------------
  console.error("========== ERROR ==========");
  console.error("Time    :", new Date().toISOString());
  console.error("Route   :", req.method, req.originalUrl);
  console.error("Message :", err.message);
  console.error("Name    :", err.name);

  if (err.sqlMessage) {
    console.error("SQL Msg :", err.sqlMessage);
    console.error("SQL     :", err.sql);
    console.error("Code    :", err.code);
  }

  console.error("Stack   :", err.stack);
  console.error("===========================");

  // -----------------------------
  // Gemini / AI Rate Limit
  // -----------------------------
  if (
    err.status === 429 ||
    err.message?.includes("RESOURCE_EXHAUSTED") ||
    err.message?.includes("Quota exceeded")
  ) {
    // return res.status(429).json({
    //   status: "error",
    //   message: "AI request limit reached. Please try again in a minute.",
    // });
  }

  // -----------------------------
  // Known Application Errors
  // -----------------------------
  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  // -----------------------------
  // Unknown Errors
  // -----------------------------
  return res.status(500).json({
    status: "error",
    message: "Something went wrong. Please try again.",
  });
}

// -----------------------------
// EventEmitter Safety
// -----------------------------
const myEmitter = new EventEmitter();

myEmitter.on("error", (err) => {
  console.error("Handled emitter error:", err);
});

// -----------------------------
// Process Safety
// -----------------------------
process.on("uncaughtException", (error) => {
  console.error(`uncaughtException on pid ${process.pid}:`, error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise);
  console.error("Reason:", reason);
  process.exit(1);
});