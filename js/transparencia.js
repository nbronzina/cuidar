/* transparencia.html — Cuidados en Red */

// Las barras de presupuesto toman su ancho de data-ancho y se animan al cargar
window.addEventListener('load', function() {
    var reducir = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('.progress-bar-fill[data-ancho]').forEach(function(bar) {
        var ancho = bar.getAttribute('data-ancho') + '%';
        if (reducir) { bar.style.width = ancho; return; }
        bar.style.width = '0%';
        setTimeout(function() { bar.style.width = ancho; }, 600);
    });
});
