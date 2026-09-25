/* inscripcion.html — Cuidados en Red */

var DRAFT_KEY = 'cuidar-borrador';
/* No se guardan en el borrador: datos de salud ni consentimientos */
var NOT_SAVED = ['situacion', 'privacidad', 'comunicaciones'];
var formDirty = false;

document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('inscriptionForm');
    CR.enhance(form);
    form.addEventListener('submit', handleInscription);

    // Versiones anteriores guardaban el borrador completo en localStorage: se elimina
    try { localStorage.removeItem('cuidar-form-data'); } catch (e) { /* sin acceso */ }

    restoreDraft();
    form.addEventListener('input', onEdit);
    form.addEventListener('change', onEdit);
    document.getElementById('clearDraft').addEventListener('click', clearDraft);
    document.getElementById('copyTramite').addEventListener('click', copyTramite);
});

function onEdit() {
    formDirty = true;
    saveDraft();
}

function handleInscription(event) {
    event.preventDefault();
    var form = document.getElementById('inscriptionForm');
    if (!CR.validateForm(form)) return;

    var submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Procesando inscripción...';

    // Simulación del procesamiento en el servidor
    setTimeout(function() {
        var numero = CR.newNumber('CR');
        var dni = document.getElementById('dni').value.trim();
        CR.writeSession('cuidar-tramite', {
            numero: numero,
            dni: dni,
            nombre: document.getElementById('nombreCompleto').value.trim()
        });

        form.style.display = 'none';
        document.querySelector('.info-box').style.display = 'none';
        document.querySelector('.reality-check').style.display = 'none';
        document.querySelector('.alternative-methods').style.display = 'none';

        document.getElementById('tramiteNumero').textContent = numero;
        document.getElementById('confirmedEmail').textContent = document.getElementById('email').value.trim();
        document.getElementById('successMessage').classList.add('show');

        CR.removeSession(DRAFT_KEY);
        formDirty = false;
        CR.focusHeading(document.getElementById('successTitle'));
    }, 1800);
}

function copyTramite() {
    var btn = document.getElementById('copyTramite');
    var numero = document.getElementById('tramiteNumero').textContent;
    var done = function() { btn.querySelector('span').textContent = 'Número copiado'; };
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(numero).then(done, function() { selectNumber(); });
    } else {
        selectNumber();
    }
}

function selectNumber() {
    var range = document.createRange();
    range.selectNodeContents(document.getElementById('tramiteNumero'));
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}

// Borrador: solo en esta pestaña (sessionStorage), sin datos de salud
function saveDraft() {
    var form = document.getElementById('inscriptionForm');
    var data = {};
    form.querySelectorAll('input, select, textarea').forEach(function(input) {
        var key = input.type === 'radio' ? input.name : input.id;
        if (!key || NOT_SAVED.indexOf(key) !== -1) return;
        if (input.type === 'radio') {
            if (input.checked) data[key] = input.value;
        } else if (input.type !== 'checkbox') {
            data[key] = input.value;
        }
    });
    CR.writeSession(DRAFT_KEY, data);
    document.getElementById('draftNote').hidden = false;
}

function restoreDraft() {
    var data = CR.readSession(DRAFT_KEY);
    if (!data) return;
    var form = document.getElementById('inscriptionForm');
    Object.keys(data).forEach(function(key) {
        var el = document.getElementById(key);
        if (el && el.type !== 'radio') {
            el.value = data[key];
            return;
        }
        form.querySelectorAll('input[type="radio"]').forEach(function(r) {
            if (r.name === key && r.value === data[key]) r.checked = true;
        });
    });
    document.getElementById('draftNote').hidden = false;
}

function clearDraft() {
    var form = document.getElementById('inscriptionForm');
    form.reset();
    form.querySelectorAll('[aria-invalid]').forEach(function(f) { CR.clearError(f); });
    CR.removeSession(DRAFT_KEY);
    formDirty = false;
    document.getElementById('draftNote').hidden = true;
    document.getElementById('nombreCompleto').focus();
}

window.addEventListener('beforeunload', function(e) {
    if (formDirty) {
        e.preventDefault();
        e.returnValue = '';
    }
});
