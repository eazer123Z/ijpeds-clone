// ===== APP STATE =====
let currentUser = readStorageJSON('ijpeds_user', null);
const previewMode = new URLSearchParams(window.location.search).get('preview') === '1';
const previewUser = previewMode ? {
    id: 999001,
    firstName: 'Alicia',
    lastName: 'Hartono',
    username: 'alicia.hartono',
    email: 'alicia.hartono@example.com',
    institution: 'Makassar Pediatric Research Center',
    country: 'Indonesia'
} : null;
const previewDraft = previewMode ? {
    type: 'Article',
    lang: 'English',
    title: 'Integrated Telehealth Monitoring for Childhood Asthma Management in Urban Clinics',
    abstract: 'This study evaluates a telehealth-assisted asthma monitoring workflow for pediatric patients across three urban clinics. The intervention combines weekly symptom tracking, caregiver education, and early warning review by clinicians to improve continuity of care and reduce avoidable acute episodes.',
    authors: 'Hartono A, Pranata R, Siregar M',
    keywords: 'Pediatrics, Telehealth, Asthma, Child Health',
    references: 'Hartono A. Pediatric telehealth pathways. 2025.\nPranata R. Asthma adherence in children. 2024.',
    comments: 'Preview mode for design import.',
    file: 'ijpeds-telehealth-manuscript.docx',
    step: 4
} : null;
const previewSubmissions = previewMode ? [
    {
        id: 88001,
        userId: 999001,
        title: 'Integrated Telehealth Monitoring for Childhood Asthma Management in Urban Clinics',
        type: 'Article',
        status: 'Awaiting Assignment',
        submittedAt: '2026-04-05T07:06:42.000Z'
    },
    {
        id: 88002,
        userId: 999001,
        title: 'Nutrition Adherence Patterns in School-Age Children During Community-Based Intervention',
        type: 'Review',
        status: 'In Review',
        submittedAt: '2026-03-18T03:15:00.000Z'
    }
] : [];

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    enhanceUI();
    hydrateSearchState();
    preservePreviewLinks();
});

