// Cada página: sin errores, sin violaciones de CSP, WCAG 2.2 AA y contraste 7:1, sin scroll horizontal
const { test, expect } = require('@playwright/test');
const { PAGINAS, redLocal, vigilar, axe, contrasteSobreDegradados } = require('./ayudas');

for (const pagina of PAGINAS) {
    test.describe(pagina, () => {
        test('carga sin errores de JavaScript ni de CSP', async ({ page, context }) => {
            await redLocal(context);
            const errores = vigilar(page);
            await page.goto(pagina + '.html', { waitUntil: 'load' });
            await page.waitForTimeout(500);
            expect(errores).toEqual([]);
        });

        test('cumple WCAG 2.2 AA y contraste AAA', async ({ browser }, info) => {
            // axe se inyecta como script en línea: solo acá se omite la CSP
            const context = await browser.newContext({ ...info.project.use, bypassCSP: true });
            await redLocal(context);
            const page = await context.newPage();
            await page.goto(pagina + '.html', { waitUntil: 'load' });
            await page.waitForTimeout(300);
            expect(await axe(page, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } })).toEqual([]);
            expect(await axe(page, { runOnly: { type: 'rule', values: ['color-contrast-enhanced'] } })).toEqual([]);
            await context.close();
        });

        test('el texto sobre degradados llega a 7:1 (axe no lo mide)', async ({ page, context }) => {
            await redLocal(context);
            await page.goto(pagina + '.html');
            expect(await contrasteSobreDegradados(page)).toEqual([]);
        });

        test('no tiene scroll horizontal, tampoco con texto A++', async ({ page, context }) => {
            await redLocal(context);
            for (const ancho of [320, 390, 1440]) {
                await page.setViewportSize({ width: ancho, height: 900 });
                await page.goto(pagina + '.html');
                await page.evaluate(() => localStorage.clear());
                for (const tamano of ['normal', 'xlarge']) {
                    await page.click(`[data-a11y="${tamano}"]`);
                    const sobra = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
                    expect(sobra, `${ancho}px, texto ${tamano}`).toBeLessThanOrEqual(0);
                }
            }
        });

        test('barra de accesibilidad: contraste y tamaño funcionan y persisten', async ({ page, context }) => {
            await redLocal(context);
            await page.goto(pagina + '.html');
            await page.evaluate(() => localStorage.clear());
            await page.reload();
            const h1 = async () => parseFloat(await page.$eval('h1', (e) => getComputedStyle(e).fontSize));
            const antes = await h1();
            await page.click('[data-a11y="contrast"]');
            await page.click('[data-a11y="xlarge"]');
            expect(await h1()).toBeGreaterThanOrEqual(antes * 1.2);
            await expect(page.locator('body')).toHaveClass(/high-contrast/);
            await expect(page.locator('[data-a11y="contrast"]')).toHaveAttribute('aria-pressed', 'true');
            await page.reload();
            await expect(page.locator('html')).toHaveClass(/text-size-xlarge/);
            await expect(page.locator('body')).toHaveClass(/high-contrast/);
            await page.evaluate(() => localStorage.clear());
        });

        test('muestra la fecha del mundo en 2032', async ({ page, context }) => {
            await redLocal(context);
            await page.goto(pagina + '.html');
            await expect(page.locator('.footer-updated')).toContainText(/\d{2}\/\d{2}\/2032, \d{2}:00 h/);
        });
    });
}
