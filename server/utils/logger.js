const winston = require('winston');
const fs = require('fs');
const path = require('path');
const { combine, timestamp, printf, colorize, align } = winston.format;

// Ensure log directory exists
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
  console.log(`Created logs directory at: ${logDir}`);
}

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// Log file paths
const errorLogPath = path.join(logDir, 'error.log');
const combinedLogPath = path.join(logDir, 'combined.log');
const exceptionsLogPath = path.join(logDir, 'exceptions.log');
const rejectionsLogPath = path.join(logDir, 'rejections.log');

// Create logger instance
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: combine(
    colorize(),
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    align(),
    winston.format.errors({ stack: true }),
    logFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ 
      filename: errorLogPath,
      level: 'error',
      format: combine(
        timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      )
    }),
    new winston.transports.File({ 
      filename: combinedLogPath,
      format: combine(
        timestamp(),
        winston.format.json()
      )
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({ 
      filename: exceptionsLogPath,
      format: combine(
        timestamp(),
        winston.format.json()
      )
    })
  ],
  rejectionHandlers: [
    new winston.transports.File({ 
      filename: rejectionsLogPath,
      format: combine(
        timestamp(),
        winston.format.json()
      )
    })
  ]
});

// Log rotation configuration (optional)
if (process.env.NODE_ENV === 'production') {
  logger.add(new winston.transports.DailyRotateFile({
    filename: path.join(logDir, 'application-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: combine(
      timestamp(),
      winston.format.json()
    )
  }));
}

// Stream for morgan
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  }
};

// Test log files are writable
logger.info('Logger initialized successfully');
logger.error('This is a test error message to verify logging works');

module.exports = logger;