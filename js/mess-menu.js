// js/mess-menu.js
document.addEventListener('DOMContentLoaded', function() {
    try {
        const currentUserData = localStorage.getItem('currentUser');
        if (!currentUserData) {
            window.location.href = 'login.html';
            return;
        }

        const currentUser = JSON.parse(currentUserData);
        if (!currentUser) {
            window.location.href = 'login.html';
            return;
        }

        // Display user name
        const studentNameElement = document.getElementById('studentName');
        if (studentNameElement) {
            const welcomeText = currentUser.role === 'admin' ? 'Welcome, Admin' : `Welcome, ${currentUser.fullName}`;
            studentNameElement.textContent = welcomeText;
        }

        // Add current day highlighting
        highlightCurrentDay();
    } catch (error) {
        console.error('Error in mess menu authentication:', error);
        window.location.href = 'login.html';
    }
});

function highlightCurrentDay() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date().getDay();
    const currentDayName = days[today];

    // Find the menu day element with matching day name
    const menuDays = document.querySelectorAll('.menu-day h3');
    menuDays.forEach(dayElement => {
        if (dayElement.textContent.trim() === currentDayName) {
            dayElement.closest('.menu-day').classList.add('current-day');
        }
    });
}