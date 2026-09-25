#!/usr/bin/env node
/* Genera datos/resumen-gestion-2032.pdf desde tools/informe-2032.html (usa Playwright, ya instalado para las pruebas). */
const { chromium } = require('@playwright/test');
const path = require('path');
(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('file://' + path.join(__dirname, 'informe-2032.html'));
    await page.pdf({ path: path.join(__dirname, '..', 'datos', 'resumen-gestion-2032.pdf'), format: 'A4', printBackground: true });
    await browser.close();
    console.log('datos/resumen-gestion-2032.pdf');
})();
