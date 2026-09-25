/* transparencia.html — Cuidados en Red */

// Animación de las barras de progreso al cargar
window.addEventListener('load', function() {
    setTimeout(() => {
        document.querySelectorAll('.progress-bar-fill').forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }, 500);
});