// ===== AUTH-AWARE NAV =====
function updateAuthUI() {
    const navGuest = document.getElementById('navGuest');
    const navUser = document.getElementById('navUser');
    const headerUser = document.getElementById('headerUser');
    const sessionUser = getSessionUser();
    
    if (sessionUser) {
        if (navGuest) navGuest.style.display = 'none';
        if (navUser) navUser.style.display = 'flex';
        if (headerUser) headerUser.innerHTML = '<i class="fas fa-user"></i> ' + sessionUser.firstName + ' ' + sessionUser.lastName;
    } else {
        if (navGuest) navGuest.style.display = 'flex';
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
    container.classList.add('search-results-list');
    if (results.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-search"></i><div class="empty-state-title">No results found</div><p>Try another keyword, author name, or broader topic.</p></div>';
        return;
    }
    container.innerHTML = '<div class="search-results-summary">Found ' + results.length + ' result(s)</div>' +
        results.map(a => '<div class="search-result-item"><div class="title"><a href="article.html" onclick="localStorage.setItem(\'ijpeds_view\',JSON.stringify(articles.find(x=>x.id===' + a.id + ')));">' + a.title + '</a></div><div class="meta">' + a.authors + ' — ' + a.journal + '. ' + a.year + '</div><div class="snippet">' + a.abstract.slice(0, 180) + '...</div></div>').join('');
}
document.getElementById('pageSearchInput')?.addEventListener('keypress', e => { if (e.key === 'Enter') doPageSearch(); });

function doSearch() {
    const q = document.getElementById('searchInput')?.value?.trim();
    if (!q) return;
    localStorage.setItem('ijpeds_search', q);
    const isSubPage = window.location.pathname.includes('/p/');
    redirectTo(isSubPage ? 'search.html' : 'p/search.html');
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
    setTimeout(() => { redirectTo('dashboard.html'); }, 800);
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
    setTimeout(() => { redirectTo('dashboard.html'); }, 800);
}

// ===== LOGOUT =====
function logout() {
    currentUser = null;
    localStorage.removeItem('ijpeds_user');
    showToast('success', 'Logged out.');
    setTimeout(() => {
        const isSubPage = window.location.pathname.includes('/p/');
        redirectTo(isSubPage ? '../index.html' : 'index.html');
    }, 500);
}

function readStorageJSON(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch (error) {
        return fallback;
    }
}

function isPreviewMode() {
    return previewMode;
}

function appendPreview(url) {
    if (!previewMode || !url) return url;
    if (/^(#|https?:|mailto:|tel:|javascript:)/i.test(url)) return url;
    const [base, hash] = url.split('#');
    if (/[?&]preview=1(?:&|$)/.test(base)) return url;
    const separator = base.includes('?') ? '&' : '?';
    return base + separator + 'preview=1' + (hash ? '#' + hash : '');
}

function redirectTo(url) {
    window.location.href = appendPreview(url);
}

function preservePreviewLinks() {
    if (!previewMode) return;
    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        link.setAttribute('href', appendPreview(href));
    });
}

function getSessionUser() {
    return currentUser || previewUser;
}

function getDraftSubmission() {
    const storedDraft = readStorageJSON('ijpeds_draft', null);
    if (storedDraft && Object.keys(storedDraft).length > 0) return storedDraft;
    return previewDraft ? { ...previewDraft } : {};
}

function getUserSubmissions(userId) {
    const storedSubmissions = readStorageJSON('ijpeds_submissions', []);
    if (storedSubmissions.length > 0) return storedSubmissions.filter(item => item.userId === userId);
    return previewSubmissions.filter(item => item.userId === userId);
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
function enhanceUI() {
    const body = document.body;
    const pageKey = (window.location.pathname.split('/').pop() || 'index.html').replace('.html', '');
    body.dataset.page = pageKey;
    body.dataset.preview = previewMode ? 'true' : 'false';
    if (document.querySelector('.sidebar')) body.classList.add('has-sidebar');
    document.querySelectorAll('.sidebar-block-header').forEach(header => {
        const text = header.textContent.trim().toLowerCase();
        const iconMap = {
            'citation analysis': 'fa-chart-line',
            'quick links': 'fa-bolt',
            'follow us on': 'fa-share-nodes',
            'journal content': 'fa-book-open',
            'information': 'fa-circle-info'
        };
        const iconName = iconMap[text];
        if (!iconName || header.querySelector('i')) return;
        header.innerHTML = '<i class="fas ' + iconName + '"></i><span>' + header.textContent + '</span>';
    });
    document.querySelectorAll('.content-card-no-border').forEach(card => card.classList.add('surface-panel'));
    document.querySelectorAll('.card-lite').forEach(card => card.classList.add('surface-panel'));
    document.querySelectorAll('.sidebar-block-body strong').forEach(label => label.classList.add('sidebar-label'));
    document.querySelectorAll('.search-form[style]').forEach(form => form.classList.add('sidebar-search-form'));
    document.querySelectorAll('.main-content form > p:first-child').forEach(paragraph => paragraph.classList.add('form-intro-text'));
    const completionPanel = document.querySelector('.main-content > div[style*="text-align:center"]');
    if (completionPanel) completionPanel.classList.add('completion-panel');
    const searchResults = document.getElementById('searchResults');
    if (searchResults && !searchResults.querySelector('.empty-state')) {
        const introText = searchResults.querySelector('p');
        if (introText) {
            introText.outerHTML = '<div class="empty-state"><i class="fas fa-magnifying-glass"></i><div class="empty-state-title">Search the journal archive</div><p>Enter keywords to find articles, authors, and abstracts.</p></div>';
        }
    }
}
function hydrateSearchState() {
    const pageSearchInput = document.getElementById('pageSearchInput');
    const savedQuery = localStorage.getItem('ijpeds_search');
    if (!pageSearchInput || !savedQuery) return;
    pageSearchInput.value = savedQuery;
    doPageSearch();
    localStorage.removeItem('ijpeds_search');
}
