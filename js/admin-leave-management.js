// js/admin-leave-management.js
class AdminLeaveSystem {
    static loadAllLeaves() {
        const leaves = JSON.parse(localStorage.getItem('leaves')) || [];
        const tableBody = document.getElementById('leavesTableBody');
        
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        // Sort leaves by applied date (newest first)
        leaves.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
        
        leaves.forEach(leave => {
            const isCurrentlyOnLeave = this.isCurrentlyOnLeave(leave);
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>#${leave.id}</td>
                <td>${leave.studentName}</td>
                <td>${leave.studentId}</td>
                <td>${new Date(leave.fromDate).toLocaleDateString()}</td>
                <td>${new Date(leave.toDate).toLocaleDateString()}</td>
                <td>${leave.destination}</td>
                <td>${leave.reason}</td>
                <td><span class="status-badge ${isCurrentlyOnLeave ? 'status-approved' : 'status-resolved'}">${isCurrentlyOnLeave ? 'On Leave' : 'Completed'}</span></td>
                <td>${new Date(leave.appliedDate).toLocaleDateString()}</td>
                <td>${leave.parentContact}</td>
            `;
            
            tableBody.appendChild(row);
        });
    }
    
    static isCurrentlyOnLeave(leave) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const fromDate = new Date(leave.fromDate);
        const toDate = new Date(leave.toDate);
        
        return today >= fromDate && today <= toDate;
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
    
    AdminLeaveSystem.loadAllLeaves();
});