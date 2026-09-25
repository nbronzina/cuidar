#!/usr/bin/env node
/* Regresión visual local: compara dos versiones del sitio página por página.
   Uso: node tools/regresion-visual.js <url-antes> <url-después> [carpeta-salida]
   Ejemplo: levantar el commit anterior en otro puerto (git worktree) y comparar con el actual.
   No corre en CI: las fuentes de reserva cambian entre sistemas y darían falsas diferencias. */
const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const [ANTES, DESPUES, SALIDA = 'test-results/regresion-visual'] = process.argv.slice(2);
const PAGINAS = fs.readdirSync(path.join(__dirname, '..')).filter((f) => f.endsWith('.html')).sort();
const VIEWPORTS = { escritorio: [1440, 900], tableta: [768, 1024], movil: [390, 844] };
const NM = path.join(__dirname, '..', 'node_modules');

async function capturar(browser, base, pagina, [w, h]) {
    const context = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce' });
    await context.route(/font-awesome\/4\.7\.0\/(.*)/, (r, q) => r.fulfill({ path: path.join(NM, 'font-awesome', q.url().split('/4.7.0/')[1].split(/[?#]/)[0]) }));
    await context.route(/unpkg\.com\/leaflet@1\.9\.4\/(.*)/, (r, q) => r.fulfill({ path: path.join(NM, 'leaflet', q.url().split('@1.9.4/')[1].split(/[?#]/)[0]) }));
    await context.route(/fonts\.(googleapis|gstatic)|tile\.openstreetmap/, (r) => r.fulfill({ status: 200, body: '' }));
    const page = await context.newPage();
    await page.goto(base + pagina, { waitUntil: 'load' });
    await page.waitForTimeout(600);
    const png = await page.screenshot({ fullPage: true });
    await context.close();
    return png;
}

(async () => {
    if (!ANTES || !DESPUES) { console.error('Uso: node tools/regresion-visual.js <url-antes> <url-después>'); process.exit(2); }
    fs.mkdirSync(SALIDA, { recursive: true });
    const browser = await chromium.launch();
    const comparador = await (await browser.newContext()).newPage();
    let distintas = 0;
    for (const pagina of PAGINAS) {
        for (const [nombre, vp] of Object.entries(VIEWPORTS)) {
            const a = await capturar(browser, ANTES, pagina, vp);
            const d = await capturar(browser, DESPUES, pagina, vp);
            const r = await comparador.evaluate(async ([a64, d64]) => {
                const cargar = (b) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = 'data:image/png;base64,' + b; });
                const [ia, id] = await Promise.all([cargar(a64), cargar(d64)]);
                const w = Math.max(ia.width, id.width), h = Math.max(ia.height, id.height);
                const lienzo = (img) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.fillStyle = '#f0f'; x.fillRect(0, 0, w, h); x.drawImage(img, 0, 0); return x.getImageData(0, 0, w, h).data; };
                const pa = lienzo(ia), pd = lienzo(id);
                const dif = document.createElement('canvas'); dif.width = w; dif.height = h; const dx = dif.getContext('2d'); const out = dx.createImageData(w, h);
                let n = 0;
                for (let i = 0; i < pa.length; i += 4) {
                    const cambia = Math.abs(pa[i] - pd[i]) + Math.abs(pa[i + 1] - pd[i + 1]) + Math.abs(pa[i + 2] - pd[i + 2]) > 30;
                    if (cambia) n++;
                    out.data[i] = cambia ? 255 : pd[i] * 0.3 + 178; out.data[i + 1] = cambia ? 0 : pd[i + 1] * 0.3 + 178; out.data[i + 2] = cambia ? 0 : pd[i + 2] * 0.3 + 178; out.data[i + 3] = 255;
                }
                dx.putImageData(out, 0, 0);
                return { n, total: w * h, alto: [ia.height, id.height], dif: n ? dif.toDataURL('image/png').split(',')[1] : null };
            }, [a.toString('base64'), d.toString('base64')]);
            const pct = (100 * r.n / r.total).toFixed(3);
            const estado = r.n === 0 ? 'igual' : `DISTINTA ${pct} % (${r.n} px, alto ${r.alto.join('→')})`;
            if (r.n) {
                distintas++;
                fs.writeFileSync(path.join(SALIDA, `${pagina.replace('.html', '')}-${nombre}-diferencias.png`), Buffer.from(r.dif, 'base64'));
            }
            console.log(`${pagina.padEnd(28)} ${nombre.padEnd(11)} ${estado}`);
        }
    }
    await browser.close();
    console.log(distintas ? `\n${distintas} capturas con diferencias (ver ${SALIDA})` : '\nSin diferencias visuales');
    process.exit(distintas ? 1 : 0);
})();
