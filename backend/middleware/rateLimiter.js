/**
 * Simple in-memory rate limiter middleware.
 * Limits repeated requests to auth endpoints to prevent brute-force attacks.
 * In development mode the limits are relaxed to avoid blocking during testing.
 */

const requestCounts = new Map();

// Clean up stale entries every 30 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of requestCounts.entries()) {
    if (now - record.startTime > 60 * 60 * 1000) {
      requestCounts.delete(key);
    }
  }
}, 30 * 60 * 1000);

/**
 * @param {number} maxRequests - max allowed requests in the window
 * @param {number} windowMs    - time window in milliseconds
 */
const rateLimiter = (maxRequests = 10, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    // Skip rate limiting in development to avoid blocking during testing
    if (process.env.NODE_ENV === 'development') return next();

    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (!requestCounts.has(key)) {
      requestCounts.set(key, { count: 1, startTime: now });
      return next();
    }

    const record = requestCounts.get(key);

    // Reset window if expired
    if (now - record.startTime > windowMs) {
      requestCounts.set(key, { count: 1, startTime: now });
      return next();
    }

    record.count += 1;

    if (record.count > maxRequests) {
      const retryAfter = Math.ceil((record.startTime + windowMs - now) / 1000);
      res.setHeader('Retry-After', retryAfter);
      return res.status(429).json({
        message: `Too many requests. Please try again in ${retryAfter} seconds.`,
      });
    }

    next();
  };
};

module.exports = rateLimiter;
