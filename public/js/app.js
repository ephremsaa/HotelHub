const API_URL = '/api';

// Utility to handle API calls with JWT
async function apiCall(endpoint, method = 'GET', body = null) {
    const headers = {
        'Content-Type': 'application/json'
    };
    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(`${API_URL}${endpoint}`, options);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || data.errors?.[0]?.msg || 'API Error');
    }
    return data;
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
}

function updateNav() {
    const nav = document.getElementById('nav-links');
    if (!nav) return;
    
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        nav.innerHTML = `
            <span>Welcome, ${user.name} (${user.role})</span>
            <a href="/dashboard.html">Dashboard</a>
            <a href="#" onclick="logout()">Logout</a>
        `;
    } else {
        nav.innerHTML = `
            <a href="/login.html">Login</a>
            <a href="/register.html">Register</a>
        `;
    }
}

document.addEventListener('DOMContentLoaded', updateNav);
