// Flujos críticos del servicio
const { test, expect } = require('@playwright/test');
const { redLocal, vigilar } = require('./ayudas');

test.beforeEach(async ({ context, page }) => {
    await redLocal(context);
    page.__errores = vigilar(page);
});
test.afterEach(async ({ page }) => {
    expect(page.__errores).toEqual([]);
});

async function responder(page, respuestas) {
    for (const [nombre, valor] of Object.entries(respuestas)) {
        await page.check(`input[name="${nombre}"][value="${valor}"]`);
    }
}

test.describe('Test de elegibilidad', () => {
    test('se completa, da resultado y se reinicia', async ({ page }) => {
        await page.goto('elegibilidad.html');
        await expect(page.locator('#checkHint')).toBeVisible();
        await responder(page, { edad: '70-79', residencia: 'caba', vivienda: 'propia', autonomia: 'parcial', cuidadoActual: 'familiar', movilidad: 'si' });
        await expect(page.locator('#progressText')).toContainText('6 de 6');
        await page.click('#checkBtn');
        await expect(page.locator('#resultBox h2')).toHaveText(/cumplís los requisitos/);
        await expect(page.locator('#resultBox h2')).toBeFocused();
        await expect(page.locator('#resultBox')).toContainText('Nivel 1');
        await page.click('#resetBtn');
        await expect(page.locator('#progressText')).toContainText('0 de 6');
        await expect(page.locator('#checkBtn')).toBeDisabled();
    });

    test('geriátrico lleva a la vía de retorno a casa', async ({ page }) => {
        await page.goto('elegibilidad.html');
        await responder(page, { edad: '80mas', residencia: 'caba', vivienda: 'geriatrico', autonomia: 'minima', cuidadoActual: 'institucional', movilidad: 'ayuda' });
        await page.click('#checkBtn');
        await expect(page.locator('#resultBox h2')).toHaveText(/vía de retorno/);
        await expect(page.locator('#resultBox')).toContainText('Nivel 3');
    });

    test('dependencia total es Nivel 3 con aclaración de horas', async ({ page }) => {
        await page.goto('elegibilidad.html');
        await responder(page, { edad: '70-79', residencia: 'caba', vivienda: 'propia', autonomia: 'dependiente', cuidadoActual: 'no', movilidad: 'no' });
        await page.click('#checkBtn');
        await expect(page.locator('#resultBox')).toContainText('Nivel 3');
        await expect(page.locator('#resultBox')).toContainText('24 horas');
        await expect(page.locator('#resultBox')).toContainText('prioridad');
    });

    test('solo edad y domicilio impiden el acceso', async ({ page }) => {
        await page.goto('elegibilidad.html');
        await responder(page, { edad: 'menos60', residencia: 'gba', vivienda: 'propia', autonomia: 'total', cuidadoActual: 'no', movilidad: 'si' });
        await page.click('#checkBtn');
        await expect(page.locator('#resultBox h2')).toHaveText(/no cumplís/);
        await expect(page.locator('#resultBox')).toContainText('55 y 59');
    });
});

