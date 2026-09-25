#!/usr/bin/env node
/* Sincroniza la cabecera y el pie compartidos en todas las páginas,
   y el JSON-LD de preguntas frecuentes con las preguntas visibles.

   Fuente única:  partials/cabecera.html  (skip link, barra de accesibilidad, header, menú)
                  partials/pie.html       (footer y aviso de autoría)

   Uso:  node tools/sincronizar.js           reescribe las páginas
         node tools/sincronizar.js --check   falla (código 1) si alguna página difiere

   En cada página los bloques quedan entre marcadores; lo que está adentro no se edita a mano. */

const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const CHECK = process.argv.includes('--check');

const BLOQUES = [
    {
        nombre: 'cabecera',
        parcial: 'partials/cabecera.html',
        // Si la página todavía no tiene marcadores, se reemplaza el bloque original
        inicio: '<a href="#main-content" class="skip-to-main">',
        fin: '</nav>'
    },
    {
        nombre: 'pie',
        parcial: 'partials/pie.html',
        inicio: '<footer',
        fin: '</footer>'
    }
];

function paginas() {
    return fs.readdirSync(RAIZ).filter((f) => f.endsWith('.html')).sort();
}

function marcarActivo(html, pagina) {
    // El ítem del menú que apunta a la página actual queda marcado para lectores de pantalla
    return html.replace(
        new RegExp('<a href="' + pagina.replace('.', '\\.') + '">'),
        '<a href="' + pagina + '" class="active" aria-current="page">'
    );
}

function sincronizar(pagina, html) {
    for (const b of BLOQUES) {
        const abre = '<!-- inicio:' + b.nombre + ' · generado desde ' + b.parcial + ' con tools/sincronizar.js; no editar acá -->';
        const cierra = '<!-- fin:' + b.nombre + ' -->';
        let parcial = fs.readFileSync(path.join(RAIZ, b.parcial), 'utf8').replace(/\s+$/, '');
        if (b.nombre === 'cabecera') parcial = marcarActivo(parcial, pagina);
        const bloque = '    ' + abre + '\n' + parcial + '\n    ' + cierra;

        const i = html.indexOf('    <!-- inicio:' + b.nombre);
        if (i !== -1) {
            const j = html.indexOf(cierra, i);
            if (j === -1) throw new Error(pagina + ': falta el marcador ' + cierra);
            html = html.slice(0, i) + bloque + html.slice(j + cierra.length);
        } else {
            const a = html.indexOf(b.inicio);
            const z = html.indexOf(b.fin, a);
            if (a === -1 || z === -1) throw new Error(pagina + ': no se encontró el bloque ' + b.nombre);
            const desde = html.lastIndexOf('\n', a) + 1;
            html = html.slice(0, desde) + bloque + html.slice(z + b.fin.length);
        }
    }
    return html;
}

/* Preguntas frecuentes: el JSON-LD FAQPage se genera desde las preguntas visibles (<details><summary>),
   para que los buscadores muestren lo mismo que la página, incluidas las limitaciones. */
function textoPlano(html) {
    return html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/\s+/g, ' ').replace(/\s+([.,;:])/g, '$1').trim();
}

function sincronizarFaq(html) {
    const inicio = html.indexOf('"@type": "FAQPage"');
    if (inicio === -1) return html;
    const abre = html.lastIndexOf('<script type="application/ld+json">', inicio);
    const cierra = html.indexOf('</script>', inicio);
    const cuerpo = html.slice(html.indexOf('<body'));
    const preguntas = [];
    const re = /<details[^>]*>\s*<summary[^>]*>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g;
    let m;
    while ((m = re.exec(cuerpo))) {
        preguntas.push({
            '@type': 'Question',
            name: textoPlano(m[1]),
            acceptedAnswer: { '@type': 'Answer', text: textoPlano(m[2]) }
        });
    }
    if (!preguntas.length) return html;
    const json = JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: preguntas }, null, 2)
        .split('\n').map((l) => '    ' + l).join('\n');
    return html.slice(0, abre) + '<script type="application/ld+json">\n' + json + '\n    ' + html.slice(cierra);
}

let distintas = [];
for (const pagina of paginas()) {
    const archivo = path.join(RAIZ, pagina);
    const actual = fs.readFileSync(archivo, 'utf8');
    const nuevo = sincronizarFaq(sincronizar(pagina, actual));
    if (nuevo !== actual) {
        distintas.push(pagina);
        if (!CHECK) fs.writeFileSync(archivo, nuevo);
    }
}

if (CHECK && distintas.length) {
    console.error('Cabecera, pie o preguntas frecuentes desincronizados en: ' + distintas.join(', '));
    console.error('Editá partials/ y corré: node tools/sincronizar.js');
    process.exit(1);
}
console.log(CHECK ? 'Cabecera y pie sincronizados en todas las páginas.' : 'Actualizadas: ' + (distintas.join(', ') || 'ninguna'));
