// backend/middlewares/error.js
import { EventEmitter } from 'node:events';
import { AppError } from '../errors/AppError.js';

export default function errorHandler(err, req, res, next) {

  // ── 1. Always log full detail internally ──
  console.error("========== ERROR ==========");
  console.error("Time    :", new Date().toISOString());
  console.error("Route   :", req.method, req.originalUrl);
  console.error("Message :", err.message);
  console.error("Name    :", err.name);

  // Log MySQL specific detail if present
  if (err.sqlMessage) {
    console.error("SQL Msg :", err.sqlMessage);
    console.error("SQL     :", err.sql);
    console.error("Code    :", err.code);
  }
  console.error("Stack   :", err.stack);
  console.error("===========================");

  // ── 2. Known operational error (NotFoundError, ValidationError etc.) ──
  // Safe to show message to client — we wrote this message ourselves
  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  // ── 3. Unknown / unexpected error ──
  // Never leak internals — generic message only
  return res.status(500).json({
    status: "error",
    message: "Something went wrong. Please try again.",
  });
}

// ── EventEmitter error safety (keep as is) ──
const myEmitter = new EventEmitter();
myEmitter.on('error', (err) => {
  console.error('Handled emitter error:', err);
});

// ── Process-level safety (keep, but improve) ──
process.on('uncaughtException', (error) => {
  console.error(`uncaughtException on pid ${process.pid}:`, error);
  // Give pm2 time to log before exit
  // pm2 will auto-restart the process
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
  process.exit(1);
});