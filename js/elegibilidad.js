/* elegibilidad.html — Cuidados en Red */

function prefiereMenosMovimiento() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

let answeredQuestions = new Set();
const totalQuestions = 6;

/* Event delegation for quiz — replaces inline onchange/onclick handlers */
document.addEventListener('DOMContentLoaded', function() {
    var questionMap = {edad:1, residencia:2, vivienda:3, autonomia:4, cuidadoActual:5, movilidad:6};
    var quiz = document.getElementById('eligibilityQuiz');
    if (quiz) {
        quiz.addEventListener('change', function(e) {
            if (e.target.type === 'radio' && questionMap[e.target.name]) {
                answerQuestion(questionMap[e.target.name]);
            }
        });
    }
    var checkBtn = document.getElementById('checkBtn');
    if (checkBtn) checkBtn.addEventListener('click', checkEligibility);
    var resetBtn = document.getElementById('resetBtn');
    if (resetBtn) resetBtn.addEventListener('click', resetQuiz);
});

function answerQuestion(questionNum) {
    // Mark question as answered
    answeredQuestions.add(questionNum);

    // Update question card styling
    const card = document.getElementById('q' + questionNum);
    card.classList.add('answered');

    // Update selected option styling
    const options = card.querySelectorAll('.answer-option');
    options.forEach(option => {
        const radio = option.querySelector('input[type="radio"]');
        if (radio.checked) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });

    // Update progress
    updateProgress();

    // Enable check button if all questions answered
    if (answeredQuestions.size === totalQuestions) {
        document.getElementById('checkBtn').disabled = false;
        document.getElementById('checkHint').hidden = true;
    }
}

function updateProgress() {
    const percentage = (answeredQuestions.size / totalQuestions) * 100;
    document.getElementById('progressFill').style.width = percentage + '%';
    document.getElementById('progressText').innerHTML =
        `<strong>${answeredQuestions.size} de ${totalQuestions}</strong> preguntas respondidas`;

    // Update aria-valuenow
    const progressBar = document.querySelector('.progress-bar');
    progressBar.setAttribute('aria-valuenow', percentage);
}

var NIVELES = {
    0: { nombre: 'Nivel 0 (Universal)', horas: 'evaluación, teleasistencia y seguimiento del Nodo, sin horas de persona cuidadora' },
    1: { nombre: 'Nivel 1 (Leve)', horas: 'entre 20 y 40 horas por mes de persona cuidadora' },
    2: { nombre: 'Nivel 2 (Moderado)', horas: 'entre 40 y 70 horas por mes de persona cuidadora' },
    3: { nombre: 'Nivel 3 (Severo)', horas: 'entre 70 y 100 horas por mes de persona cuidadora' }
};

function nivelOrientativo(answers) {
    var base = { total: 0, parcial: 1, minima: 2, dependiente: 3 }[answers.autonomia];
    var movilidad = { si: 0, dificultad: 0, ayuda: 1, no: 1 }[answers.movilidad];
    return Math.min(3, base + movilidad);
}

function checkEligibility() {
    var q = function(name) { return document.querySelector('input[name="' + name + '"]:checked').value; };
    var answers = {
        edad: q('edad'), residencia: q('residencia'), vivienda: q('vivienda'),
        autonomia: q('autonomia'), cuidadoActual: q('cuidadoActual'), movilidad: q('movilidad')
    };

    // Solo la edad y el domicilio impiden el acceso
    var reasons = [];
    if (answers.edad === 'menos60') {
        reasons.push('Tenés menos de 60 años. El programa está destinado a personas de 60 años o más.');
    }
    if (answers.residencia !== 'caba') {
        reasons.push('Vivís fuera de CABA. El programa cubre solo la Ciudad de Buenos Aires.');
    }

    showResult(reasons, answers);
}

function stepList(items) {
    return '<ol class="u-padding-left-24px u-margin-0 u-line-height-2 u-font-size-1rem">' +
        items.map(function(i) { return '<li>' + i + '</li>'; }).join('') + '</ol>';
}

function actionButtons(primaryHref, primaryText) {
    return '<div class="u-display-flex u-gap-16px u-justify-content-center u-flex-wrap-wrap">' +
        '<a href="' + primaryHref + '" class="btn u-background-color-14461a u-color-white u-padding-16px-40px u-font-size-1_125rem"><i class="fa fa-edit" aria-hidden="true"></i> ' + primaryText + '</a>' +
        '<a href="tel:147" class="btn u-background-color-primary u-color-white u-padding-16px-40px u-font-size-1_125rem"><i class="fa fa-phone" aria-hidden="true"></i> Llamar al 147</a>' +
        '</div>';
}

