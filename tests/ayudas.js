// Utilidades compartidas por las pruebas
const path = require('path');
const fs = require('fs');

const PAGINAS = ['index', 'el-sistema', 'para-personas-mayores', 'para-cuidadores', 'transparencia', 'contacto',
    'inscripcion', 'nodos', 'elegibilidad', 'estado-tramite', 'politica-privacidad'];

const NM = path.join(__dirname, '..', 'node_modules');
const GRIS = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

/* Las pruebas no dependen de la red: Font Awesome y Leaflet se sirven desde node_modules
   (mismos archivos que el CDN; el hash SRI lo confirma), fuentes y teselas se reemplazan. */
async function redLocal(context) {
    await context.route(/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/4\.7\.0\/(.*)/, (r, q) =>
        r.fulfill({ path: path.join(NM, 'font-awesome', q.url().split('/4.7.0/')[1].split(/[?#]/)[0]), headers: { 'access-control-allow-origin': '*' } }));
    await context.route(/unpkg\.com\/leaflet@1\.9\.4\/(.*)/, (r, q) =>
        r.fulfill({ path: path.join(NM, 'leaflet', q.url().split('@1.9.4/')[1].split(/[?#]/)[0]), headers: { 'access-control-allow-origin': '*' } }));
    await context.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
    await context.route(/tile\.openstreetmap\.org/, (r) => r.fulfill({ status: 200, contentType: 'image/png', body: GRIS }));
}

/* Registra errores de JavaScript y violaciones de CSP de la página */
function vigilar(page) {
    const errores = [];
    page.on('pageerror', (e) => errores.push('JS: ' + e.message));
    page.on('console', (m) => { if (/Content Security Policy/.test(m.text())) errores.push('CSP: ' + m.text()); });
    return errores;
}

const AXE = fs.readFileSync(path.join(NM, 'axe-core', 'axe.min.js'), 'utf8');

async function axe(page, opciones) {
    await page.addScriptTag({ content: AXE });
    return page.evaluate(async (o) => {
        const r = await window.axe.run(document, o);
        return r.violations.map((v) => `${v.id} ×${v.nodes.length}: ${v.nodes[0].target.join(' ')}`);
    }, opciones);
}

module.exports = { PAGINAS, redLocal, vigilar, axe };
