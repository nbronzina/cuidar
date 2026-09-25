/* contacto.html — Cuidados en Red */

document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('contactForm');
    CR.enhance(form);
    form.addEventListener('submit', sendContact);
    document.getElementById('resetContactBtn').addEventListener('click', resetContactForm);
});

function sendContact(e) {
    e.preventDefault();
    var form = document.getElementById('contactForm');
    if (!CR.validateForm(form)) return;

    var submitBtn = form.querySelector('.btn-submit');
    var originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Enviando...';

    // Simulación del envío
    setTimeout(function() {
        document.getElementById('consultaNumero').textContent = CR.newNumber('C');
        document.querySelector('.form-container').style.display = 'none';
        document.getElementById('contactSuccess').classList.add('show');
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        CR.focusHeading(document.getElementById('contactSuccessTitle'));
    }, 1500);
}

function resetContactForm() {
    document.getElementById('contactForm').reset();
    document.querySelector('.form-container').style.display = 'block';
    document.getElementById('contactSuccess').classList.remove('show');
    document.getElementById('nombre').focus();
}
