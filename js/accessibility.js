/* Funcionalidad de accesibilidad compartida — Cuidados en Red */

var TEXT_SIZES = ['normal', 'large', 'xlarge'];

/* localStorage puede no estar disponible (navegación privada, datos bloqueados) */
function readPref(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
}

function writePref(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* sin persistencia */ }
}

function syncA11yButtons() {
    var body = document.body;
    document.querySelectorAll('.accessibility-bar [data-a11y]').forEach(function(btn) {
        var action = btn.getAttribute('data-a11y');
        var pressed = action === 'contrast'
            ? body.classList.contains('high-contrast')
            : document.documentElement.classList.contains('text-size-' + action);
        btn.setAttribute('aria-pressed', pressed ? 'true' : 'false');
    });
}

function applyTextSize(size) {
    if (TEXT_SIZES.indexOf(size) === -1) size = 'normal';
    /* Sobre <html>: así los tamaños en rem crecen con la preferencia */
    var root = document.documentElement;
    TEXT_SIZES.forEach(function(s) { root.classList.remove('text-size-' + s); });
    root.classList.add('text-size-' + size);
    syncA11yButtons();
}

function adjustTextSize(size) {
    applyTextSize(size);
    writePref('textSize', size);
    announceToScreenReader('Tamaño de texto cambiado a ' +
        (size === 'normal' ? 'normal' : size === 'large' ? 'grande' : 'extra grande'));
}

function toggleHighContrast() {
    var isHighContrast = document.body.classList.toggle('high-contrast');
    writePref('highContrast', isHighContrast ? 'true' : 'false');
    syncA11yButtons();
    announceToScreenReader(isHighContrast ?
        'Alto contraste activado' :
        'Alto contraste desactivado');
}

function announceToScreenReader(message) {
    var announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(function() { announcement.remove(); }, 1000);
}

document.addEventListener('DOMContentLoaded', function() {
    applyTextSize(readPref('textSize') || 'normal');
    if (readPref('highContrast') === 'true') {
        document.body.classList.add('high-contrast');
    }
    syncA11yButtons();

    /* Barra de accesibilidad: se engancha por data-a11y, nunca por el texto visible */
    document.querySelectorAll('.accessibility-bar [data-a11y]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var action = btn.getAttribute('data-a11y');
            if (action === 'contrast') {
                toggleHighContrast();
            } else {
                adjustTextSize(action);
            }
        });
    });

    /* Menú móvil */
    var navToggle = document.querySelector('.nav-toggle');
    var navLinks = document.getElementById('nav-links');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            var open = navLinks.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.focus();
            }
        });
    }
});
