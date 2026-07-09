// backend/errors/AppError.js

export class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.name        = this.constructor.name;
    this.statusCode  = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} not found`, 404);
  }
}

export class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

// ✅ NEW
export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

// ✅ NEW
export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

export class ConflictError extends AppError {
  constructor(resource) {
    super(`${resource} already exists`, 409);
  }
}

export class DatabaseError extends AppError {
  constructor(message) {
    super(message, 500, false); // non-operational
  }
}