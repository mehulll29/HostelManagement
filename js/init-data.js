// js/init-data.js
function initializeSampleData() {
    try {
        // Initialize rooms if not exists (guard if RoomManager missing)
        if (!localStorage.getItem('rooms')) {
            if (typeof RoomManager !== 'undefined' && typeof RoomManager.initializeRooms === 'function') {
                RoomManager.initializeRooms();
            } else {
                // create a minimal default rooms array to avoid blocking later logic
                const defaultRooms = [
                    { number: 'A-101', type: 'single', capacity: 1, occupiedBeds: 0 },
                    { number: 'A-102', type: 'double', capacity: 2, occupiedBeds: 0 }
                ];
                localStorage.setItem('rooms', JSON.stringify(defaultRooms));
            }
        } else {
            // Migrate old room types if necessary
            const rooms = JSON.parse(localStorage.getItem('rooms'));
            let updated = false;
            rooms.forEach(room => {
                if (room.type === 'single') {
                    room.type = 'AC';
                    updated = true;
                } else if (room.type === 'double') {
                    room.type = 'Non-AC';
                    updated = true;
                }
            });
            if (updated) {
                localStorage.setItem('rooms', JSON.stringify(rooms));
            }
        }
    } catch (err) {
        // Log and continue — do not let initialization stop the rest of the setup
        console.error('initializeSampleData: error initializing rooms', err);
    }
    
    // Initialize sample complaints
    if (!localStorage.getItem('complaints')) {
        const sampleComplaints = [
            {
                id: 1,
                studentId: 1,
                studentName: 'Sample Student',
                title: 'Leaking Tap in Bathroom',
                category: 'plumbing',
                description: 'The tap in bathroom A-101 is leaking continuously.',
                priority: 'medium',
                status: 'submitted',
                submittedDate: new Date().toISOString(),
                assignedTo: null,
                resolutionDate: null
            }
        ];
        localStorage.setItem('complaints', JSON.stringify(sampleComplaints));
    }
    
    // Ensure an admin user exists (add if missing)
    (function ensureAdmin() {
        const adminUser = {
            id: 1,
            fullName: 'System Administrator',
            email: 'admin@hostelhub.com',
            password: 'admin123',
            role: 'admin',
            phone: '+919876543210',
            createdAt: new Date().toISOString()
        };

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const hasAdmin = users.some(u => u.role === 'admin' && u.email === adminUser.email);

        if (!hasAdmin) {
            // assign a safe unique id if other users exist
            const maxId = users.length ? Math.max(...users.map(u => u.id || 0)) : 0;
            adminUser.id = maxId < 1 ? 1 : maxId + 1;
            users.unshift(adminUser);
            localStorage.setItem('users', JSON.stringify(users));
        } else {
            // if users existed but 'users' key was absent earlier flow handled above,
            // ensure we persist existing users (no-op otherwise)
            if (!localStorage.getItem('users')) {
                localStorage.setItem('users', JSON.stringify(users));
            }
        }
    })();
    
    // Initialize sample leaves
    if (!localStorage.getItem('leaves')) {
        const sampleLeaves = [
            {
                id: 1,
                studentId: 1,
                studentName: 'Sample Student',
                fromDate: new Date(Date.now() + 86400000).toISOString(),
                toDate: new Date(Date.now() + 172800000).toISOString(),
                destination: 'Home Town',
                reason: 'Family function',
                parentContact: '+919876543210',
                status: 'active',
                appliedDate: new Date().toISOString()
            }
        ];
        localStorage.setItem('leaves', JSON.stringify(sampleLeaves));
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