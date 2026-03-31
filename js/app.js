// ===== APP STATE =====
let currentUser = JSON.parse(localStorage.getItem('ijpeds_user')) || null;
let displayedArticles = 5;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    if (document.getElementById('articlesList')) renderArticles();
    if (document.getElementById('mostRead')) renderMostRead();
    if (document.getElementById('alertsList')) renderAlerts();
    if (document.getElementById('archiveGrid')) renderArchive();
});

// ===== ARTICLES =====
function renderArticles(filter = 'all') {
    const list = document.getElementById('articlesList');
    if (!list) return;
    
    const filtered = filter === 'all' ? articles : articles.filter(a => a.type === filter);
    const toShow = filtered.slice(0, displayedArticles);
    
    list.innerHTML = toShow.map(a => `
        <div class="article-card" data-type="${a.type}">
            <span class="article-type type-${a.type}">${a.typeLabel}</span>
            <h3><a href="#" onclick="viewArticle(${a.id}); return false;">${a.title}</a></h3>
            <p class="article-authors">${a.authors}</p>
            <div class="article-meta">
                <span><i class="fas fa-book"></i> ${a.journal}</span>
                <span><i class="fas fa-calendar"></i> ${a.year}; Vol.${a.volume}(${a.issue}):${a.pages}</span>
                <span><i class="fas fa-eye"></i> ${a.views}</span>
                <span><i class="fas fa-download"></i> ${a.downloads}</span>
            </div>
            <button class="abstract-toggle" onclick="toggleAbstract(this)">
                <i class="fas fa-chevron-down"></i> Show Abstract
            </button>
            <div class="article-abstract">
                <p>${a.abstract}</p>
            </div>
        </div>
    `).join('');
    
    // Show/hide load more
    const loadBtn = document.querySelector('.load-more');
    if (loadBtn) {
        loadBtn.style.display = filtered.length > displayedArticles ? 'block' : 'none';
    }
}

function filterArticles(type, btn) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    displayedArticles = 5;
    renderArticles(type);
}

function loadMoreArticles() {
    displayedArticles += 5;
    const activeTab = document.querySelector('.tab.active');
    const type = activeTab ? activeTab.textContent.toLowerCase().replace(/\s+/g, '') : 'all';
    const typeMap = { 'all': 'all', 'editorial': 'editorial', 'casereports': 'case', 'reviewarticles': 'review', 'originalarticles': 'original', 'letterstoeditor': 'letter' };
    renderArticles(typeMap[type] || 'all');
}

function toggleAbstract(btn) {
    const abstract = btn.nextElementSibling;
    abstract.classList.toggle('show');
    btn.innerHTML = abstract.classList.contains('show') 
        ? '<i class="fas fa-chevron-up"></i> Hide Abstract'
        : '<i class="fas fa-chevron-down"></i> Show Abstract';
}

function viewArticle(id) {
    const article = articles.find(a => a.id === id);
    if (!article) return;
    localStorage.setItem('ijpeds_view', JSON.stringify(article));
    window.location.href = 'pages/article.html';
}

// ===== MOST READ =====
function renderMostRead() {
    const list = document.getElementById('mostRead');
    if (!list) return;
    list.innerHTML = mostReadArticles.map(title => `
        <li><a href="#">${title}</a></li>
    `).join('');
}

// ===== ALERTS =====
function renderAlerts() {
    const list = document.getElementById('alertsList');
    if (!list) return;
    list.innerHTML = alertsData.map(a => `
        <div class="alert-item alert-${a.type}">
            <div class="alert-icon"><i class="${a.icon}"></i></div>
            <div>
                <h4>${a.title}</h4>
                <p>${a.message}</p>
                <span class="alert-date"><i class="fas fa-clock"></i> ${a.date}</span>
            </div>
        </div>
    `).join('');
}

