// js/student-registration.js
document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('studentRegistrationForm');
    
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const studentData = {
                fullName: document.getElementById('fullName').value,
                rollNumber: document.getElementById('rollNumber').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                course: document.getElementById('course').value,
                year: document.getElementById('year').value,
                parentName: document.getElementById('parentName').value,
                parentPhone: document.getElementById('parentPhone').value,
                parentAddress: document.getElementById('parentAddress').value,
                medicalHistory: document.getElementById('medicalHistory').value,
                emergencyContact: document.getElementById('emergencyContact').value,
                status: 'pending',
                registrationDate: new Date().toISOString()
            };
            
            // Save to localStorage
            const students = JSON.parse(localStorage.getItem('students')) || [];
            students.push(studentData);
            localStorage.setItem('students', JSON.stringify(students));
            
            alert('Registration submitted successfully!');
            registrationForm.reset();
        });
    }
});