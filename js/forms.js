/* Formularios compartidos — Cuidados en Red
   Validación con mensajes propios, números de trámite y manejo de foco. */

var CR = (function() {
    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* sessionStorage puede no estar disponible (navegación privada, datos bloqueados) */
    function readSession(key) {
        try { return JSON.parse(sessionStorage.getItem(key)); } catch (e) { return null; }
    }
    function writeSession(key, value) {
        try { sessionStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* sin persistencia */ }
    }
    function removeSession(key) {
        try { sessionStorage.removeItem(key); } catch (e) { /* nada que borrar */ }
    }

    function errorKey(field) {
        return field.type === 'radio' ? field.name : field.id;
    }

    function messageFor(field) {
        var v = field.validity;
        if (v.valueMissing) {
            if (field.dataset.errorRequired) return field.dataset.errorRequired;
            if (field.type === 'radio') return 'Elegí una opción.';
            if (field.type === 'checkbox') return 'Marcá esta casilla para continuar.';
            if (field.tagName === 'SELECT') return 'Elegí una opción de la lista.';
            return 'Completá este dato.';
        }
        if (v.typeMismatch && field.type === 'email') {
            return 'Revisá el email: tiene que tener la forma nombre@dominio.com.';
        }
        if (v.patternMismatch) return field.dataset.errorPattern || 'Revisá el formato de este dato.';
        if (v.rangeOverflow || v.rangeUnderflow) return field.dataset.errorRange || 'Revisá la fecha.';
        if (v.badInput) return 'Revisá este dato: el formato no es válido.';
        return 'Revisá este dato.';
    }

    function groupFields(field) {
        return field.type === 'radio' && field.form
            ? Array.prototype.slice.call(field.form.querySelectorAll('input[type="radio"][name="' + field.name + '"]'))
            : [field];
    }

    function errorContainer(field) {
        if (field.type === 'radio') return field.closest('fieldset') || field.parentNode;
        return field.closest('.form-group') || field.parentNode;
    }

    function setDescribedBy(field, id, add) {
        var ids = (field.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
        ids = ids.filter(function(x) { return x !== id; });
        if (add) ids.push(id);
        if (ids.length) field.setAttribute('aria-describedby', ids.join(' '));
        else field.removeAttribute('aria-describedby');
    }

    function showError(field, message) {
        var id = 'error-' + errorKey(field);
        var el = document.getElementById(id);
        if (!el) {
            el = document.createElement('p');
            el.className = 'form-error';
            el.id = id;
            errorContainer(field).appendChild(el);
        }
        el.innerHTML = '<i class="fa fa-exclamation-circle" aria-hidden="true"></i> ';
        el.appendChild(document.createTextNode(message));
        groupFields(field).forEach(function(f) {
            f.setAttribute('aria-invalid', 'true');
            setDescribedBy(f, id, true);
        });
    }

    function clearError(field) {
        var id = 'error-' + errorKey(field);
        var el = document.getElementById(id);
        if (el) el.remove();
        groupFields(field).forEach(function(f) {
            f.removeAttribute('aria-invalid');
            setDescribedBy(f, id, false);
        });
    }

    function validateField(field) {
        if (field.checkValidity()) {
            clearError(field);
            return true;
        }
        showError(field, messageFor(field));
        return false;
    }

    function fieldsOf(form) {
        var seen = {};
        return Array.prototype.filter.call(form.elements, function(f) {
            if (!f.willValidate || f.type === 'submit' || f.type === 'button') return false;
            if (f.type === 'radio') {
                if (seen[f.name]) return false;
                seen[f.name] = true;
            }
            return true;
        });
    }

    /* Valida todo el formulario; enfoca el primer dato con error */
    function validateForm(form) {
        var invalid = fieldsOf(form).filter(function(f) { return !validateField(f); });
        var status = form.querySelector('.form-status');
        if (status) {
            status.textContent = invalid.length
                ? (invalid.length === 1 ? 'Revisá el dato marcado en rojo.' : 'Revisá los ' + invalid.length + ' datos marcados en rojo.')
                : '';
            status.hidden = !invalid.length;
        }
        if (invalid.length) invalid[0].focus();
        return invalid.length === 0;
    }

    /* Validación propia: los errores aparecen al enviar o al salir de un campo ya tocado */
    function enhance(form) {
        form.noValidate = true;
        form.addEventListener('focusout', function(e) {
            var f = e.target;
            if (!f.willValidate || f.type === 'radio') return;
            if (f.value !== '' || f.hasAttribute('aria-invalid')) validateField(f);
        });
        form.addEventListener('change', function(e) {
            if (e.target.hasAttribute('aria-invalid')) validateField(e.target);
        });
        form.addEventListener('input', function(e) {
            if (e.target.hasAttribute('aria-invalid') && e.target.checkValidity()) clearError(e.target);
        });
    }

    /* Mueve el foco a un título (el lector de pantalla lo anuncia) y lo lleva a la vista */
    function focusHeading(el) {
        if (!el) return;
        el.setAttribute('tabindex', '-1');
        el.focus({ preventScroll: true });
        el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    }

    /* Número de trámite o consulta: PREFIJO-2032-NNNNNNN */
    function newNumber(prefix) {
        var n = String(Math.floor(Math.random() * 10000000));
        while (n.length < 7) n = '0' + n;
        return prefix + '-2032-' + n;
    }

    function formatDni(dni) {
        return String(dni).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    return {
        readSession: readSession,
        writeSession: writeSession,
        removeSession: removeSession,
        showError: showError,
        clearError: clearError,
        validateField: validateField,
        validateForm: validateForm,
        enhance: enhance,
        focusHeading: focusHeading,
        newNumber: newNumber,
        formatDni: formatDni
    };
})();
