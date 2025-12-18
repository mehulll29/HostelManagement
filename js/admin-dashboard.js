// js/admin-dashboard.js
class AdminDashboard {
    static loadStats() {
        const students = JSON.parse(localStorage.getItem('students')) || [];
        const complaints = JSON.parse(localStorage.getItem('complaints')) || [];
        const leaves = JSON.parse(localStorage.getItem('leaves')) || [];
        const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
        
        // Update stats
        document.getElementById('totalStudents').textContent = students.length;
        document.getElementById('pendingComplaints').textContent = 
            complaints.filter(c => c.status === 'submitted').length;
        document.getElementById('pendingLeaves').textContent = 
            this.getCurrentLeaveCount(leaves);
        document.getElementById('occupiedRooms').textContent = 
            rooms.reduce((total, room) => total + room.occupiedBeds, 0);
        
        // Load recent complaints
        this.loadRecentComplaints();
    }
    
    static loadRecentComplaints() {
        const complaints = JSON.parse(localStorage.getItem('complaints')) || [];
        const students = JSON.parse(localStorage.getItem('students')) || [];
        const recentComplaintsDiv = document.getElementById('recentComplaints');
        
        recentComplaintsDiv.innerHTML = '';
        
        // Get 5 most recent complaints
        const recentComplaints = complaints
            .sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate))
            .slice(0, 5);
        
        recentComplaints.forEach(complaint => {
            const student = students.find(s => s.id === complaint.studentId) || {};
            const complaintItem = document.createElement('div');
            complaintItem.className = 'notice-item';
            
            complaintItem.innerHTML = `
                <strong>${complaint.title}</strong>
                <p>By: ${complaint.studentName || student.fullName || 'N/A'} | Room: ${student.roomAllocated || 'N/A'}</p>
                <small>${new Date(complaint.submittedDate).toLocaleDateString()} - 
                <span class="status-badge status-${complaint.status}">${complaint.status}</span></small>
            `;
            
            recentComplaintsDiv.appendChild(complaintItem);
        });
        
        if (recentComplaints.length === 0) {
            recentComplaintsDiv.innerHTML = '<p>No complaints found</p>';
        }
    }
    
    static getCurrentLeaveCount(leaves) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return leaves.filter(leave => {
            const fromDate = new Date(leave.fromDate);
            const toDate = new Date(leave.toDate);
            return today >= fromDate && today <= toDate;
        }).length;
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
    
    // Update admin name
    const adminNameElement = document.getElementById('adminName');
    if (adminNameElement && currentUser.fullName) {
        adminNameElement.textContent = `Welcome, ${currentUser.fullName}`;
    }
    
    // Load dashboard stats
    AdminDashboard.loadStats();
});