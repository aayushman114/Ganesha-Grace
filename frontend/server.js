/**
 * Permanent Static File Server for Ganesha Grace Frontend
 * Handles query parameters in URLs (e.g., product.html?id=1)
 * Run: node frontend/server.js
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5501;
const FRONTEND_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
};

function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return MIME_TYPES[ext] || 'application/octet-stream';
}

function serveFile(filePath, res) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('404 Not Found');
            return;
        }
        res.writeHead(200, { 'Content-Type': getMimeType(filePath) });
        res.end(data);
    });
}

const server = http.createServer((req, res) => {
    // Strip query string from pathname
    const url = new URL(req.url, `http://localhost:${PORT}`);
    let filePath = url.pathname;

    // Default to index.html for root
    if (filePath === '/') {
        filePath = '/index.html';
    }

    // Security: prevent directory traversal
    const normalizedPath = path.normalize(filePath).replace(/^(\.\.(\/|\\|$))+/, '');
    const fullPath = path.join(FRONTEND_DIR, normalizedPath);

    // Ensure the resolved path is within frontend directory
    if (!fullPath.startsWith(FRONTEND_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('403 Forbidden');
        return;
    }

    serveFile(fullPath, res);
});

server.listen(PORT, () => {
    console.log(`Frontend server running at http://127.0.0.1:${PORT}`);
    console.log(`Serving from: ${FRONTEND_DIR}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Kill existing processes or use a different port.`);
    } else {
        console.error('Server error:', err);
    }
    process.exit(1);
});

process.on('SIGINT', () => {
    console.log('\nShutting down frontend server...');
    server.close(() => process.exit(0));
});