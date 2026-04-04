const { errorResponse } = require('../utils/response.utils');

/**
 * Global error handler middleware
 * Must be registered LAST in Express app
 */
const errorHandler = (err, req, res, next) => {
  console.error('💥 Error:', err);

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return errorResponse(res, `${field} already exists`, 409);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return errorResponse(res, 'Validation error', 422, errors);
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return errorResponse(res, `Invalid ${err.path}: ${err.value}`, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid token', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Token expired', 401);
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return errorResponse(res, message, statusCode);
};

/**
 * 404 handler — must be placed before errorHandler
 */
const notFound = (req, res) => {
  return errorResponse(res, `Route not found: ${req.originalUrl}`, 404);
};

module.exports = { errorHandler, notFound };
