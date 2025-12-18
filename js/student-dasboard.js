// js/student-dashboard.js
class StudentDashboard {
    static init() {
        // Check if user is student
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser || currentUser.role !== 'student') {
            window.location.href = 'login.html';
            return;
        }

        // Update student name
        const studentNameElement = document.getElementById('studentName');
        if (studentNameElement && currentUser.fullName) {
            studentNameElement.textContent = `Welcome, ${currentUser.fullName}`;
        }

        // Load dashboard data
        this.loadStudentData();
        this.loadNotices();
        this.attachEventListeners();
    }

    static loadStudentData() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const students = JSON.parse(localStorage.getItem('students')) || [];
        const complaints = JSON.parse(localStorage.getItem('complaints')) || [];
        const leaves = JSON.parse(localStorage.getItem('leaves')) || [];

        const student = students.find(s => s.id === currentUser.id);
        
        if (student) {
            // Room information
            document.getElementById('studentRoom').textContent = student.roomAllocated || 'Not Allocated';
            
            // Pending complaints
            const pendingComplaints = complaints.filter(c => 
                c.studentId === currentUser.id && c.status === 'submitted'
            );
            document.getElementById('pendingComplaints').textContent = pendingComplaints.length;
            
            // Leave balance (count of applied leaves)
            const totalLeaves = leaves.filter(l => l.studentId === currentUser.id);
            document.getElementById('leaveBalance').textContent = totalLeaves.length;
        }
    }

    static loadNotices() {
        const notices = JSON.parse(localStorage.getItem('notices')) || [];
        const noticeList = document.getElementById('noticeList');
        
        noticeList.innerHTML = '';
        
        // Show latest 3 notices
        const recentNotices = notices
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3);
        
        if (recentNotices.length === 0) {
            noticeList.innerHTML = '<p>No notices available</p>';
            return;
        }
        
        recentNotices.forEach(notice => {
            const noticeItem = document.createElement('div');
            noticeItem.className = 'notice-item';
            noticeItem.innerHTML = `
                <strong>${notice.title}</strong>
                <p>${notice.content}</p>
                <small>${new Date(notice.createdAt).toLocaleDateString()}</small>
            `;
            noticeList.appendChild(noticeItem);
        });
    }

    static attachEventListeners() {
        // Leave application
        const applyLeaveBtn = document.getElementById('applyLeaveBtn');
        const leaveModal = document.getElementById('leaveModal');
        const cancelLeave = document.getElementById('cancelLeave');
        const leaveForm = document.getElementById('leaveForm');
        
        applyLeaveBtn.addEventListener('click', () => {
            leaveModal.style.display = 'block';
            this.setDefaultLeaveDates();
        });
        
        cancelLeave.addEventListener('click', () => {
            leaveModal.style.display = 'none';
            leaveForm.reset();
        });
        
        leaveForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitLeaveApplication();
        });
        
        // Complaint raising
        const raiseComplaintBtn = document.getElementById('raiseComplaintBtn');
        const complaintModal = document.getElementById('complaintModal');
        const cancelComplaint = document.getElementById('cancelComplaint');
        const complaintForm = document.getElementById('complaintForm');
        
        raiseComplaintBtn.addEventListener('click', () => {
            complaintModal.style.display = 'block';
        });
        
        cancelComplaint.addEventListener('click', () => {
            complaintModal.style.display = 'none';
            complaintForm.reset();
        });
        
        complaintForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitComplaint();
        });
        
        // Modal close functionality
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            const closeBtn = modal.querySelector('.close');
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
                modal.querySelector('form').reset();
            });
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            modals.forEach(modal => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                    modal.querySelector('form').reset();
                }
            });
        });
    }

    static setDefaultLeaveDates() {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const dayAfterTomorrow = new Date(tomorrow);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
        
        document.getElementById('fromDate').value = tomorrow.toISOString().split('T')[0];
        document.getElementById('toDate').value = dayAfterTomorrow.toISOString().split('T')[0];
        
        // Set min dates
        document.getElementById('fromDate').min = tomorrow.toISOString().split('T')[0];
        document.getElementById('toDate').min = tomorrow.toISOString().split('T')[0];
    }

    static submitLeaveApplication() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const fromDate = document.getElementById('fromDate').value;
        const toDate = document.getElementById('toDate').value;
        const destination = document.getElementById('destination').value;
        const reason = document.getElementById('reason').value;
        const parentContact = document.getElementById('parentContact').value;
        
        // Validate dates
        if (new Date(fromDate) >= new Date(toDate)) {
            alert('To Date must be after From Date');
            return;
        }
        
        const leaveData = {
            fromDate: fromDate,
            toDate: toDate,
            destination: destination,
            reason: reason,
            parentContact: parentContact
        };
        
        // Use LeaveSystem if available, otherwise save directly
        const leaves = JSON.parse(localStorage.getItem('leaves')) || [];
        const newLeave = {
            id: Date.now(),
            studentId: currentUser.id,
            studentName: currentUser.fullName,
            ...leaveData,
            status: 'pending',
            appliedDate: new Date().toISOString(),
            approvedBy: null,
            gatePass: null
        };
        
        leaves.push(newLeave);
        localStorage.setItem('leaves', JSON.stringify(leaves));
        
        alert('Leave application submitted successfully!');
        document.getElementById('leaveModal').style.display = 'none';
        document.getElementById('leaveForm').reset();
        
        // Refresh dashboard data
        this.loadStudentData();
    }

    static submitComplaint() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const title = document.getElementById('complaintTitle').value;
        const category = document.getElementById('complaintCategory').value;
        const priority = document.getElementById('complaintPriority').value;
        const description = document.getElementById('complaintDescription').value;
        
        const complaintData = {
            title: title,
            category: category,
            priority: priority,
            description: description
        };
        
        // Use ComplaintSystem if available, otherwise save directly
        const complaints = JSON.parse(localStorage.getItem('complaints')) || [];
        const students = JSON.parse(localStorage.getItem('students')) || [];
        const student = students.find(s => s.id === currentUser.id);
        
        const newComplaint = {
            id: Date.now(),
            studentId: currentUser.id,
            studentName: currentUser.fullName,
            ...complaintData,
            status: 'submitted',
            submittedDate: new Date().toISOString(),
            assignedTo: null,
            resolutionDate: null,
            roomNumber: student ? student.roomAllocated : null
        };
        
        complaints.push(newComplaint);
        localStorage.setItem('complaints', JSON.stringify(complaints));
        
        alert('Complaint submitted successfully!');
        document.getElementById('complaintModal').style.display = 'none';
        document.getElementById('complaintForm').reset();
        
        // Refresh dashboard data
        this.loadStudentData();
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    StudentDashboard.init();
});