document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('register-form');
    const registerBtn = document.getElementById('register-button');
    const messageDiv = document.getElementById('register-message');
    const usernameInput = document.getElementById('reg-username');
    const passwordInput = document.getElementById('reg-password');

    [usernameInput, passwordInput].forEach(input => {
        input.addEventListener('focus', () => input.style.outline = '2px solid #007BFF');
        input.addEventListener('blur', () => input.style.outline = '');
    });

    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        messageDiv.textContent = '';
        registerBtn.disabled = true;
        registerBtn.textContent = 'Creating...';

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            messageDiv.style.color = '#d32f2f';
            messageDiv.textContent = 'Please enter both username and password.';
            registerBtn.disabled = false;
            registerBtn.textContent = 'Create Account';
            return;
        }

        fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        .then(async res => {
            let data;
            try {
                data = await res.json();
            } catch {
                throw new Error('Invalid server response');
            }
            if (res.ok && data.success) {
                messageDiv.style.color = '#28a745';
                messageDiv.textContent = data.message + ' Redirecting to login...';
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                messageDiv.style.color = '#d32f2f';
                messageDiv.textContent = data && data.message ? data.message : 'Registration failed.';
                registerBtn.disabled = false;
                registerBtn.textContent = 'Create Account';
            }
        })
        .catch(() => {
            messageDiv.style.color = '#d32f2f';
            messageDiv.textContent = 'Unable to connect to server. Please try again later.';
            registerBtn.disabled = false;
            registerBtn.textContent = 'Create Account';
        });
    });
});
