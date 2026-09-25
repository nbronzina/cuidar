/* estado-tramite.html — Cuidados en Red */

/* Legajo de ejemplo (PERSONAS.md): María Isabel González */
var DEMO = { dni: '12345678', fechaNacimiento: '1956-03-14', numero: 'CR-2032-0041377' };

/* Protección contra búsquedas por prueba y error (DATA-TRUTH.md) */
var MAX_INTENTOS = 3;
var BLOQUEO_MINUTOS = 15;
var CLAVE_INTENTOS = 'cuidar-consulta-intentos';

document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('searchForm');
    CR.enhance(form);
    form.addEventListener('submit', searchStatus);
});

function showOnly(id) {
    ['resultContainer', 'notFound', 'newRecord'].forEach(function(x) {
        var el = document.getElementById(x);
        el.hidden = x !== id;
        el.style.display = x === id ? 'block' : '';
    });
}

function intentos() {
    return CR.readSession(CLAVE_INTENTOS) || { fallos: 0, hasta: 0 };
}

function horaDesbloqueo(ms) {
    var d = new Date(ms);
    return (d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
}

/* El trámite se muestra solo si el DNI coincide y además la fecha de nacimiento o el número de trámite */
function verificar(registro, dni, fecha, numero) {
    if (!registro || dni !== registro.dni) return false;
    return (fecha && fecha === registro.fechaNacimiento) || (numero && numero === registro.numero);
}

function searchStatus(event) {
    event.preventDefault();
    var form = document.getElementById('searchForm');
    var dniField = document.getElementById('dni');
    var fechaField = document.getElementById('fechaNacimiento');
    var tramiteField = document.getElementById('tramite');
    var status = form.querySelector('.form-status');
    var aviso = document.getElementById('intentosAviso');

    var estado = intentos();
    if (estado.hasta > Date.now()) {
        showOnly('notFound');
        aviso.textContent = 'Por seguridad, la consulta está bloqueada hasta las ' + horaDesbloqueo(estado.hasta) + ' h. Si necesitás el estado antes, llamá al 147.';
        aviso.hidden = false;
        CR.focusHeading(document.getElementById('notFoundTitle'));
        return;
    }

    if (!CR.validateField(dniField)) {
        status.textContent = 'Revisá el DNI.';
        status.hidden = false;
        dniField.focus();
        return;
    }
    var dni = dniField.value.replace(/\D/g, '');
    var fecha = fechaField.value;
    var numero = tramiteField.value.trim().toUpperCase();
    if (!fecha && !numero) {
        CR.showError(fechaField, 'Escribí tu fecha de nacimiento o, si lo tenés, el número de trámite.');
        status.textContent = 'Necesitamos un segundo dato para confirmar que sos vos.';
        status.hidden = false;
        fechaField.focus();
        return;
    }
    CR.clearError(fechaField);
    status.hidden = true;

    var searchBtn = form.querySelector('.btn-search');
    var originalText = searchBtn.innerHTML;
    searchBtn.disabled = true;
    searchBtn.innerHTML = '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Buscando...';

    // Simulación de la consulta al sistema
    setTimeout(function() {
        searchBtn.disabled = false;
        searchBtn.innerHTML = originalText;

        var propio = CR.readSession('cuidar-tramite');
        if (verificar(DEMO, dni, fecha, numero)) {
            CR.removeSession(CLAVE_INTENTOS);
            aviso.hidden = true;
            showOnly('resultContainer');
            CR.focusHeading(document.getElementById('userName'));
        } else if (verificar(propio, dni, fecha, numero)) {
            CR.removeSession(CLAVE_INTENTOS);
            aviso.hidden = true;
            document.getElementById('newRecordTitle').textContent = propio.nombre || 'Tu solicitud';
            document.getElementById('newRecordDni').textContent = CR.formatDni(propio.dni);
            document.getElementById('newRecordTramite').textContent = propio.numero;
            showOnly('newRecord');
            CR.focusHeading(document.getElementById('newRecordTitle'));
        } else {
            estado.fallos += 1;
            if (estado.fallos >= MAX_INTENTOS) {
                estado = { fallos: 0, hasta: Date.now() + BLOQUEO_MINUTOS * 60000 };
                aviso.textContent = 'Hubo ' + MAX_INTENTOS + ' intentos sin coincidencia. Por seguridad, la consulta queda bloqueada ' + BLOQUEO_MINUTOS + ' minutos (hasta las ' + horaDesbloqueo(estado.hasta) + ' h). Si necesitás el estado antes, llamá al 147.';
            } else {
                var quedan = MAX_INTENTOS - estado.fallos;
                aviso.textContent = quedan === 1 ? 'Te queda 1 intento antes de que la consulta se bloquee por ' + BLOQUEO_MINUTOS + ' minutos.' : 'Te quedan ' + quedan + ' intentos.';
            }
            CR.writeSession(CLAVE_INTENTOS, estado);
            aviso.hidden = false;
            showOnly('notFound');
            CR.focusHeading(document.getElementById('notFoundTitle'));
        }
    }, 1500);
}
