// backend/errors/AppError.js

export class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
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

class UnauthorizedError extends AppError {
  constructor() {
    super('Unauthorized', 401);
  }
}

export class DatabaseError extends AppError {
  constructor(message) {
    // isOperational = false → unexpected, needs alert
    super(message, 500, false);
  }
}