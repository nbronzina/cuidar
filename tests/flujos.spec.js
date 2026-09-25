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
        await page.fill('#dni', '23456789');
        await page.fill('#tramite', numero.toLowerCase());
        await page.click('.btn-search');
        await expect(page.locator('#newRecordTitle')).toHaveText('Rosa Ferreyra', { timeout: 5000 });
        await expect(page.locator('#newRecordTitle')).toBeFocused();
    });

    test('estado de trámite: verifica la identidad antes de mostrar un legajo (A-05)', async ({ page }) => {
        await page.goto('estado-tramite.html');
        const buscar = async (dni, fecha, numero) => {
            await page.fill('#dni', dni);
            await page.fill('#fechaNacimiento', fecha);
            await page.fill('#tramite', numero);
            await page.click('.btn-search');
        };

        await page.click('.btn-search');
        await expect(page.locator('#error-dni')).toHaveText(/Escribí tu DNI/);
        await expect(page.locator('#dni')).toBeFocused();

        await buscar('12345678', '', '');
        await expect(page.locator('#error-fechaNacimiento')).toContainText('fecha de nacimiento');
        await expect(page.locator('#resultContainer')).toBeHidden();

        // DNI del ejemplo con otra fecha: mismo mensaje que un DNI inexistente
        await buscar('12345678', '1960-01-01', '');
        await expect(page.locator('#notFoundTitle')).toBeFocused({ timeout: 5000 });
        await expect(page.locator('#resultContainer')).toBeHidden();
        await expect(page.locator('#intentosAviso')).toHaveText(/Te quedan 2 intentos/);

        await buscar('12345678', '1956-03-14', '');
        await expect(page.locator('#userName')).toBeFocused({ timeout: 5000 });
        await expect(page.locator('#resultContainer')).not.toContainText('2025');
        await expect(page.locator('#resultContainer [data-mundo-fecha]').first()).toHaveText(/\/20(31|32)$/);

        // DNI y número de trámite también verifican
        await page.reload();
        await buscar('12345678', '', 'cr-2032-0041377');
        await expect(page.locator('#userName')).toBeFocused({ timeout: 5000 });
    });

    test('estado de trámite: 3 intentos fallidos bloquean la consulta', async ({ page }) => {
        await page.goto('estado-tramite.html');
        for (let i = 0; i < 3; i++) {
            await page.fill('#dni', '99999999');
            await page.fill('#fechaNacimiento', '1950-01-01');
            await page.click('.btn-search');
            await expect(page.locator('#notFoundTitle')).toBeFocused({ timeout: 5000 });
        }
        await expect(page.locator('#intentosAviso')).toContainText('bloqueada 15 minutos');
        // Con la consulta bloqueada, ni los datos correctos muestran el legajo
        await page.fill('#dni', '12345678');
        await page.fill('#fechaNacimiento', '1956-03-14');
        await page.click('.btn-search');
        await expect(page.locator('#intentosAviso')).toContainText('bloqueada hasta las');
        await expect(page.locator('#resultContainer')).toBeHidden();
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

    test('cada Nodo se llama por el 147 con su propio interno', async ({ page }) => {
        await page.goto('nodos.html');
        const nodos = await page.$$eval('.nodo-card', (cards) => cards.map((c) => ({
            nombre: c.querySelector('h3').textContent,
            numero: c.querySelector('.nodo-number').textContent.trim(),
            interno: (c.textContent.match(/interno (\d+)/) || [])[1],
            tel: [...c.querySelectorAll('a[href^="tel:"]')].map((a) => a.getAttribute('href'))
        })));
        expect(nodos).toHaveLength(16);
        for (const n of nodos) {
            expect(n.interno, n.nombre).toBe(String(1000 + Number(n.numero)));
            expect(n.tel.every((t) => t === 'tel:147'), n.nombre).toBe(true);
        }
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

test.describe('Menú de trámites (A-14)', () => {
    const TRAMITES = ['elegibilidad.html', 'inscripcion.html', 'estado-tramite.html', 'nodos.html'];

    test('las 4 tareas están a un clic desde cualquier página', async ({ page }) => {
        for (const origen of ['index.html', 'transparencia.html', 'politica-privacidad.html']) {
            await page.goto(origen);
            const toggle = page.locator('.nav-toggle');
            if (await toggle.isVisible()) await toggle.click();
            for (const destino of TRAMITES) {
                await expect(page.locator(`.nav-tramites a[href="${destino}"]`)).toBeVisible();
            }
        }
    });

    test('la página de trámite actual queda marcada', async ({ page }) => {
        await page.goto('estado-tramite.html');
        await expect(page.locator('.nav-tramites a[href="estado-tramite.html"]')).toHaveAttribute('aria-current', 'page');
    });
});

test('índice de El Sistema lleva a cada sección sin taparla (A-24)', async ({ page }) => {
    await page.goto('el-sistema.html');
    const indice = page.locator('#tocDetails');
    if (!(await indice.getAttribute('open') !== null)) await page.click('#tocDetails summary');
    await page.click('.toc a[href="#costos-titulo"]');
    await page.waitForTimeout(600);
    const tapado = await page.evaluate(() => {
        const nav = document.querySelector('.main-nav').getBoundingClientRect();
        const h = document.getElementById('costos-titulo').getBoundingClientRect();
        return h.top < nav.bottom || h.top > innerHeight;
    });
    expect(tapado).toBe(false);
});

test.describe('Piezas institucionales (A-25)', () => {
    test('las descargas de Transparencia llevan a archivos que existen', async ({ page, request }) => {
        await page.goto('transparencia.html');
        const enlaces = await page.$$eval('.btn-download[href]', (as) => as.map((a) => a.getAttribute('href')));
        expect(enlaces.length).toBeGreaterThanOrEqual(4);
        for (const href of enlaces) {
            expect(href, 'sin enlaces a #').not.toBe('#');
            const r = await request.get(href);
            expect(r.status(), href).toBe(200);
        }
    });

    test('no quedan enlaces a # ni a redes sociales', async ({ page }) => {
        for (const p of ['contacto.html', 'transparencia.html', 'para-cuidadores.html', 'index.html']) {
            await page.goto(p);
            await expect(page.locator('a[href="#"]')).toHaveCount(0);
            await expect(page.locator('.fa-facebook-square, .fa-twitter-square, .fa-instagram')).toHaveCount(0);
        }
    });

    test('términos y accesibilidad están enlazados desde el pie', async ({ page }) => {
        await page.goto('index.html');
        await page.click('footer a[href="terminos.html"]');
        await expect(page.locator('h1')).toHaveText('Términos y condiciones de uso');
        await page.click('footer a[href="accesibilidad.html"]');
        await expect(page.locator('h1')).toHaveText('Declaración de accesibilidad');
    });
});

test('ningún enlace lleva a un número inventado (placeholders)', async ({ page }) => {
    for (const p of ['index.html', 'contacto.html', 'nodos.html', 'estado-tramite.html', 'inscripcion.html', 'politica-privacidad.html']) {
        await page.goto(p);
        await expect(page.locator('a[href*="wa.me"]')).toHaveCount(0);
        const tels = await page.$$eval('a[href^="tel:"]', (as) => [...new Set(as.map((a) => a.getAttribute('href')))]);
        expect(tels.filter((t) => t !== 'tel:147'), p).toEqual([]);
    }
    await page.goto('index.html');
    await page.click('.whatsapp-float');
    await expect(page).toHaveURL(/contacto\.html#whatsapp$/);
    await expect(page.locator('#whatsapp')).toContainText('Nunca te vamos a pedir claves');
});

test('el botón de WhatsApp no tapa el final de la página ni el menú abierto (A-34)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('contacto.html');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const tapa = await page.evaluate(() => {
        const b = document.querySelector('.whatsapp-float').getBoundingClientRect();
        const texto = document.querySelector('.author-disclaimer p').getBoundingClientRect();
        return !(b.bottom < texto.top || b.top > texto.bottom);
    });
    expect(tapa).toBe(false);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.click('.nav-toggle');
    await expect(page.locator('.whatsapp-float')).toBeHidden();
});

test('la página 404 carga bien también en rutas con subcarpetas', async ({ page }) => {
    const r = await page.goto('/cuidar/una/carpeta/que-no-existe.html');
    expect(r.status()).toBe(404);
    await expect(page.locator('h1')).toHaveText('No encontramos esta página');
    // Los estilos cargaron: el hero tiene su degradado y el pie su fondo oscuro
    expect(await page.$eval('.hero-documento', (e) => getComputedStyle(e).backgroundImage)).toContain('gradient');
    const toggle = page.locator('.nav-toggle');
    if (await toggle.isVisible()) await toggle.click();
    await page.click('.nav-tramites a[href="nodos.html"]');
    await expect(page).toHaveURL(/\/cuidar\/nodos\.html$/);
});

test('lo que anuncia un lector de pantalla: sin símbolos sueltos, ayudas asociadas, logo con nombre claro', async ({ page }) => {
    await page.goto('inscripcion.html');
    const arbol = await page.locator('body').ariaSnapshot();
    expect(arbol).not.toContain('text: ⚠');
    await expect(page.locator('#dni')).toHaveAccessibleDescription(/Sin puntos ni espacios/);
    await page.goto('estado-tramite.html');
    await expect(page.locator('#dni')).toHaveAccessibleDescription(/Solo números/);
    await expect(page.locator('header a.logo')).toHaveAccessibleName('Ciudad Autónoma de Buenos Aires Cuidados en Red');
});
