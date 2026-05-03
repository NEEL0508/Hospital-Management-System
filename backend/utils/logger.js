/**
 * Simple logger utility for consistent server-side logging.
 * Uses timestamps and log levels: INFO, WARN, ERROR, DEBUG.
 */

const colors = {
  reset: '\x1b[0m',
  info: '\x1b[36m',   // Cyan
  warn: '\x1b[33m',   // Yellow
  error: '\x1b[31m',  // Red
  debug: '\x1b[35m',  // Magenta
  success: '\x1b[32m', // Green
};

const timestamp = () => new Date().toISOString();

const logger = {
  info: (msg, ...args) => {
    console.log(`${colors.info}[INFO]${colors.reset} ${timestamp()} - ${msg}`, ...args);
  },
  warn: (msg, ...args) => {
    console.warn(`${colors.warn}[WARN]${colors.reset} ${timestamp()} - ${msg}`, ...args);
  },
  error: (msg, ...args) => {
    console.error(`${colors.error}[ERROR]${colors.reset} ${timestamp()} - ${msg}`, ...args);
  },
  debug: (msg, ...args) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`${colors.debug}[DEBUG]${colors.reset} ${timestamp()} - ${msg}`, ...args);
    }
  },
  success: (msg, ...args) => {
    console.log(`${colors.success}[SUCCESS]${colors.reset} ${timestamp()} - ${msg}`, ...args);
  },
};

module.exports = logger;
