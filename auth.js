// js/auth.js - Enhanced version
class AuthSystem {
    static registerUser(userData) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const existingUser = users.find(user => user.email === userData.email);
        
        if (existingUser) {
            throw new Error('User already exists');
        }
        
        userData.id = Date.now();
        userData.role = userData.role || 'student';
        userData.createdAt = new Date().toISOString();
        
        users.push(userData);
        localStorage.setItem('users', JSON.stringify(users));
        return userData;
    }
    
    static loginUser(identifier, password, role) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const normalizedIdentifier = identifier ? identifier.trim().toLowerCase() : '';
        const desiredRole = role || 'student';

        const user = users.find(u => {
            const emailMatch = u.email && u.email.toLowerCase() === normalizedIdentifier;
            const usernameMatch = u.username && u.username.toLowerCase() === normalizedIdentifier;
            const credentialMatch = (emailMatch || usernameMatch) && u.password === password;
            const roleMatch = !u.role ? desiredRole === 'student' : u.role === desiredRole;
            return credentialMatch && roleMatch;
        });
        
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            return user;
        }
        return null;
    }
    
    static getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser'));
    }
    
    static logout() {
        localStorage.removeItem('currentUser');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const roleOptions = document.querySelectorAll('.role-option');
    const roleInput = document.getElementById('role');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');

    let selectedRole = roleInput ? roleInput.value : 'student';

    roleOptions.forEach(option => {
        option.addEventListener('click', () => {
            roleOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            selectedRole = option.dataset.role;
            if (roleInput) {
                roleInput.value = selectedRole;
            }
        });
    });

    if (loginForm) {
        loginForm.addEventListener('submit', event => {
            event.preventDefault();

            const identifierInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');

            const identifier = identifierInput ? identifierInput.value.trim() : '';
            const password = passwordInput ? passwordInput.value : '';
            const role = selectedRole || (roleInput ? roleInput.value : 'student');

            if (loginError) {
                loginError.textContent = '';
                loginError.style.display = 'none';
            }

            if (!identifier || !password) {
                if (loginError) {
                    loginError.textContent = 'Please enter both username/email and password.';
                    loginError.style.display = 'block';
                }
                return;
            }

            const user = AuthSystem.loginUser(identifier, password, role);

            if (user) {
                const redirectMap = {
                    student: 'dashboard.html',
                    warden: 'dashboard.html',
                    admin: 'dashboard.html'
                };

                const redirectTarget = redirectMap[role] || 'dashboard.html';
                window.location.href = redirectTarget;
            } else if (loginError) {
                loginError.textContent = 'Invalid credentials for the selected role.';
                loginError.style.display = 'block';
            } else {
                alert('Invalid credentials for the selected role.');
            }
        });
    }
});