function showResult(reasons, answers) {
    var resultBox = document.getElementById('resultBox');
    var nivel = NIVELES[nivelOrientativo(answers)];
    var box = 'resultado-caja';
    var note = 'resultado-nota';
    var noteText = 'resultado-nota-texto';

    var nivelHtml =
        '<div class="' + box + '">' +
            '<h3 class="u-color-primary u-margin-bottom-8px u-font-size-1_25rem"><i class="fa fa-sliders" aria-hidden="true"></i> Tu nivel de cuidado orientativo</h3>' +
            '<p class="u-margin-0-0-8px u-color-333"><strong>' + nivel.nombre + ':</strong> ' + nivel.horas + '.</p>' +
            '<p class="u-margin-0 u-color-505050 u-font-size-1rem">Es una estimación según tus respuestas. El nivel definitivo se decide en la evaluación domiciliaria.</p>' +
            (answers.autonomia === 'dependiente'
                ? '<div class="' + note + '"><p class="' + noteText + '"><strong>Tené en cuenta:</strong> el servicio llega hasta 100 horas por mes, no es cuidado permanente las 24 horas. Si necesitás compañía todo el día, en la evaluación armamos cómo combinarlo con tu familia u otros programas.</p></div>'
                : '') +
            (answers.cuidadoActual === 'no'
                ? '<p class="u-margin-12px-0-0 u-color-14461a"><i class="fa fa-flag" aria-hidden="true"></i> Como hoy nadie te ayuda en tu casa, tu inscripción tiene prioridad.</p>'
                : '') +
        '</div>';

    if (reasons.length) {
        resultBox.className = 'result-box result-not-eligible show';
        var alternativas = [];
        if (answers.edad === 'menos60') {
            alternativas.push('<li>Si tenés entre 55 y 59 años y una discapacidad o una enfermedad crónica, llamá al 147: se evalúan casos excepcionales.</li>');
        }
        if (answers.residencia !== 'caba') {
            alternativas.push('<li>Consultá los programas de cuidado de tu municipio. Si tenés PAMI, preguntá en tu agencia por las prestaciones para personas mayores.</li>');
        }
        resultBox.innerHTML =
            '<div class="result-icon"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i></div>' +
            '<h2 class="u-color-accent-text u-font-size-2_25rem u-margin-bottom-16px">Por el momento, no cumplís los requisitos</h2>' +
            '<p class="u-font-size-1_125rem u-color-333 u-margin-bottom-24px u-line-height-1_6">Según tus respuestas, hay requisitos que no se cumplen:</p>' +
            '<div class="' + box + '"><ul class="u-margin-0 u-padding-left-24px u-line-height-1_8 u-color-444">' +
                reasons.map(function(r) { return '<li>' + r + '</li>'; }).join('') + '</ul></div>' +
            '<div class="' + box + '"><h3 class="u-color-accent-text u-margin-bottom-16px u-font-size-1_25rem"><i class="fa fa-lightbulb-o" aria-hidden="true"></i> ¿Qué podés hacer?</h3>' +
                '<ul class="u-margin-0 u-padding-left-24px u-line-height-1_8 u-color-444">' + alternativas.join('') + '</ul></div>' +
            '<div class="u-display-flex u-gap-16px u-justify-content-center u-flex-wrap-wrap">' +
                '<a href="tel:147" class="btn u-background-color-primary u-color-white u-padding-16px-40px u-font-size-1_125rem"><i class="fa fa-phone" aria-hidden="true"></i> Llamar al 147 para orientación</a>' +
                '<a href="contacto.html" class="btn u-background-color-14461a u-color-white u-padding-16px-40px u-font-size-1_125rem"><i class="fa fa-envelope" aria-hidden="true"></i> Contactanos</a>' +
            '</div>';
    } else if (answers.vivienda === 'geriatrico') {
        resultBox.className = 'result-box result-eligible show';
        resultBox.innerHTML =
            '<div class="result-icon"><i class="fa fa-home" aria-hidden="true"></i></div>' +
            '<h2 class="u-color-14461a u-font-size-2_25rem u-margin-bottom-16px">Podés acceder por la vía de retorno a tu casa</h2>' +
            '<p class="u-font-size-1_25rem u-color-333 u-margin-bottom-32px u-line-height-1_6">Cuidados en Red nació para acompañar a personas que viven en una residencia y quieren volver a su casa. Tu caso entra por esa vía.</p>' +
            '<div class="' + box + '"><h3 class="u-color-14461a u-margin-bottom-16px u-font-size-1_375rem u-text-align-center"><i class="fa fa-list-ol" aria-hidden="true"></i> Cómo es la vuelta</h3>' +
                stepList([
                    '<strong>Inscribite</strong> y contá en “Contanos tu situación” que hoy vivís en una residencia',
                    'El Nodo evalúa <strong>la vivienda a la que volverías</strong> (tuya o de un familiar) y tu nivel de cuidado',
                    'Armamos el <strong>plan de vuelta</strong>: persona cuidadora y tecnología listas antes de que llegues',
                    '¡<strong>Volvés a tu casa</strong> con el servicio funcionando!'
                ]) +
                '<div class="' + note + '"><p class="' + noteText + '"><strong>La vuelta no es inmediata:</strong> se planifica con el equipo del Nodo y depende de que la vivienda esté en condiciones y de que haya personas cuidadoras disponibles en tu zona.</p></div>' +
            '</div>' +
            nivelHtml +
            actionButtons('inscripcion.html', 'Inscribirme');
    } else {
        resultBox.className = 'result-box result-eligible show';
        resultBox.innerHTML =
            '<div class="result-icon"><i class="fa fa-check" aria-hidden="true"></i></div>' +
            '<h2 class="u-color-14461a u-font-size-2_25rem u-margin-bottom-16px">¡Sí, cumplís los requisitos!</h2>' +
            '<p class="u-font-size-1_25rem u-color-333 u-margin-bottom-32px u-line-height-1_6">Según tus respuestas, <strong>podés acceder a Cuidados en Red</strong>. El siguiente paso es inscribirte para que te hagamos una evaluación domiciliaria.</p>' +
            nivelHtml +
            '<div class="' + box + '"><h3 class="u-color-14461a u-margin-bottom-16px u-font-size-1_375rem u-text-align-center"><i class="fa fa-list-ol" aria-hidden="true"></i> Próximos pasos</h3>' +
                stepList([
                    '<strong>Inscribite</strong> online, por teléfono o presencialmente',
                    'Te <strong>llamamos en 24-48 h hábiles</strong> del Nodo de tu zona <span class="u-color-505050 u-font-size-1rem">(en los Nodos con más demanda, hasta 5-7 días)</span>',
                    'Coordinamos una <strong>visita domiciliaria</strong> <span class="u-color-505050 u-font-size-1rem">(puede reprogramarse por emergencias)</span>',
                    'Evaluamos tus necesidades y armamos tu plan <span class="u-color-505050 u-font-size-1rem">(dentro de los 15 días hábiles)</span>',
                    'Asignamos persona cuidadora <span class="u-color-505050 u-font-size-1rem">(7 a 14 días; más si tu Nodo tiene lista de espera)</span>',
                    '¡<strong>Empezás con el servicio</strong>!'
                ]) +
                '<div class="' + note + '"><p class="' + noteText + '"><strong><i class="fa fa-clock-o" aria-hidden="true"></i> Tiempo total estimado:</strong> entre 3 y 5 semanas desde la inscripción; hasta 8 en Palermo, Belgrano, Recoleta y Caballito.</p></div>' +
            '</div>' +
            actionButtons('inscripcion.html', 'Inscribirme ahora');
    }

    // Llevar el foco al título del resultado: el lector de pantalla lo anuncia una sola vez
    var resultTitle = resultBox.querySelector('h2');
    resultTitle.setAttribute('tabindex', '-1');
    resultTitle.focus({ preventScroll: true });
    resultBox.scrollIntoView({ behavior: prefiereMenosMovimiento() ? 'auto' : 'smooth', block: 'start' });
}

