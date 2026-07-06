const API_URL = '/api';

// Utility to handle API calls with JWT
async function apiCall(endpoint, method = 'GET', body = null) {
    const headers = {};
    if (body && !(body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = { method, headers };
    if (body) {
        options.body = body instanceof FormData ? body : JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || data.errors?.[0]?.msg || 'API Error');
        }
        return data;
    } catch (err) {
        throw err;
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
}

function updateNavbar() {
    const nav = document.getElementById('nav-auth');
    if (!nav) return;
    
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        let dashboardLink = '/customer-dashboard.html';
        if (user.role === 'hotel_owner') dashboardLink = '/owner-dashboard.html';
        if (user.role === 'admin') dashboardLink = '/admin-dashboard.html';
        
        // Add a sleek user profile dropdown or inline layout
        nav.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; font-weight: 500;">
                    <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--primary-light); color: white; display: flex; align-items: center; justify-content: center; font-family: var(--font-heading); font-weight: 700;">
                        ${user.name.charAt(0).toUpperCase()}
                    </div>
                    <span style="display: none;">Hello, ${user.name.split(' ')[0]}</span>
                </div>
                <a href="${dashboardLink}" class="btn btn-outline" style="padding: 0.5rem 1.25rem;">Dashboard</a>
                <button onclick="logout()" class="btn btn-primary" style="padding: 0.5rem 1.25rem;">Logout</button>
            </div>
        `;
        
        // Media query logic for hiding name on very small screens via CSS later if needed.
        const span = nav.querySelector('span');
        if (window.innerWidth > 600) span.style.display = 'block';
    } else {
        nav.innerHTML = `
            <div style="display: flex; gap: 1rem;">
                <a href="/login.html" class="btn btn-outline" style="padding: 0.5rem 1.25rem;">Sign In</a>
                <a href="/register.html" class="btn btn-primary" style="padding: 0.5rem 1.25rem;">Register</a>
            </div>
        `;
    }
}

// Simple Toast Notification Utility
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = 'position: fixed; bottom: 2rem; right: 2rem; z-index: 9999; display: flex; flex-direction: column; gap: 1rem;';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'var(--success)' : 'var(--error)';
    toast.style.cssText = `
        background: ${bgColor}; 
        color: white; 
        padding: 1rem 1.5rem; 
        border-radius: var(--radius-md); 
        box-shadow: var(--shadow-lg); 
        font-weight: 500; 
        animation: fadeInUp 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;
    
    const icon = type === 'success' ? 
        `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>` : 
        `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
        
    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Add scroll listener for sticky nav styling
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 10) {
            navbar.style.boxShadow = 'var(--shadow-md)';
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        } else {
            navbar.style.boxShadow = 'var(--shadow-sm)';
            navbar.style.background = 'var(--glass-bg)';
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    
    // Inject mobile hamburger menu
    const navContainer = document.querySelector('.nav-container');
    const navMenu = document.getElementById('main-nav-menu');
    
    if (navContainer && navMenu) {
        const hamburgerBtn = document.createElement('button');
        hamburgerBtn.className = 'hamburger-btn d-none';
        hamburgerBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
        
        // Insert right before auth so it floats correctly
        navContainer.appendChild(hamburgerBtn);
        
        hamburgerBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
});