test.describe('Inscripción y estado de trámite', () => {
    test('valida, emite número de trámite y se puede consultar', async ({ page }) => {
        await page.goto('inscripcion.html');
        await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
        await page.reload();
        await expect(page.locator('[aria-invalid="true"]')).toHaveCount(0);

        await page.click('#inscriptionForm button[type=submit]');
        await expect(page.locator('#nombreCompleto')).toBeFocused();
        await expect(page.locator('#error-nombreCompleto')).toHaveText(/Completá este dato/);
        await expect(page.locator('#error-privacidad')).toContainText('política de privacidad');

        await page.fill('#nombreCompleto', 'Rosa Ferreyra');
        await page.fill('#dni', '23456789');
        await page.fill('#fechaNacimiento', '1950-04-02');
        await page.fill('#calle', 'Av. Directorio');
        await page.fill('#numero', '4321');
        await page.selectOption('#barrio', { index: 1 });
        await page.fill('#codigoPostal', 'C1407ABC');
        await page.fill('#telefono', '351 456-7890');
        await page.fill('#email', 'rosa@example.com');
        await page.selectOption('#relacionPersona', { index: 1 });
        await page.fill('#situacion', 'Vive sola, diabetes.');
        for (const grupo of ['genero', 'viveSolo', 'obraSocial']) await page.check(`input[name="${grupo}"] >> nth=0`);

        // El borrador vive solo en la pestaña y no guarda datos de salud
        const borrador = await page.evaluate(() => sessionStorage.getItem('cuidar-borrador'));
        expect(borrador).toContain('23456789');
        expect(borrador).not.toContain('diabetes');
        expect(await page.evaluate(() => localStorage.length)).toBe(0);

        await page.check('#privacidad');
        await page.click('#inscriptionForm button[type=submit]');
        await expect(page.locator('#tramiteNumero')).toHaveText(/^CR-2032-\d{7}$/, { timeout: 5000 });
        await expect(page.locator('#successTitle')).toBeFocused();
        const numero = await page.textContent('#tramiteNumero');

        await page.goto('estado-tramite.html');
        await page.fill('#tramite', numero.toLowerCase());
        await page.click('.btn-search');
        await expect(page.locator('#newRecordTitle')).toHaveText('Rosa Ferreyra', { timeout: 5000 });
        await expect(page.locator('#newRecordTitle')).toBeFocused();
    });

    test('estado de trámite: vacío, desconocido y legajo de ejemplo', async ({ page }) => {
        await page.goto('estado-tramite.html');
        await page.click('.btn-search');
        await expect(page.locator('#error-dni')).toHaveText(/Escribí tu DNI o tu número de trámite/);
        await expect(page.locator('#dni')).toBeFocused();

        await page.fill('#dni', '99999999');
        await page.click('.btn-search');
        await expect(page.locator('#notFoundTitle')).toBeFocused({ timeout: 5000 });
        await expect(page.locator('#resultContainer')).toBeHidden();

        await page.fill('#dni', '12345678');
        await page.click('.btn-search');
        await expect(page.locator('#userName')).toBeFocused({ timeout: 5000 });
        await expect(page.locator('#resultContainer')).not.toContainText('2025');
        await expect(page.locator('#resultContainer [data-mundo-fecha]').first()).toHaveText(/\/20(31|32)$/);
    });
});

test('contacto: errores, número de consulta y nueva consulta', async ({ page }) => {
    await page.goto('contacto.html');
    await page.click('.btn-submit');
    await expect(page.locator('.form-error')).toHaveCount(5);
    await page.fill('#nombre', 'Rosa');
    await page.fill('#email', 'rosa@');
    await page.fill('#telefono', '11 4567-8901');
    await page.selectOption('#motivo', { index: 1 });
    await page.fill('#mensaje', 'Consulta por la evaluación.');
    await page.click('.btn-submit');
    await expect(page.locator('#error-email')).toContainText('nombre@dominio.com');
    await page.fill('#email', 'rosa@example.com');
    await page.click('.btn-submit');
    await expect(page.locator('#consultaNumero')).toHaveText(/^C-2032-\d{7}$/, { timeout: 5000 });
    await expect(page.locator('#contactSuccessTitle')).toBeFocused();
    await expect(page.locator('.form-container')).toBeHidden();
    await page.click('#resetContactBtn');
    await expect(page.locator('#nombre')).toBeFocused();
});

test.describe('Nodos', () => {
    test('mapa, filtro sincronizado y cobertura', async ({ page }) => {
        await page.goto('nodos.html');
        await expect(page.locator('.leaflet-marker-icon')).toHaveCount(16);
        expect(await page.$eval('.leaflet-pane', (e) => getComputedStyle(e).position)).toBe('absolute');
        await expect(page.locator('.cobertura-completa')).toHaveCount(9);
        await expect(page.locator('.cobertura-parcial')).toHaveCount(7);

        await page.selectOption('#comunaFilter', '2');
        await expect(page.locator('.nodo-card:visible')).toHaveCount(2);
        await expect(page.locator('.leaflet-marker-icon')).toHaveCount(2);
        await expect(page.locator('#nodosCount')).toHaveText('Mostrando 2 Nodos de la Comuna 2');
    });

    test('cada botón Llamar marca el número visible de su Nodo', async ({ page }) => {
        await page.goto('nodos.html');
        const cruzados = await page.$$eval('.nodo-card', (cards) => cards.filter((c) => {
            const visible = c.textContent.match(/4555-(\d+)/)[1];
            return [...c.querySelectorAll('a[href^="tel:"]')].some((a) => !a.href.endsWith(visible));
        }).map((c) => c.querySelector('h3').textContent));
        expect(cruzados).toEqual([]);
    });
});

test('menú móvil abre y Escape lo cierra', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('index.html');
    await page.click('.nav-toggle');
    await expect(page.locator('#nav-links')).toHaveClass(/open/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#nav-links')).not.toHaveClass(/open/);
    await expect(page.locator('.nav-toggle')).toBeFocused();
});
