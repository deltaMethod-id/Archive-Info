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
 * Resolve URL path to a file inside public/.
 *
 * Supported:
 * /
 * /index
 * /list
 * /dashboard
 * /403
 * /404
 * /public/styles/index.css
 * /public/js/index.js
 * /public/icons/favicon.svg
 *
 * @param {string} requestedPath
 * @returns {string|null}
 */
function resolvePublicPath(requestedPath) {
  const url = new URL(requestedPath, 'http://localhost');
  const pathname = decodeURIComponent(url.pathname);

  const routeFile = pageRoutes[pathname];

  let relativePath;

  if (routeFile) {
    relativePath = path.join('pages', routeFile);
  } else {
    let requestPath = pathname.replace(/^\/+/, '');

    /*
     * The HTML files use /public/... URLs.
     *
     * Example:
     * /public/styles/index.css
     *
     * should resolve to:
     * public/styles/index.css
     *
     * and NOT:
     * public/public/styles/index.css
     */
    if (requestPath.startsWith('public/')) {
      requestPath = requestPath.slice('public/'.length);
    }

    relativePath = requestPath;
  }

  const filePath = path.resolve(publicDir, relativePath);

  /*
   * Security check:
   * Prevent paths such as:
   * /public/../../server/server.js
   */
  const relativeToPublic = path.relative(publicDir, filePath);

  if (
    relativeToPublic.startsWith('..') ||
    path.isAbsolute(relativeToPublic)
  ) {
    return null;
  }

  return filePath;
}

/**
 * Serve a file.
 *
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

      res.writeHead(500, {
        'Content-Type': 'text/plain; charset=utf-8'
      });

      res.end('Server error');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const type = mimeTypes[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Cache-Control':
        ext === '.html'
          ? 'no-cache'
          : 'public, max-age=86400',

      'Content-Type': type
    });

    if (res.req.method === 'HEAD') {
      res.end();
      return;
    }

    res.end(content);
  });
}

/**
 * Serve custom error page.
 *
 * @param {import('http').ServerResponse} res
 * @param {number} statusCode
 */
function serveErrorPage(res, statusCode) {
  const errorPath = path.join(
    publicDir,
    'pages',
    `${statusCode}.html`
  );

  fs.readFile(errorPath, (error, content) => {
    if (error) {
      res.writeHead(statusCode, {
        'Content-Type': 'text/plain; charset=utf-8'
      });

      res.end(
        statusCode === 404
          ? 'Not Found'
          : 'Forbidden'
      );

      return;
    }

    res.writeHead(statusCode, {
      'Content-Type': 'text/html; charset=utf-8'
    });

    res.end(content);
  });
}

/**
 * HTTP server
 */
const server = http.createServer((req, res) => {
  applyProductionSecurity(req, res, () => {
    if (!['GET', 'HEAD'].includes(req.method || '')) {
      res.writeHead(405, {
        Allow: 'GET, HEAD',
        'Content-Type': 'text/plain; charset=utf-8'
      });

      res.end('Method Not Allowed');
      return;
    }

    const safePath = resolvePublicPath(
      req.url || '/'
    );

    if (!safePath) {
      serveErrorPage(res, 403);
      return;
    }

    serveFile(res, safePath);
  });
});

/*
 * Vercel provides process.env.PORT.
 * Local development falls back to 3000.
 */
server.listen(PORT, () => {
  console.log(
    `Archive Info is running at http://localhost:${PORT}`
  );
});