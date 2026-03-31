// ===== APP STATE =====
let currentUser = JSON.parse(localStorage.getItem('ijpeds_user')) || null;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
});

// ===== SEARCH (page-level) =====
function doPageSearch() {
    const q = document.getElementById('pageSearchInput')?.value?.toLowerCase().trim();
    const scope = document.getElementById('searchScope')?.value || 'All';
    const container = document.getElementById('searchResults');
    if (!q || !container) return;

    const results = (typeof articles !== 'undefined' ? articles : []).filter(a => {
        if (scope === 'Title') return a.title.toLowerCase().includes(q);
        if (scope === 'Author') return a.authors.toLowerCase().includes(q);
        return a.title.toLowerCase().includes(q) || a.authors.toLowerCase().includes(q) || a.abstract.toLowerCase().includes(q);
    });

    if (results.length === 0) {
        container.innerHTML = '<p style="color:#999;font-size:13px;">No results found for "' + q + '".</p>';
        return;
    }

    container.innerHTML = '<p style="font-size:12px;color:#777;margin-bottom:12px;">Found ' + results.length + ' result(s)</p>' +
        results.map(a => '<div class="search-result-item"><div class="title"><a href="article.html" onclick="localStorage.setItem(\'ijpeds_view\',JSON.stringify(articles.find(x=>x.id===' + a.id + ')));">' + a.title + '</a></div><div class="meta">' + a.authors + ' — ' + a.journal + '. ' + a.year + ';' + a.volume + '(' + a.issue + '):' + a.pages + '</div><div class="snippet">' + a.abstract.substring(0, 150) + '...</div></div>').join('');
}

document.getElementById('pageSearchInput')?.addEventListener('keypress', e => {
    if (e.key === 'Enter') doPageSearch();
});

// Header search - redirect to search page
function doSearch() {
    const q = document.getElementById('searchInput')?.value?.trim();
    if (q) {
        localStorage.setItem('ijpeds_search', q);
        window.location.href = (window.location.pathname.includes('/p/') ? '' : 'p/') + 'search.html';
    }
}
document.getElementById('searchInput')?.addEventListener('keypress', e => {
    if (e.key === 'Enter') doSearch();
});

// ===== AUTH =====
function updateAuthUI() {
    // On OJS-style pages, auth is via separate login page
}

function handleLogin(e) {
    e.preventDefault();
    clearErrors('loginForm');
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    let valid = true;
    if (!email) { showErr('loginEmail', 'Required'); valid = false; }
    if (!password) { showErr('loginPassword', 'Required'); valid = false; }
    if (!valid) return;

    const users = JSON.parse(localStorage.getItem('ijpeds_users') || '[]');
    const user = users.find(u => (u.email === email || u.username === email) && u.password === password);
    if (!user) {
        const el = document.getElementById('loginError');
        el.textContent = 'Invalid username or password.';
        el.classList.add('show');
        return;
    }
    currentUser = user;
    localStorage.setItem('ijpeds_user', JSON.stringify(user));
    showToast('success', 'Welcome back, ' + user.firstName + '!');
    setTimeout(() => { window.location.href = '../index.html'; }, 800);
}

function handleRegister(e) {
    e.preventDefault();
    clearErrors('registerForm');
    const fn = document.getElementById('regFirstName').value.trim();
    const ln = document.getElementById('regLastName').value.trim();
    const em = document.getElementById('regEmail').value.trim();
    const inst = document.getElementById('regInstitution').value.trim();
    const co = document.getElementById('regCountry').value;
    const pw = document.getElementById('regPassword').value;
    const cf = document.getElementById('regConfirm').value;
    const tm = document.getElementById('regTerms').checked;
    let v = true;
    if (!fn) { showErr('regFirstName', 'Required'); v = false; }
    if (!ln) { showErr('regLastName', 'Required'); v = false; }
    if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { showErr('regEmail', 'Valid email required'); v = false; }
    if (!inst) { showErr('regInstitution', 'Required'); v = false; }
    if (!co) { showErr('regCountry', 'Required'); v = false; }
    if (!pw || pw.length < 8) { showErr('regPassword', 'Min 8 chars'); v = false; }
    if (pw !== cf) { showErr('regConfirm', 'Mismatch'); v = false; }
    if (!tm) { showErr('regTerms', 'Accept terms'); v = false; }
    if (!v) return;

    const users = JSON.parse(localStorage.getItem('ijpeds_users') || '[]');
    if (users.find(u => u.email === em)) {
        const el = document.getElementById('registerError');
        el.textContent = 'Email already registered.';
        el.classList.add('show');
        return;
    }
    const user = { id: Date.now(), firstName: fn, lastName: ln, email: em, institution: inst, country: co, username: em.split('@')[0], password: pw };
    users.push(user);
    localStorage.setItem('ijpeds_users', JSON.stringify(users));
    currentUser = user;
    localStorage.setItem('ijpeds_user', JSON.stringify(user));
    showToast('success', 'Account created! Redirecting...');
    setTimeout(() => { window.location.href = '../index.html'; }, 800);
}

function logout() {
    currentUser = null;
    localStorage.removeItem('ijpeds_user');
    showToast('success', 'Logged out.');
    setTimeout(() => location.reload(), 500);
}

// ===== HELPERS =====
function showErr(id, msg) {
    document.getElementById(id)?.classList.add('error');
    const e = document.getElementById(id + 'Error');
    if (e) e.textContent = msg;
}
function clearErrors(formId) {
    const f = document.getElementById(formId);
    if (!f) return;
    f.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    f.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
    f.querySelectorAll('.form-error').forEach(el => { el.classList.remove('show'); el.textContent = ''; });
}
function showToast(type, message) {
    const c = document.getElementById('toastContainer');
    if (!c) return;
    const icons = { success: 'fas fa-check-circle', error: 'fas fa-exclamation-circle', warning: 'fas fa-exclamation-triangle' };
    const t = document.createElement('div');
    t.className = 'toast ' + type;
    t.innerHTML = '<i class="toast-icon ' + icons[type] + '"></i><span class="toast-message">' + message + '</span><button class="toast-close" onclick="this.parentElement.remove()">&times;</button>';
    c.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity 0.3s'; setTimeout(() => t.remove(), 300); }, 3500);
}
