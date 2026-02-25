const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error response
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  // Custom error responses
  if (err.code === '23505') {
    // Unique constraint violation
    statusCode = 409;
    message = 'Email already exists';
  } else if (err.code === '23503') {
    // Foreign key constraint violation
    statusCode = 400;
    message = 'Referenced record does not exist';
  } else if (err.code === '23502') {
    // Not null constraint violation
    statusCode = 400;
    message = 'Required field missing';
  }

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