// ===== ARCHIVE =====
function renderArchive() {
    const grid = document.getElementById('archiveGrid');
    if (!grid) return;
    grid.innerHTML = archiveVolumes.map(v => `
        <div class="archive-volume">
            <div class="volume-header">
                <h3>${v.volume}</h3>
                <span>${v.year}</span>
            </div>
            <div class="volume-issues">
                ${v.issues.map(i => `
                    <a href="#"><i class="fas fa-file-alt"></i> ${i.label} (${i.articles} articles)</a>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// ===== SEARCH =====
function searchArticles() {
    const q = document.getElementById('searchInput').value.toLowerCase().trim();
    if (!q) { renderArticles(); return; }
    
    const list = document.getElementById('articlesList');
    if (!list) return;
    
    const results = articles.filter(a => 
        a.title.toLowerCase().includes(q) || 
        a.authors.toLowerCase().includes(q) ||
        a.abstract.toLowerCase().includes(q)
    );
    
    if (results.length === 0) {
        list.innerHTML = `
            <div class="article-card" style="text-align:center; padding:40px;">
                <i class="fas fa-search" style="font-size:2rem; color:#94a3b8; margin-bottom:12px;"></i>
                <h3 style="color:#64748b;">No results found for "${q}"</h3>
                <p style="color:#94a3b8;">Try different keywords or browse the archive.</p>
            </div>`;
        return;
    }
    
    list.innerHTML = results.map(a => `
        <div class="article-card" data-type="${a.type}">
            <span class="article-type type-${a.type}">${a.typeLabel}</span>
            <h3><a href="#" onclick="viewArticle(${a.id}); return false;">${a.title}</a></h3>
            <p class="article-authors">${a.authors}</p>
            <div class="article-meta">
                <span><i class="fas fa-book"></i> ${a.journal}</span>
                <span><i class="fas fa-calendar"></i> ${a.year}; Vol.${a.volume}(${a.issue}):${a.pages}</span>
            </div>
        </div>
    `).join('');
    
    showToast('success', `Found ${results.length} result(s) for "${q}"`);
}

// Enter key search
document.getElementById('searchInput')?.addEventListener('keypress', e => {
    if (e.key === 'Enter') searchArticles();
});

// ===== AUTH UI =====
function updateAuthUI() {
    const userMenu = document.getElementById('userMenu');
    const loggedInMenu = document.getElementById('loggedInMenu');
    const welcomeUser = document.getElementById('welcomeUser');
    
    if (currentUser) {
        if (userMenu) userMenu.style.display = 'none';
        if (loggedInMenu) {
            loggedInMenu.style.display = 'flex';
            welcomeUser.textContent = `Hi, ${currentUser.firstName}`;
        }
    } else {
        if (userMenu) userMenu.style.display = 'block';
        if (loggedInMenu) loggedInMenu.style.display = 'none';
    }
}

// ===== USER DROPDOWN =====
function toggleUserDropdown() {
    document.getElementById('userDropdown').classList.toggle('active');
}

document.addEventListener('click', e => {
    const dropdown = document.getElementById('userDropdown');
    const btn = document.querySelector('.btn-user');
    if (dropdown && btn && !btn.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
    }
});

// ===== MODALS =====
function openModal(id) {
    document.getElementById(id).classList.add('active');
    document.getElementById('userDropdown')?.classList.remove('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
    document.body.style.overflow = '';
    clearFormErrors(id);
}

function switchModal(from, to) {
    closeModal(from);
    setTimeout(() => openModal(to), 150);
}

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// ===== FORM VALIDATION =====
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(pw) {
    return pw.length >= 8;
}

function showFieldError(fieldId, msg) {
    const input = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + 'Error');
    if (input) input.classList.add('error');
    if (error) error.textContent = msg;
}

function clearFormErrors(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    modal.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
    modal.querySelectorAll('.form-error').forEach(el => {
        el.classList.remove('show');
        el.textContent = '';
    });
}

// ===== LOGIN =====
function handleLogin(e) {
    e.preventDefault();
    clearFormErrors('loginModal');
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    let valid = true;
    
    if (!email) {
        showFieldError('loginEmail', 'Email or username is required');
        valid = false;
    }
    if (!password) {
        showFieldError('loginPassword', 'Password is required');
        valid = false;
    }
    
    if (!valid) return;
    
    // Check stored users
    const users = JSON.parse(localStorage.getItem('ijpeds_users') || '[]');
    const user = users.find(u => (u.email === email || u.username === email) && u.password === password);
    
    if (!user) {
        const errorEl = document.getElementById('loginError');
        errorEl.textContent = 'Invalid email/username or password. Please check your credentials.';
        errorEl.classList.add('show');
        return;
    }
    
    // Login success
    currentUser = user;
    localStorage.setItem('ijpeds_user', JSON.stringify(user));
    updateAuthUI();
    closeModal('loginModal');
    showToast('success', `Welcome back, ${user.firstName}!`);
    document.getElementById('loginForm').reset();
}

// ===== REGISTER =====
function handleRegister(e) {
    e.preventDefault();
    clearFormErrors('registerModal');
    
    const firstName = document.getElementById('regFirstName').value.trim();
    const lastName = document.getElementById('regLastName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const institution = document.getElementById('regInstitution').value.trim();
    const country = document.getElementById('regCountry').value;
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirm').value;
    const terms = document.getElementById('regTerms').checked;
    
    let valid = true;
    
    if (!firstName) { showFieldError('regFirstName', 'First name is required'); valid = false; }
    if (!lastName) { showFieldError('regLastName', 'Last name is required'); valid = false; }
    if (!email) { showFieldError('regEmail', 'Email is required'); valid = false; }
    else if (!validateEmail(email)) { showFieldError('regEmail', 'Please enter a valid email'); valid = false; }
    if (!institution) { showFieldError('regInstitution', 'Institution is required'); valid = false; }
    if (!country) { showFieldError('regCountry', 'Please select a country'); valid = false; }
    if (!password) { showFieldError('regPassword', 'Password is required'); valid = false; }
    else if (!validatePassword(password)) { showFieldError('regPassword', 'Password must be at least 8 characters'); valid = false; }
    if (password !== confirm) { showFieldError('regConfirm', 'Passwords do not match'); valid = false; }
    if (!terms) { showFieldError('regTerms', 'You must accept the terms'); valid = false; }
    
    if (!valid) return;
    
    // Check duplicate
    const users = JSON.parse(localStorage.getItem('ijpeds_users') || '[]');
    if (users.find(u => u.email === email)) {
        const errorEl = document.getElementById('registerError');
        errorEl.textContent = 'This email is already registered. Please login instead.';
        errorEl.classList.add('show');
        return;
    }
    
    // Create user
    const user = {
        id: Date.now(),
        firstName, lastName, email, institution, country,
        username: email.split('@')[0],
        password,
        createdAt: new Date().toISOString()
    };
    
    users.push(user);
    localStorage.setItem('ijpeds_users', JSON.stringify(users));
    
    // Auto-login
    currentUser = user;
    localStorage.setItem('ijpeds_user', JSON.stringify(user));
    updateAuthUI();
    closeModal('registerModal');
    showToast('success', `Account created! Welcome, ${firstName}!`);
    document.getElementById('registerForm').reset();
}

// ===== LOGOUT =====
function logout() {
    currentUser = null;
    localStorage.removeItem('ijpeds_user');
    updateAuthUI();
    showToast('success', 'You have been logged out.');
}

// ===== SUBSCRIBE =====
function subscribe() {
    const email = document.getElementById('subscribeEmail')?.value?.trim();
    if (!email || !validateEmail(email)) {
        showToast('error', 'Please enter a valid email address.');
        return;
    }
    showToast('success', 'Subscribed successfully! You\'ll receive updates on new issues.');
    document.getElementById('subscribeEmail').value = '';
}

// ===== TOAST =====
function showToast(type, message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle'
    };
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="toast-icon ${icons[type]}"></i>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(40px)';
        toast.style.transition = 'all 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ===== MOBILE NAV =====
function toggleMobileNav() {
    document.getElementById('navLinks').classList.toggle('active');
}

// ===== SUBMISSION FORM =====
function handleSubmission(e) {
    e.preventDefault();
    if (!currentUser) {
        showToast('warning', 'Please login or register to submit a manuscript.');
        openModal('loginModal');
        return;
    }
    
    const title = document.getElementById('subTitle')?.value?.trim();
    const type = document.getElementById('subType')?.value;
    const abstract = document.getElementById('subAbstract')?.value?.trim();
    const keywords = document.getElementById('subKeywords')?.value?.trim();
    
    let valid = true;
    if (!title) { showFieldError('subTitle', 'Title is required'); valid = false; }
    if (!type) { showFieldError('subType', 'Article type is required'); valid = false; }
    if (!abstract || abstract.length < 100) { showFieldError('subAbstract', 'Abstract must be at least 100 characters'); valid = false; }
    if (!keywords) { showFieldError('subKeywords', 'Keywords are required'); valid = false; }
    
    if (!valid) return;
    
    // Store submission
    const submissions = JSON.parse(localStorage.getItem('ijpeds_submissions') || '[]');
    submissions.push({
        id: Date.now(),
        userId: currentUser.id,
        title, type, abstract, keywords,
        status: 'Under Review',
        submittedAt: new Date().toISOString()
    });
    localStorage.setItem('ijpeds_submissions', JSON.stringify(submissions));
    
    showToast('success', 'Manuscript submitted successfully! You\'ll receive a confirmation email.');
    document.getElementById('submissionForm')?.reset();
}

// ===== CONTACT FORM =====
function handleContact(e) {
    e.preventDefault();
    
    const name = document.getElementById('contactName')?.value?.trim();
    const email = document.getElementById('contactEmail')?.value?.trim();
    const subject = document.getElementById('contactSubject')?.value?.trim();
    const message = document.getElementById('contactMessage')?.value?.trim();
    
    let valid = true;
    if (!name) { showFieldError('contactName', 'Name is required'); valid = false; }
    if (!email || !validateEmail(email)) { showFieldError('contactEmail', 'Valid email is required'); valid = false; }
    if (!subject) { showFieldError('contactSubject', 'Subject is required'); valid = false; }
    if (!message) { showFieldError('contactMessage', 'Message is required'); valid = false; }
    
    if (!valid) return;
    
    showToast('success', 'Message sent successfully! We\'ll respond within 2-3 business days.');
    document.getElementById('contactForm')?.reset();
}
