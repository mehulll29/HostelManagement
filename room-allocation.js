// js/room-allocation.js
class RoomManager {
    static initializeRooms() {
        const rooms = [
            { id: 'A101', number: 'A101', capacity: 2, type: 'AC', occupiedBeds: 0, beds: [] },
            { id: 'A102', number: 'A102', capacity: 2, type: 'AC', occupiedBeds: 0, beds: [] },
            { id: 'B101', number: 'B101', capacity: 3, type: 'Non-AC', occupiedBeds: 0, beds: [] },
            { id: 'B102', number: 'B102', capacity: 3, type: 'Non-AC', occupiedBeds: 0, beds: [] }
        ];
        
        if (!localStorage.getItem('rooms')) {
            localStorage.setItem('rooms', JSON.stringify(rooms));
        }
    }
    
    static allocateRoom(studentId, roomNumber) {
        const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
        const room = rooms.find(r => r.number === roomNumber);
        const students = JSON.parse(localStorage.getItem('students')) || [];
        const student = students.find(s => s.id === studentId);
        
        if (room && room.occupiedBeds < room.capacity && student) {
            const bedNumber = room.occupiedBeds + 1;
            
            room.beds.push({
                bedNumber: bedNumber,
                studentId: studentId,
                studentName: student.fullName,
                allocatedDate: new Date().toISOString()
            });
            
            room.occupiedBeds++;
            student.roomAllocated = roomNumber;
            student.bedNumber = bedNumber;
            
            localStorage.setItem('rooms', JSON.stringify(rooms));
            localStorage.setItem('students', JSON.stringify(students));
            
            return { room: room.number, bed: bedNumber };
        }
        return null;
    }
}