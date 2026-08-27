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

const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

/**
 * @param {string} urlPath
 * @returns {string}
 */
function resolvePublicPath(urlPath) {
  const cleanPath = urlPath.split('?')[0].replace(/^\/+/, '');
  if (!cleanPath || cleanPath === 'index') return path.join(publicDir, 'pages', 'index.html');
  if (cleanPath === 'list') return path.join(publicDir, 'pages', 'list.html');
  if (cleanPath === 'dashboard') return path.join(publicDir, 'pages', 'dashboard.html');
  if (cleanPath === '403') return path.join(publicDir, 'pages', '403.html');
  if (cleanPath === '404') return path.join(publicDir, 'pages', '404.html');

  const relativePath = cleanPath.startsWith('public/') ? cleanPath : `public/${cleanPath}`;
  return path.join(rootDir, relativePath);
}

/**
 * @param {import('http').ServerResponse} res
 * @param {string} filePath
 */
function sendFile(res, filePath) {
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<!DOCTYPE html><html><body><h1>404 - Not Found</h1></body></html>');
        return;
      }

      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Internal Server Error');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    res.end(content);
  });
}

function createServer() {
  return http.createServer((req, res) => {
    const requested = req.url || '/';
    const filePath = resolvePublicPath(requested);

    if (!filePath.startsWith(rootDir)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Forbidden');
      return;
    }

    sendFile(res, filePath);
  });
}

module.exports = { createServer };
