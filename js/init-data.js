// js/init-data.js
function initializeSampleData() {
    // Initialize rooms if not exists
    if (!localStorage.getItem('rooms') && typeof RoomManager !== 'undefined' && typeof RoomManager.initializeRooms === 'function') {
        RoomManager.initializeRooms();
    }
    
    // Initialize admin user if not exists
    if (!localStorage.getItem('users')) {
        const adminUser = {
            id: 1,
            fullName: 'System Administrator',
            email: 'admin@hostelhub.com',
            password: 'admin123',
            role: 'admin',
            phone: '+919876543210',
            createdAt: new Date().toISOString()
        };
        localStorage.setItem('users', JSON.stringify([adminUser]));
    }
    
    // Initialize notices if not exists
    if (!localStorage.getItem('notices')) {
        const notices = [
            {
                id: 1,
                title: 'Welcome to HostelHub',
                content: 'New hostel management system launched successfully.',
                category: 'general',
                createdBy: 'admin',
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('notices', JSON.stringify(notices));
    }
}

// Call this when the app loads
document.addEventListener('DOMContentLoaded', initializeSampleData);