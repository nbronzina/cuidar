/* El "hoy" del mundo ficticio — Cuidados en Red
   Toma la fecha y hora reales del visitante y las traslada a 2032.
   Marcas en el HTML:
     data-mundo-fecha="0"      → fecha de hoy (dd/mm/aaaa); admite desplazamiento en días: "-16", "3"
     data-mundo-dia="3"        → igual, pero sin año (dd/mm)
     data-mundo-hora           → hora en punto de la última sincronización (hh:00 h)
     data-mundo-mes            → mes y año actuales ("septiembre de 2032")
     data-mundo-trimestre      → último trimestre cerrado ("2.º trimestre de 2032")
   El texto que ya trae cada elemento queda como respaldo si el script no corre. */

var CRMundo = (function() {
    var ANIO = 2032;
    var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
        'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    var ORDINALES = ['1.er', '2.º', '3.er', '4.º'];

    function hoy() {
        var d = new Date();
        d.setFullYear(ANIO);
        return d;
    }

    function masDias(dias) {
        var d = hoy();
        d.setDate(d.getDate() + dias);
        return d;
    }

    function dosDigitos(n) {
        return (n < 10 ? '0' : '') + n;
    }

    function fecha(d) {
        return dosDigitos(d.getDate()) + '/' + dosDigitos(d.getMonth() + 1) + '/' + d.getFullYear();
    }

    function dia(d) {
        return dosDigitos(d.getDate()) + '/' + dosDigitos(d.getMonth() + 1);
    }

    function trimestreCerrado() {
        var d = hoy();
        var t = Math.floor(d.getMonth() / 3) - 1;
        var anio = d.getFullYear();
        if (t < 0) { t = 3; anio -= 1; }
        return ORDINALES[t] + ' trimestre de ' + anio;
    }

    function aplicar(root) {
        root = root || document;
        root.querySelectorAll('[data-mundo-fecha]').forEach(function(el) {
            el.textContent = fecha(masDias(parseInt(el.getAttribute('data-mundo-fecha'), 10) || 0));
        });
        root.querySelectorAll('[data-mundo-dia]').forEach(function(el) {
            el.textContent = dia(masDias(parseInt(el.getAttribute('data-mundo-dia'), 10) || 0));
        });
        root.querySelectorAll('[data-mundo-hora]').forEach(function(el) {
            el.textContent = dosDigitos(hoy().getHours()) + ':00 h';
        });
        root.querySelectorAll('[data-mundo-mes]').forEach(function(el) {
            var d = hoy();
            el.textContent = MESES[d.getMonth()] + ' de ' + d.getFullYear();
        });
        root.querySelectorAll('[data-mundo-trimestre]').forEach(function(el) {
            el.textContent = trimestreCerrado();
        });
    }

    document.addEventListener('DOMContentLoaded', function() { aplicar(); });

    return { hoy: hoy, fecha: fecha, aplicar: aplicar };
})();
