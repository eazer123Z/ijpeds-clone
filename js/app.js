// ===== APP STATE =====
let currentUser = JSON.parse(localStorage.getItem('ijpeds_user')) || null;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
});

// ===== AUTH-AWARE NAV =====
function updateAuthUI() {
    const navGuest = document.getElementById('navGuest');
    const navUser = document.getElementById('navUser');
    const headerUser = document.getElementById('headerUser');
    
    if (currentUser) {
        if (navGuest) navGuest.style.display = 'none';
        if (navUser) navUser.style.display = 'inline';
        if (headerUser) headerUser.innerHTML = '<i class="fas fa-user"></i> ' + currentUser.firstName + ' ' + currentUser.lastName;
    } else {
        if (navGuest) navGuest.style.display = 'inline';
        if (navUser) navUser.style.display = 'none';
        if (headerUser) headerUser.innerHTML = '';
    }
}

// ===== SEARCH =====
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
    if (results.length === 0) { container.innerHTML = '<p style="color:#999;">No results found.</p>'; return; }
    container.innerHTML = '<p style="font-size:12px;color:#777;margin-bottom:12px;">Found ' + results.length + ' result(s)</p>' +
        results.map(a => '<div class="search-result-item"><div class="title"><a href="article.html" onclick="localStorage.setItem(\'ijpeds_view\',JSON.stringify(articles.find(x=>x.id===' + a.id + ')));">' + a.title + '</a></div><div class="meta">' + a.authors + ' — ' + a.journal + '. ' + a.year + '</div></div>').join('');
}
document.getElementById('pageSearchInput')?.addEventListener('keypress', e => { if (e.key === 'Enter') doPageSearch(); });

function doSearch() {
    const q = document.getElementById('searchInput')?.value?.trim();
    if (q) { localStorage.setItem('ijpeds_search', q); window.location.href = 'p/search.html'; }
}
document.getElementById('searchInput')?.addEventListener('keypress', e => { if (e.key === 'Enter') doSearch(); });

// ===== LOGIN =====
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
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
}

// ===== REGISTER =====
function handleRegister(e) {
    e.preventDefault();
    clearErrors('registerForm');
    const fn = document.getElementById('regFirstName').value.trim();
    const ln = document.getElementById('regLastName').value.trim();
    const un = document.getElementById('regUsername').value.trim();
    const em = document.getElementById('regEmail').value.trim();
    const pw = document.getElementById('regPassword').value;
    const cf = document.getElementById('regConfirm').value;
    const orc = document.getElementById('regOrcid')?.value?.trim() || '';
    const inst = document.getElementById('regInstitution')?.value?.trim() || '';
    const co = document.getElementById('regCountry')?.value || '';
    let v = true;
    if (!fn) { showErr('regFirstName', 'Required'); v = false; }
    if (!ln) { showErr('regLastName', 'Required'); v = false; }
    if (!un) { showErr('regUsername', 'Required'); v = false; }
    if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { showErr('regEmail', 'Valid email required'); v = false; }
    if (!pw || pw.length < 6) { showErr('regPassword', 'Min 6 chars'); v = false; }
    if (pw !== cf) { showErr('regConfirm', 'Mismatch'); v = false; }
    if (!v) return;

    const users = JSON.parse(localStorage.getItem('ijpeds_users') || '[]');
    if (users.find(u => u.email === em)) { const el = document.getElementById('registerError'); el.textContent = 'Email already registered.'; el.classList.add('show'); return; }
    if (users.find(u => u.username === un)) { const el = document.getElementById('registerError'); el.textContent = 'Username already taken.'; el.classList.add('show'); return; }

    const user = { id: Date.now(), firstName: fn, lastName: ln, username: un, email: em, password: pw, orcid: orc, institution: inst, country: co, createdAt: new Date().toISOString() };
    users.push(user);
    localStorage.setItem('ijpeds_users', JSON.stringify(users));
    currentUser = user;
    localStorage.setItem('ijpeds_user', JSON.stringify(user));
    showToast('success', 'Account created! Redirecting...');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
}

// ===== LOGOUT =====
function logout() {
    currentUser = null;
    localStorage.removeItem('ijpeds_user');
    showToast('success', 'Logged out.');
    setTimeout(() => { window.location.href = '../index.html'; }, 500);
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
