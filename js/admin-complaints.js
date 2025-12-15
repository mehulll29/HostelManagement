// js/admin-complaints.js
class AdminComplaintSystem {
    static loadAllComplaints() {
        const complaints = JSON.parse(localStorage.getItem('complaints')) || [];
        const students = JSON.parse(localStorage.getItem('students')) || [];
        const tableBody = document.getElementById('complaintsTableBody');
        
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        complaints.forEach(complaint => {
            const student = students.find(s => s.id === complaint.studentId) || {};
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>#${complaint.id}</td>
                <td>${complaint.studentName}</td>
                <td>${complaint.studentId}</td>
                <td>${student.roomAllocated || 'N/A'}</td>
                <td>${complaint.title}</td>
                <td>${complaint.category}</td>
                <td><span class="priority-badge ${complaint.priority}">${complaint.priority}</span></td>
                <td><span class="status-badge status-${complaint.status}">${complaint.status}</span></td>
                <td>${new Date(complaint.submittedDate).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-sm btn-outline view-complaint" data-id="${complaint.id}">View</button>
                    ${complaint.status !== 'resolved' ? 
                        `<button class="btn btn-sm btn-primary resolve-complaint" data-id="${complaint.id}">Resolve</button>` : 
                        ''
                    }
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Add event listeners
        this.attachEventListeners();
    }
    
    static attachEventListeners() {
        // View complaint details
        document.querySelectorAll('.view-complaint').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const complaintId = parseInt(e.target.dataset.id);
                this.showComplaintDetails(complaintId);
            });
        });
        
        // Resolve complaint
        document.querySelectorAll('.resolve-complaint').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const complaintId = parseInt(e.target.dataset.id);
                this.resolveComplaint(complaintId);
            });
        });
        
        // Modal close
        const closeModal = document.getElementById('closeModal');
        const modal = document.getElementById('complaintModal');
        const spanClose = document.querySelector('.close');
        
        if (closeModal) closeModal.addEventListener('click', () => modal.style.display = 'none');
        if (spanClose) spanClose.addEventListener('click', () => modal.style.display = 'none');
    }
    
    static showComplaintDetails(complaintId) {
        const complaints = JSON.parse(localStorage.getItem('complaints')) || [];
        const students = JSON.parse(localStorage.getItem('students')) || [];
        const complaint = complaints.find(c => c.id === complaintId);
        
        if (!complaint) return;
        
        const student = students.find(s => s.id === complaint.studentId) || {};
        const modal = document.getElementById('complaintModal');
        const detailsDiv = document.getElementById('complaintDetails');
        
        detailsDiv.innerHTML = `
            <div class="complaint-detail">
                <strong>Student Information:</strong>
                <p>Name: ${complaint.studentName}<br>
                   Room: ${student.roomAllocated || 'N/A'}<br>
                   Student ID: ${complaint.studentId}</p>
            </div>
            <div class="complaint-detail">
                <strong>Complaint Title:</strong>
                <p>${complaint.title}</p>
            </div>
            <div class="complaint-detail">
                <strong>Category:</strong>
                <p>${complaint.category}</p>
            </div>
            <div class="complaint-detail">
                <strong>Priority:</strong>
                <p><span class="priority-badge ${complaint.priority}">${complaint.priority}</span></p>
            </div>
            <div class="complaint-detail">
                <strong>Description:</strong>
                <p>${complaint.description}</p>
            </div>
            <div class="complaint-detail">
                <strong>Status:</strong>
                <p><span class="status-badge status-${complaint.status}">${complaint.status}</span></p>
            </div>
            <div class="complaint-detail">
                <strong>Submitted Date:</strong>
                <p>${new Date(complaint.submittedDate).toLocaleString()}</p>
            </div>
            ${complaint.resolutionDate ? `
            <div class="complaint-detail">
                <strong>Resolution Date:</strong>
                <p>${new Date(complaint.resolutionDate).toLocaleString()}</p>
            </div>
            ` : ''}
        `;
        
        modal.style.display = 'block';
    }
    
    static resolveComplaint(complaintId) {
        const complaints = JSON.parse(localStorage.getItem('complaints')) || [];
        const complaint = complaints.find(c => c.id === complaintId);
        
        if (complaint && complaint.status !== 'resolved') {
            complaint.status = 'resolved';
            complaint.resolutionDate = new Date().toISOString();
            
            localStorage.setItem('complaints', JSON.stringify(complaints));
            this.loadAllComplaints();
            
            // Close modal if open
            document.getElementById('complaintModal').style.display = 'none';
            
            alert('Complaint marked as resolved!');
        }
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
    
    AdminComplaintSystem.loadAllComplaints();
});