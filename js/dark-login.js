document.addEventListener('DOMContentLoaded', function() {
    const roleOptions = document.querySelectorAll('.dark-role-option');
    const loginForm = document.getElementById('darkLoginForm');
    const loginBtn = document.getElementById('loginBtn');
    const btnText = document.querySelector('.btn-text');
    
    // Role selection with enhanced effects
    const roleInput = document.getElementById('role');
    const loginError = document.getElementById('loginError');
    
    roleOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            roleOptions.forEach(opt => {
                opt.classList.remove('active');
                opt.style.transform = 'translateY(0)';
            });
            
            // Add active class to clicked option
            this.classList.add('active');
            this.style.transform = 'translateY(-2px)';
            
            // Update hidden role field
            if (roleInput) {
                roleInput.value = this.dataset.role;
            }
            
            // Hide any previous errors
            if (loginError) {
                loginError.style.display = 'none';
            }
            
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: rgba(59, 130, 246, 0.3);
                transform: translate(-50%, -50%);
                animation: ripple 0.6s ease-out;
            `;
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Login form submission with loading state
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('darkUsername').value.trim();
            const password = document.getElementById('darkPassword').value;
            const activeRoleOption = document.querySelector('.dark-role-option.active');
            const selectedRole = activeRoleOption ? activeRoleOption.dataset.role : 'student';
            const rememberMe = document.getElementById('rememberMe').checked;
            
            // Hide previous errors
            if (loginError) {
                loginError.style.display = 'none';
            }
            
            // Validation
            if (!username || !password) {
                showNotification('Please fill in all fields', 'error');
                if (loginError) {
                    loginError.textContent = 'Please fill in all fields';
                    loginError.style.display = 'block';
                }
                return;
            }
            
            // Show loading state
            loginBtn.classList.add('loading');
            btnText.textContent = 'Authenticating...';
            loginBtn.disabled = true;
            
            // Use AuthSystem for actual authentication
            setTimeout(() => {
                try {
                    // Check if AuthSystem is available
                    if (typeof AuthSystem === 'undefined') {
                        throw new Error('Authentication system not loaded');
                    }
                    
                    // Attempt login with role validation
                    const user = AuthSystem.loginUser(username, password, selectedRole);
                    
                    if (user) {
                        // Save login state
                        if (rememberMe) {
                            localStorage.setItem('rememberMe', 'true');
                            localStorage.setItem('username', username);
                        }
                        
                        // Show success animation
                        loginBtn.classList.remove('loading');
                        loginBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                        btnText.textContent = 'Login Successful!';
                        showNotification('Login successful! Redirecting...', 'success');
                        
                        // Redirect after success animation
                        setTimeout(() => {
                            window.location.href = 'dashboard.html';
                        }, 1000);
                    } else {
                        // Login failed
                        loginBtn.classList.remove('loading');
                        btnText.textContent = 'Login to Portal';
                        loginBtn.disabled = false;
                        
                        const errorMsg = 'Invalid credentials for the selected role';
                        showNotification(errorMsg, 'error');
                        if (loginError) {
                            loginError.textContent = errorMsg;
                            loginError.style.display = 'block';
                        }
                    }
                } catch (error) {
                    // Handle errors
                    loginBtn.classList.remove('loading');
                    btnText.textContent = 'Login to Portal';
                    loginBtn.disabled = false;
                    
                    const errorMsg = error.message || 'An error occurred during login';
                    showNotification(errorMsg, 'error');
                    if (loginError) {
                        loginError.textContent = errorMsg;
                        loginError.style.display = 'block';
                    }
                }
            }, 500); // Reduced delay for better UX
        });
    }
    
    // Forgot password handler
    const forgotPasswordLink = document.getElementById('forgotPassword');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Password reset link sent to your email', 'info');
        });
    }
    
    // Load remembered username
    if (localStorage.getItem('rememberMe') === 'true') {
        const savedUsername = localStorage.getItem('username');
        if (savedUsername) {
            document.getElementById('darkUsername').value = savedUsername;
            document.getElementById('rememberMe').checked = true;
        }
    }
    
    // Input focus effects
    const inputs = document.querySelectorAll('.dark-form-control');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
    
    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            color: white;
            font-weight: 500;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        const colors = {
            error: 'linear-gradient(135deg, #ef4444, #dc2626)',
            success: 'linear-gradient(135deg, #10b981, #059669)',
            info: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            warning: 'linear-gradient(135deg, #f59e0b, #d97706)'
        };
        
        notification.style.background = colors[type] || colors.info;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
});

// Add ripple animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            width: 200px;
            height: 200px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);