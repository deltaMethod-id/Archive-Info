/**
 * @param {string} value
 * @returns {string}
 */
function sanitizeInput(value) {
  if (typeof value !== 'string') return '';

  return value
    .replace(/<script|<iframe|javascript:|onerror=/gi, '')
    .replace(/[\r\n]+/g, ' ')
    .trim()
    .slice(0, 200);
}

/**
 * @param {import('http').IncomingMessage & { query?: Record<string, string> }} req
 * @param {import('http').ServerResponse} res
 * @param {() => void} next
 */
function validateRequest(req, res, next) {
  const url = req.url || '/';

  if (url.includes('..')) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden path traversal attempt');
    return;
  }

  const userAgent = req.headers['user-agent'] || '';
  if (userAgent.length > 200) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Invalid request header');
    return;
  }

  req.query = req.query || {};
  next();
}

module.exports = { sanitizeInput, validateRequest };
