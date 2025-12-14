document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const loginBtn = document.getElementById('login-button');
    const forgotBtn = document.getElementById('forgot-button');
    const createBtn = document.getElementById('create_new_account-button');
    const messageDiv = document.getElementById('login-message');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    // Accessibility: focus style
    [usernameInput, passwordInput].forEach(input => {
        input.addEventListener('focus', () => input.style.outline = '2px solid #007BFF');
        input.addEventListener('blur', () => input.style.outline = '');
    });

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        messageDiv.textContent = '';
        loginBtn.disabled = true;
        loginBtn.textContent = 'Logging in...';

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Use fetch to POST to backend for real login
        fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // Save username for profile display
                localStorage.setItem('conview-username', username);
                messageDiv.style.color = '#28a745';
                messageDiv.textContent = `Welcome, ${username}!`;
                loginBtn.textContent = 'Success!';
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 1000);
            } else {
                messageDiv.style.color = '#d32f2f';
                messageDiv.textContent = data.message || 'Login failed.';
                loginBtn.disabled = false;
                loginBtn.textContent = 'Log in';
            }
        })
        .catch(() => {
            messageDiv.style.color = '#d32f2f';
            messageDiv.textContent = 'Server error. Try again later.';
            loginBtn.disabled = false;
            loginBtn.textContent = 'Log in';
        });
    });

    forgotBtn.addEventListener('click', function () {
        messageDiv.style.color = '#007BFF';
        messageDiv.textContent = 'Password reset link will be available soon.';
    });

    createBtn.addEventListener('click', function () {
        messageDiv.style.color = '';
        messageDiv.textContent = 'Account creation will be available soon.';
    });
});