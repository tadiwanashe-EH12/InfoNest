const AppError = require('../utils/appError');
const logger = require('../utils/logger');

// Handle specific mongoose errors
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => 
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () => 
  new AppError('Your token has expired! Please log in again.', 401);

// Development error handler
const sendErrorDev = (err, req, res) => {
  // API error response
  if (req.originalUrl.startsWith('/api')) {
    logger.error(`💥 ${err.stack}`);
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }

  // Rendered website error response
  logger.error(`💥 ${err.stack}`);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message
  });
};

// Production error handler
const sendErrorProd = (err, req, res) => {
  // API error response
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      logger.error(`💥 ${err.message}`);
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }

    // Programming or other unknown error: don't leak error details
    logger.error(`💥 ${err.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }

  // Rendered website error response
  if (err.isOperational) {
    logger.error(`💥 ${err.message}`);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message
    });
  }

  // Programming or other unknown error: don't leak error details
  logger.error(`💥 ${err.message}`);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.'
  });
};

// Global error handling middleware
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    // Handle specific mongoose errors
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};