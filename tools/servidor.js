#!/usr/bin/env node
/* Servidor estático mínimo para las pruebas (sin dependencias). Uso: node tools/servidor.js [puerto]
   Imita a GitHub Pages: el sitio también responde bajo /cuidar/ y las rutas inexistentes devuelven 404.html. */
const http = require('http');
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const PUERTO = Number(process.argv[2] || process.env.PUERTO || 8765);
const TIPOS = {
    '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
    '.svg': 'image/svg+xml', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8'
};

http.createServer((req, res) => {
    let ruta = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (ruta === '/cuidar' || ruta.startsWith('/cuidar/')) ruta = ruta.slice('/cuidar'.length) || '/';
    if (ruta.endsWith('/')) ruta += 'index.html';
    const archivo = path.normalize(path.join(RAIZ, ruta));
    if (!archivo.startsWith(RAIZ) || !fs.existsSync(archivo) || fs.statSync(archivo).isDirectory()) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        return fs.createReadStream(path.join(RAIZ, '404.html')).pipe(res);
    }
    res.writeHead(200, { 'Content-Type': TIPOS[path.extname(archivo)] || 'application/octet-stream' });
    fs.createReadStream(archivo).pipe(res);
}).listen(PUERTO, () => console.log('Sirviendo en http://localhost:' + PUERTO));
