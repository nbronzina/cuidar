// Pruebas de humo, accesibilidad y flujos críticos — Cuidados en Red
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    testDir: 'tests',
    fullyParallel: true,
    retries: process.env.CI ? 1 : 0,
    reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
    use: {
        baseURL: 'http://localhost:4173/',
        locale: 'es-AR',
        timezoneId: 'America/Argentina/Buenos_Aires'
    },
    projects: [
        { name: 'escritorio', use: { viewport: { width: 1440, height: 900 } } },
        { name: 'tableta', use: { viewport: { width: 768, height: 1024 }, hasTouch: true } },
        { name: 'movil', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } }
    ],
    webServer: {
        command: 'node tools/servidor.js 4173',
        url: 'http://localhost:4173/index.html',
        reuseExistingServer: !process.env.CI
    }
});
