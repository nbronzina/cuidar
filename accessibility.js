/* Funcionalidad de accesibilidad compartida — Cuidados en Red */

function adjustTextSize(size) {
    document.body.classList.remove('text-size-normal', 'text-size-large', 'text-size-xlarge');
    document.body.classList.add('text-size-' + size);
    localStorage.setItem('textSize', size);
    announceToScreenReader('Tamaño de texto cambiado a ' +
        (size === 'normal' ? 'normal' : size === 'large' ? 'grande' : 'extra grande'));
}

function toggleHighContrast() {
    var body = document.body;
    body.classList.toggle('high-contrast');
    var isHighContrast = body.classList.contains('high-contrast');
    localStorage.setItem('highContrast', isHighContrast ? 'true' : 'false');
    announceToScreenReader(isHighContrast ?
        'Alto contraste activado' :
        'Alto contraste desactivado');
}

function announceToScreenReader(message) {
    var announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.textContent = message;
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    document.body.appendChild(announcement);
    setTimeout(function() { document.body.removeChild(announcement); }, 1000);
}

document.addEventListener('DOMContentLoaded', function() {
    var textSize = localStorage.getItem('textSize');
    if (textSize) document.body.classList.add('text-size-' + textSize);
    if (localStorage.getItem('highContrast') === 'true') {
        document.body.classList.add('high-contrast');
    }
});
