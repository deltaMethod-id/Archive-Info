const requests = new Map();

/**
 * @param {number} maxRequests
 * @param {number} windowMs
 */
function rateLimit(maxRequests = 60, windowMs = 60000) {
  return function middleware(req, res, next) {
    const ip = req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const record = requests.get(ip) || { count: 0, resetAt: now + windowMs };

    if (now > record.resetAt) {
      record.count = 0;
      record.resetAt = now + windowMs;
    }

    record.count += 1;
    requests.set(ip, record);

    if (record.count > maxRequests) {
      res.writeHead(429, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Too many requests');
      return;
    }

    next();
  };
}

module.exports = { rateLimit };
