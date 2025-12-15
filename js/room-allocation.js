// js/room-allocation.js
class RoomManager {
    static initializeRooms() {
        const rooms = [
            { id: 'A101', number: 'A101', capacity: 2, type: 'AC', occupiedBeds: 0, beds: [] },
            { id: 'A102', number: 'A102', capacity: 2, type: 'AC', occupiedBeds: 0, beds: [] },
            { id: 'A103', number: 'A103', capacity: 2, type: 'AC', occupiedBeds: 0, beds: [] },
            { id: 'B101', number: 'B101', capacity: 3, type: 'Non-AC', occupiedBeds: 0, beds: [] },
            { id: 'B102', number: 'B102', capacity: 3, type: 'Non-AC', occupiedBeds: 0, beds: [] },
            { id: 'B103', number: 'B103', capacity: 3, type: 'Non-AC', occupiedBeds: 0, beds: [] }
        ];
        
        if (!localStorage.getItem('rooms')) {
            localStorage.setItem('rooms', JSON.stringify(rooms));
        }
    }
    
    static loadRoomStats() {
        const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
        const students = JSON.parse(localStorage.getItem('students')) || [];
        
        const totalRooms = rooms.length;
        const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0);
        const occupiedRooms = rooms.reduce((sum, room) => sum + room.occupiedBeds, 0);
        const availableRooms = totalCapacity - occupiedRooms;
        
        document.getElementById('totalRooms').textContent = totalRooms;
        document.getElementById('totalCapacity').textContent = totalCapacity;
        document.getElementById('occupiedRoomsCount').textContent = occupiedRooms;
        document.getElementById('availableRooms').textContent = availableRooms;
        
        // Load room details table
        this.loadRoomDetails(rooms, students);
    }
    
    static loadRoomDetails(rooms, students) {
        const tableBody = document.getElementById('roomsTableBody');
        tableBody.innerHTML = '';
        
        rooms.forEach(room => {
            const row = document.createElement('tr');
            const roomStudents = students.filter(s => s.roomAllocated === room.number);
            
            row.innerHTML = `
                <td>${room.number}</td>
                <td>${room.type}</td>
                <td>${room.capacity}</td>
                <td>${room.occupiedBeds}</td>
                <td>${room.capacity - room.occupiedBeds}</td>
                <td>
                    ${roomStudents.length > 0 ? 
                        roomStudents.map(s => s.fullName).join(', ') : 
                        'No occupants'
                    }
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is admin
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }
    
    RoomManager.initializeRooms();
    RoomManager.loadRoomStats();
});