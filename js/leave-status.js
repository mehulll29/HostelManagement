// js/leave-status.js
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = AuthSystem.getCurrentUser();
    if (!currentUser || currentUser.role !== 'student') {
        window.location.href = 'login.html';
        return;
    }

    // Display student name
    const studentNameElement = document.getElementById('studentName');
    if (studentNameElement) {
        studentNameElement.textContent = `Welcome, ${currentUser.fullName}`;
    }

    const leaveApplicationForm = document.getElementById('leaveApplicationForm');
    const leaveTableBody = document.getElementById('leaveTableBody');

    // Set minimum date for fromDate input
    const fromDateInput = document.getElementById('fromDate');
    const toDateInput = document.getElementById('toDate');
    
    if (fromDateInput) {
        const today = new Date().toISOString().split('T')[0];
        fromDateInput.min = today;
        
        // Update toDate min when fromDate changes
        fromDateInput.addEventListener('change', function() {
            if (toDateInput) {
                toDateInput.min = this.value;
            }
        });
    }

    // Load leave history
    loadLeaveHistory();

    // Handle leave application
    if (leaveApplicationForm) {
        leaveApplicationForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const fromDate = document.getElementById('fromDate').value;
            const toDate = document.getElementById('toDate').value;
            const destination = document.getElementById('destination').value.trim();
            const reason = document.getElementById('reason').value.trim();
            const parentContact = document.getElementById('parentContact').value.trim();

            // Validate required fields
            if (!fromDate || !toDate || !destination || !reason || !parentContact) {
                alert('Please fill in all required fields');
                return;
            }

            // Validate dates
            const from = new Date(fromDate);
            const to = new Date(toDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (from < today) {
                alert('From date cannot be in the past');
                return;
            }

            if (to < from) {
                alert('To date must be after from date');
                return;
            }

            // Check maximum leave duration (30 days)
            const diffTime = Math.abs(to - from);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            if (diffDays > 30) {
                alert('Leave duration cannot exceed 30 days');
                return;
            }

            // Validate phone number format
            const phoneRegex = /^[6-9]\d{9}$/;
            if (!phoneRegex.test(parentContact)) {
                alert('Please enter a valid 10-digit mobile number starting with 6-9');
                return;
            }

            // Check for overlapping leaves
            const existingLeaves = JSON.parse(localStorage.getItem('leaves')) || [];
            const studentLeaves = existingLeaves.filter(leave => leave.studentId === currentUser.id);
            
            const hasOverlap = studentLeaves.some(leave => {
                const existingFrom = new Date(leave.fromDate);
                const existingTo = new Date(leave.toDate);
                
                // Check if the new leave overlaps with existing leave
                return (from <= existingTo && to >= existingFrom);
            });

            if (hasOverlap) {
                alert('You already have a leave application that overlaps with these dates');
                return;
            }

            // Create leave application
            const leaveApplication = {
                id: Date.now(),
                studentId: currentUser.id,
                studentName: currentUser.fullName,
                fromDate: fromDate,
                toDate: toDate,
                destination: destination,
                reason: reason,
                parentContact: parentContact,
                status: 'active',
                appliedDate: new Date().toISOString()
            };

            // Save to localStorage
            const leaves = JSON.parse(localStorage.getItem('leaves')) || [];
            leaves.push(leaveApplication);
            console.log("---------->",JSON.stringify(leaves));
            
            localStorage.setItem('leaves', JSON.stringify(leaves));

            alert('Leave application submitted successfully!');
            leaveApplicationForm.reset();
            loadLeaveHistory();
        });
    }

    function loadLeaveHistory() {
        const leaves = JSON.parse(localStorage.getItem('leaves')) || [];
        const studentLeaves = leaves.filter(leave => leave.studentId === currentUser.id);

        leaveTableBody.innerHTML = '';

        if (studentLeaves.length === 0) {
            leaveTableBody.innerHTML = '<tr><td colspan="6">No leave records found</td></tr>';
            return;
        }

        studentLeaves.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));

        studentLeaves.forEach(leave => {
            const isCurrentlyOnLeave = isCurrentlyOnLeaveCheck(leave);
            const statusText = isCurrentlyOnLeave ? 'On Leave' : 'Completed';
            const statusClass = isCurrentlyOnLeave ? 'status-approved' : 'status-resolved';
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatDate(leave.fromDate)}</td>
                <td>${formatDate(leave.toDate)}</td>
                <td>${leave.destination}</td>
                <td>${leave.reason}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>${formatDate(leave.appliedDate)}</td>
            `;
            leaveTableBody.appendChild(row);
        });
    }

    function isCurrentlyOnLeaveCheck(leave) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const fromDate = new Date(leave.fromDate);
        const toDate = new Date(leave.toDate);
        
        return today >= fromDate && today <= toDate;
    }


    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
}
);