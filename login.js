const form = document.querySelector('.form');
const email = document.getElementById('email');
const password = document.getElementById('password');
const toggle = document.querySelector('.password-field .toggle');

if (toggle) {
    toggle.addEventListener('click', () => {
        const isPwd = password.type === 'password';
        password.type = isPwd ? 'text' : 'password';
        toggle.setAttribute('aria-label', isPwd ? 'Ocultar senha' : 'Mostrar senha');
    });
}

if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailVal = (email?.value || '').trim();
        const pwdVal = (password?.value || '').trim();
        if (!emailVal || !pwdVal) {
            alert('Preencha e-mail e senha.');
            return;
        }
        // Validação simples de email
        const ok = /.+@.+\..+/.test(emailVal);
        if (!ok) {
            alert('Informe um e-mail válido.');
            email.focus();
            return;
        }
        // Sucesso simulado
        alert('Login realizado com sucesso!');
        window.location.href = 'exames.html';
    });
}
  