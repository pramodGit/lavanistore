// backend/middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError.js";

// ── Typed auth errors ──────────────────────
// Add these to your existing AppError.js file

// export class UnauthorizedError extends AppError {
//   constructor(message = "Access denied") {
//     super(message, 401);
//   }
// }

// export class ForbiddenError extends AppError {
//   constructor(message = "Invalid token") {
//     super(message, 403);
//   }
// }
// ───────────────────────────────────────────

import { UnauthorizedError, ForbiddenError } from "../errors/AppError.js";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ✅ throw typed error — not res.status()
    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedError("Access denied. No token provided.");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Same shape as before — no change here
    req.user = {
      ...decoded,
      id       : decoded.id,
      username : decoded.userName,
    };

    next(); // ✅ success — continue to route

  } catch (err) {

    // ✅ JWT specific errors — throw typed errors
    if (err.name === "TokenExpiredError") {
      return next(new UnauthorizedError("Token expired. Please login again."));
    }

    if (err.name === "JsonWebTokenError") {
      return next(new ForbiddenError("Invalid token."));
    }

    if (err.name === "NotBeforeError") {
      return next(new ForbiddenError("Token not yet active."));
    }

    // ✅ Already a typed AppError (our own throw above)
    // pass it straight to errorHandler
    if (err instanceof AppError) {
      return next(err);
    }

    // ✅ Truly unexpected — wrap it
    return next(new AppError("Authentication failed.", 401));
  }
};