function resetQuiz() {
    // Clear all radio buttons
    document.querySelectorAll('.question-card input[type="radio"]').forEach(function(r) { r.checked = false; });
    // Reset progress
    answeredQuestions.clear();
    var progressFill = document.getElementById('progressFill');
    if (progressFill) { progressFill.style.width = '0%'; }
    var progressText = document.getElementById('progressText');
    if (progressText) { progressText.innerHTML = '<strong>0 de 6</strong> preguntas respondidas'; }
    var progressBar = document.querySelector('.progress-bar');
    if (progressBar) { progressBar.setAttribute('aria-valuenow', '0'); }
    // Hide results
    var resultBox = document.getElementById('resultBox');
    if (resultBox) { resultBox.className = 'result-box'; resultBox.innerHTML = ''; }
    // Reset question card styling
    document.querySelectorAll('.question-card').forEach(function(card) {
        card.classList.remove('answered');
    });
    document.querySelectorAll('.answer-option').forEach(function(opt) {
        opt.classList.remove('selected');
    });
    // Disable check button
    var checkBtn = document.getElementById('checkBtn');
    if (checkBtn) checkBtn.disabled = true;
    var checkHint = document.getElementById('checkHint');
    if (checkHint) checkHint.hidden = false;
    // Scroll to top of quiz
    var quizContainer = document.querySelector('.quiz-container');
    if (quizContainer) quizContainer.scrollIntoView({ behavior: prefiereMenosMovimiento() ? 'auto' : 'smooth', block: 'start' });
    // Announce to screen reader
    if (typeof announceToScreenReader === 'function') {
        announceToScreenReader('Test reiniciado. Podés comenzar de nuevo.');
    }
}
