# 🏢 HostelHub — MERN Stack Hostel Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg)](LICENSE)
[![Stack: MERN](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://react.dev/)
[![Node.js Version](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)

**HostelHub** is a comprehensive, full-stack web application designed to streamline and automate hostel administration, room allocation, leave pass generation, grievance tracking, and mess schedule management in educational institutions. Built with the MERN stack and styled with a sleek dark-mode aesthetic.

---

## ✨ Features

### 👨‍🎓 Student Portal
- **Dashboard Overview**: View hostel room status, current occupancy, today's mess menu, and active request statistics.
- **Leave Application (Gate Pass)**: Apply for hostel leave online with start/end dates, destination, reason, and guardian contact details.
- **Grievance & Complaint Tracking**: File maintenance, plumbing, electrical, or Wi-Fi complaints and track real-time resolution status.
- **Weekly Mess Schedule**: Access day-wise meal schedules for Breakfast, Lunch, Evening Snacks, and Dinner.
- **Student Profile**: View personal academic details, room assignments, and guardian information.

### 🛡️ Admin Portal
- **Admin Dashboard**: System-wide statistics on student count, room utilization, pending complaints, and active leave requests.
- **Student Directory**: Register new students, edit details, assign/change hostel rooms, or remove records.
- **Room Allocation Management**: Monitor blocks, total bed capacities, and room availability in real-time.
- **Leave Request Management**: Review student leave applications and approve or reject them with custom administrative notes.
- **Complaint Queue**: Track, prioritize, and update grievance ticket statuses (*Pending*, *In-Progress*, *Resolved*).
- **Mess Menu Planning**: Update weekly mess menus and daily meal offerings.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router DOM v6, Lucide React Icons, Custom CSS3 Tokens |
| **Backend** | Node.js, Express.js REST API, JSON Web Tokens (JWT), Bcrypt.js |
| **Database** | MongoDB / Mongoose ODM (with MongoDB Memory Server support) |
| **Design** | Dark Mode Theme (`#111111` base, `#222222` cards, `#F97316` primary orange accent) |

---

## 📁 Repository Structure

```text
MERN-HostelManagement/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Express route handlers
│   ├── middleware/      # Auth & JWT verification middleware
│   ├── models/          # Mongoose database schemas (User, Room, Leave, Complaint, Mess)
│   ├── routes/          # Express API routes
│   └── server.js        # Server entry point
└── frontend/
    ├── public/          # Static assets & logo
    ├── src/
    │   ├── api/         # Axios instance & HTTP helpers
    │   ├── components/  # Navbar & reusable UI components
    │   ├── context/     # AuthContext state management
    │   ├── pages/       # Home, Login, Admin & Student view pages
    │   ├── App.jsx      # Route definitions & portal layout
    │   ├── index.css    # Global CSS custom properties & utility styles
    │   └── main.jsx     # React root entry point
    └── vite.config.js   # Vite build configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18.x or higher)
- [npm](https://www.npmjs.com/) (v9.x or higher)
- [MongoDB](https://www.mongodb.com/) (Optional — backend fallback includes in-memory database)

### Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/MERN-HostelManagement.git
   cd MERN-HostelManagement
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```
   *Create a `.env` file in the `backend/` directory:*
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/hostelmanagement
   JWT_SECRET=your_jwt_secret_key_here
   ```
   *Start the Backend Server:*
   ```bash
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```
   *Start the Frontend Development Server:*
   ```bash
   npm run dev
   ```

4. **Access the Application**
   Open your browser and navigate to `http://localhost:5173` (or `http://localhost:5174`).

---

## 🔑 Quick Demo Credentials

For testing purposes, you can use the built-in quick login buttons on the `/login` page or use these credentials:

| Role | Username / Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@hostelhub.com` | `admin123` |
| **Student** | `mehul@example.com` | `mehul123` |

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
