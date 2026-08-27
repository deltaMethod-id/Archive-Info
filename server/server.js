/**
 * @type {Record<string, string>}
 */
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

const http = require('http');
const fs = require('fs');
const path = require('path');
const { applyProductionSecurity } = require('./nmiddleware');

const PORT = process.env.PORT || 3000;
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

const pageRoutes = {
  '/': 'index.html',
  '/index': 'index.html',
  '/list': 'list.html',
  '/dashboard': 'dashboard.html',
  '/403': '403.html',
  '/404': '404.html'
};

/**
 * @param {string} basePath
 * @param {string} requestedPath
 * @returns {string}
 */
function resolvePublicPath(requestedPath) {
  const url = new URL(requestedPath, 'http://localhost');
  const routeFile = pageRoutes[url.pathname];
  const relativePath = routeFile ? path.join('pages', routeFile) : url.pathname.replace(/^\/+/, '');
  const filePath = path.resolve(publicDir, relativePath);
  const relativeToPublic = path.relative(publicDir, filePath);

  if (relativeToPublic.startsWith('..') || path.isAbsolute(relativeToPublic)) {
    return null;
  }

  return filePath;
}

/**
 * @param {import('http').ServerResponse} res
 * @param {string} filePath
 */
function serveFile(res, filePath) {
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        serveErrorPage(res, 404);
        return;
      }

      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Server error');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const type = mimeTypes[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=86400',
      'Content-Type': type
    });
    res.end(res.req.method === 'HEAD' ? undefined : content);
  });
}

/**
 * @param {import('http').ServerResponse} res
 * @param {number} statusCode
 */
function serveErrorPage(res, statusCode) {
  const errorPath = path.join(publicDir, 'pages', `${statusCode}.html`);
  fs.readFile(errorPath, (error, content) => {
    if (error) {
      res.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(statusCode === 404 ? 'Not Found' : 'Forbidden');
      return;
    }

    res.writeHead(statusCode, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(content);
  });
}

const server = http.createServer((req, res) => {
  applyProductionSecurity(req, res, () => {
    if (!['GET', 'HEAD'].includes(req.method || '')) {
      res.writeHead(405, { Allow: 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Method Not Allowed');
      return;
    }

    const safePath = resolvePublicPath(req.url || '/');

    if (!safePath) {
      serveErrorPage(res, 403);
      return;
    }

    serveFile(res, safePath);
  });
});

server.listen(PORT, () => {
  console.log(`Archive Info is running at http://localhost:${PORT}`);
});
