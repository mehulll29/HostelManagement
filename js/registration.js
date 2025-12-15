// js/registration.js
document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('studentRegistrationForm');
    const roomPreference = document.getElementById('roomPreference');
    const availableRooms = document.getElementById('availableRooms');
    const roomsList = document.getElementById('roomsList');
    
    // Load available rooms when preference is selected
    if (roomPreference) {
        roomPreference.addEventListener('change', function() {
            loadAvailableRooms(this.value);
        });
    }
    
    function loadAvailableRooms(preference) {
        const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
        const available = rooms.filter(room => 
            room.type === preference && room.occupiedBeds < room.capacity
        );
        
        roomsList.innerHTML = '';
        
        if (available.length === 0) {
            roomsList.innerHTML = '<p>No rooms available for selected preference</p>';
            availableRooms.style.display = 'block';
            return;
        }
        
        available.forEach(room => {
            const roomDiv = document.createElement('div');
            roomDiv.className = 'room-option';
            roomDiv.innerHTML = `
                <input type="radio" name="selectedRoom" id="room_${room.number}" value="${room.number}" required>
                <label for="room_${room.number}">
                    <strong>Room ${room.number}</strong><br>
                    Type: ${room.type} | Available Beds: ${room.capacity - room.occupiedBeds}/${room.capacity}
                </label>
            `;
            roomsList.appendChild(roomDiv);
        });
        
        availableRooms.style.display = 'block';
    }
    
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate passwords match
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            // Get selected room
            const selectedRoom = document.querySelector('input[name="selectedRoom"]:checked');
            if (!selectedRoom) {
                alert('Please select a room!');
                return;
            }
            
            const studentData = {
                id: Date.now(),
                fullName: document.getElementById('fullName').value,
                dateOfBirth: document.getElementById('dateOfBirth').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                password: password,
                collegeName: document.getElementById('collegeName').value,
                course: document.getElementById('course').value,
                semester: document.getElementById('semester').value,
                rollNumber: document.getElementById('rollNumber').value,
                fatherName: document.getElementById('fatherName').value,
                fatherPhone: document.getElementById('fatherPhone').value,
                roomAllocated: selectedRoom.value,
                status: 'active',
                registrationDate: new Date().toISOString(),
                role: 'student'
            };
            
            // Save student to users for login
            const users = JSON.parse(localStorage.getItem('users')) || [];
            users.push({
                id: studentData.id,
                fullName: studentData.fullName,
                email: studentData.email,
                password: studentData.password,
                role: 'student'
            });
            localStorage.setItem('users', JSON.stringify(users));
            
            // Save student details
            const students = JSON.parse(localStorage.getItem('students')) || [];
            students.push(studentData);
            localStorage.setItem('students', JSON.stringify(students));
            
            // Update room occupancy
            updateRoomOccupancy(selectedRoom.value);
            
            alert('Student registered successfully!');
            registrationForm.reset();
            availableRooms.style.display = 'none';
        });
    }
    
    function updateRoomOccupancy(roomNumber) {
        const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
        const room = rooms.find(r => r.number === roomNumber);
        
        if (room && room.occupiedBeds < room.capacity) {
            room.occupiedBeds++;
            localStorage.setItem('rooms', JSON.stringify(rooms));
        }
    }
});