const http = require('http');
const https = require('https');

/**
 * @param {string} targetUrl
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
function proxyRequest(targetUrl, req, res) {
  const url = new URL(targetUrl);
  const lib = url.protocol === 'https:' ? https : http;

  const options = {
    protocol: url.protocol,
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: `${url.pathname}${url.search}`,
    method: req.method,
    headers: {
      ...req.headers,
      host: url.host
    }
  };

  const proxyReq = lib.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', () => {
    res.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Bad Gateway');
  });

  req.pipe(proxyReq);
}

module.exports = { proxyRequest };
