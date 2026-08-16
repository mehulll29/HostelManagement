document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Get the Roll Number from the URL (Simulating Login/Session) ---
    const urlParams = new URLSearchParams(window.location.search);
    const loggedInRollNumber = urlParams.get('rollNumber');

    const mainContent = document.getElementById('profile-content');
    const profileHeader = document.getElementById('profileHeader');
    
    if (!loggedInRollNumber) {
        // Handle case where no roll number is provided in the URL
        profileHeader.textContent = 'Access Error';
        mainContent.innerHTML = `
            <div class="alert alert-danger">
                <h3><i class="fas fa-exclamation-triangle"></i> Access Denied</h3>
                <p>No student identifier (Roll Number) found in the session or URL. Please log in or register a student first.</p>
                <p>To test, append <code>?rollNumber=YOUR_ROLL_NUMBER</code> to the URL.</p>
            </div>
        `;
        return; // Stop execution
    }

    // --- 2. Fetch data from mock database (localStorage) ---
    const studentsData = JSON.parse(localStorage.getItem('students')) || [];

    // 3. Find the student whose rollNumber matches the one in the URL
    const student = studentsData.find(s => s.rollNumber === loggedInRollNumber);
    
    if (student) {
        // --- Helper function for mapping select option values to display names ---
        const getDisplayValue = (key, value) => {
             const maps = {
                course: {
                    'btech': 'B.Tech', 'mtech': 'M.Tech', 'mba': 'MBA', 
                    'bca': 'BCA', 'bsc': 'B.Sc', 'msc': 'M.Sc'
                },
                semester: {
                    '1': '1st Semester', '2': '2nd Semester', '3': '3rd Semester', 
                    '4': '4th Semester', '5': '5th Semester', '6': '6th Semester', 
                    '7': '7th Semester', '8': '8th Semester'
                },
                roomPreference: {
                    'AC': 'AC Room', 'Non-AC': 'Non-AC Room'
                }
             };
             return maps[key] ? maps[key][value] || value : value;
        };

        // Update the header
        profileHeader.textContent = `${student.fullName}'s Profile`;
        document.getElementById('studentName').textContent = `Welcome, ${student.fullName.split(' ')[0]}`;


        // Function to create a detail row
        const createDetailRow = (label, value, isImportant = false) => `
            <div class="profile-detail-row">
                <span class="detail-label">${label}</span>
                <span class="detail-value ${isImportant ? 'important-value' : ''}">${value}</span>
            </div>
        `;

        // Populate the profile sections
        mainContent.innerHTML = `
            <div class="profile-section">
                <h2><i class="fas fa-user"></i> Personal Information</h2>
                ${createDetailRow('Full Name', student.fullName)}
                ${createDetailRow('Date of Birth', student.dateOfBirth)}
                ${createDetailRow('Email Address', student.email, true)}
                ${createDetailRow('Phone Number', student.phone)}
            </div>
            
            <div class="profile-section">
                <h2><i class="fas fa-graduation-cap"></i> Academic Information</h2>
                ${createDetailRow('College Name', student.collegeName)}
                ${createDetailRow('Course', getDisplayValue('course', student.course))}
                ${createDetailRow('Semester', getDisplayValue('semester', student.semester))}
                ${createDetailRow('Roll Number', student.rollNumber, true)}
            </div>
            
            <div class="profile-section">
                <h2><i class="fas fa-home"></i> Hostel & Room Details</h2>
                ${createDetailRow('Hostel Status', `<span class="status-badge status-approved">${student.status || 'Active'}</span>`)}
                ${createDetailRow('Allocated Room', student.allocatedRoom || 'Pending', true)}
                ${createDetailRow('Room Preference', getDisplayValue('roomPreference', student.roomPreference))}
            </div>

            <div class="profile-section">
                <h2><i class="fas fa-users"></i> Guardian Information</h2>
                ${createDetailRow("Father's Name", student.fatherName)}
                ${createDetailRow("Father's Phone", student.fatherPhone)}
            </div>

            <div class="profile-actions">
                 <a href="#" class="btn btn-primary"><i class="fas fa-edit"></i> Edit Profile</a>
                 <a href="leave-request.html" class="btn btn-secondary"><i class="fas fa-sign-out-alt"></i> Apply for Leave</a>
            </div>
        `;

    } else {
        // Handle case where roll number is found but no data exists for it
        profileHeader.textContent = 'Profile Not Found';
        mainContent.innerHTML = `
            <div class="alert alert-danger">
                <h3><i class="fas fa-exclamation-triangle"></i> Profile Not Found</h3>
                <p>No student registered with Roll Number: <strong>${loggedInRollNumber}</strong>. Please ensure the data was correctly saved from the registration page.</p>
                <p>If you are an admin, check the <a href="student-registration.html">Registration Page</a> to add this student.</p>
            </div>
        `;
    }
});