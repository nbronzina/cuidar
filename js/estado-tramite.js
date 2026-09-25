/* estado-tramite.html — Cuidados en Red */

var DEMO_DNI = '12345678';
var DEMO_TRAMITE = 'CR-2032-0041377';

document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('searchForm');
    CR.enhance(form);
    form.addEventListener('submit', searchStatus);
});

function showOnly(id) {
    ['resultContainer', 'notFound', 'newRecord'].forEach(function(x) {
        document.getElementById(x).style.display = x === id ? 'block' : 'none';
    });
}

function searchStatus(event) {
    event.preventDefault();
    var form = document.getElementById('searchForm');
    var dniField = document.getElementById('dni');
    var dni = dniField.value.replace(/\D/g, '');
    var tramite = document.getElementById('tramite').value.trim().toUpperCase();
    var status = form.querySelector('.form-status');

    if (!dni && !tramite) {
        CR.showError(dniField, 'Escribí tu DNI o tu número de trámite.');
        status.textContent = 'Necesitamos al menos uno de los dos datos para buscar tu trámite.';
        status.hidden = false;
        dniField.focus();
        return;
    }
    CR.clearError(dniField);
    status.hidden = true;
    if (dniField.value && !CR.validateField(dniField)) {
        dniField.focus();
        return;
    }

    var searchBtn = form.querySelector('.btn-search');
    var originalText = searchBtn.innerHTML;
    searchBtn.disabled = true;
    searchBtn.innerHTML = '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Buscando...';

    // Simulación de la consulta al sistema
    setTimeout(function() {
        searchBtn.disabled = false;
        searchBtn.innerHTML = originalText;

        var own = CR.readSession('cuidar-tramite');
        if (dni === DEMO_DNI || tramite === DEMO_TRAMITE) {
            showOnly('resultContainer');
            CR.focusHeading(document.getElementById('userName'));
        } else if (own && ((dni && dni === own.dni) || (tramite && tramite === own.numero))) {
            document.getElementById('newRecordTitle').textContent = own.nombre || 'Tu solicitud';
            document.getElementById('newRecordDni').textContent = CR.formatDni(own.dni);
            document.getElementById('newRecordTramite').textContent = own.numero;
            showOnly('newRecord');
            CR.focusHeading(document.getElementById('newRecordTitle'));
        } else {
            showOnly('notFound');
            CR.focusHeading(document.getElementById('notFoundTitle'));
        }
    }, 1500);
}
