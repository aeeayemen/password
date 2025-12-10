document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const addSecretForm = document.getElementById('addSecretForm');
    const secretsList = document.getElementById('secretsList');
    const logoutBtn = document.getElementById('logoutBtn');

    // Static Credentials
    const STATIC_USER = 'anas';
    const STATIC_PASS = 'OpensoftYe@anas#770300304';

    // Check auth on page load
    const isDashboard = window.location.pathname.includes('dashboard.html');
    const isLogin = window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/');

    if (isDashboard && !localStorage.getItem('isLoggedIn')) {
        window.location.href = 'index.html';
        return;
    }

    if (isLogin && localStorage.getItem('isLoggedIn')) {
        window.location.href = 'dashboard.html';
        return;
    }

    // Toast notification
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        // Trigger reflow
        toast.offsetHeight;

        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            const user = formData.get('username');
            const pass = formData.get('password');

            if (user === STATIC_USER && pass === STATIC_PASS) {
                localStorage.setItem('isLoggedIn', 'true');
                window.location.href = 'dashboard.html';
            } else {
                showToast('Invalid credentials');
            }
        });
    }

    if (addSecretForm) {
        loadSecrets();

        addSecretForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(addSecretForm);

            const newSecret = {
                id: Date.now().toString(),
                service: formData.get('service'),
                username: formData.get('username'),
                password: formData.get('password'),
                created_at: new Date().toISOString()
            };

            const secrets = getSecrets();
            secrets.push(newSecret);
            saveSecrets(secrets);

            addSecretForm.reset();
            loadSecrets();
            showToast('Secret saved successfully');
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('isLoggedIn');
            window.location.href = 'index.html';
        });
    }

    function getSecrets() {
        const secrets = localStorage.getItem('secrets');
        return secrets ? JSON.parse(secrets) : [];
    }

    function saveSecrets(secrets) {
        localStorage.setItem('secrets', JSON.stringify(secrets));
    }

    function loadSecrets() {
        if (!secretsList) return;

        const secrets = getSecrets();
        renderSecrets(secrets);
    }

    function renderSecrets(secrets) {
        secretsList.innerHTML = '';

        if (secrets.length === 0) {
            secretsList.innerHTML = '<p style="text-align:center; color:#64748b;">No secrets saved yet.</p>';
            return;
        }

        secrets.forEach(secret => {
            const item = document.createElement('div');
            item.className = 'secret-item';
            item.innerHTML = `
                <div class="secret-info">
                    <div class="secret-title">${escapeHtml(secret.service)}</div>
                    <div class="secret-username">${escapeHtml(secret.username)}</div>
                </div>
                <button class="copy-btn" data-pass="${escapeHtml(secret.password)}">
                    Copy Password
                </button>
            `;
            secretsList.appendChild(item);
        });

        // Add copy event listeners
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const pass = btn.getAttribute('data-pass');
                navigator.clipboard.writeText(pass).then(() => {
                    showToast('Password copied!');
                });
            });
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});
