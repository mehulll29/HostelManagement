import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentManagement from './pages/admin/StudentManagement';
import RoomManagement from './pages/admin/RoomManagement';
import AdminMessMenu from './pages/admin/AdminMessMenu';
import AdminComplaints from './pages/admin/AdminComplaints';
import AdminLeaveManagement from './pages/admin/AdminLeaveManagement';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import StudentComplaints from './pages/student/StudentComplaints';
import StudentLeave from './pages/student/StudentLeave';
import StudentMessMenu from './pages/student/StudentMessMenu';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#09090b', color: '#a1a1aa', fontFamily: 'inherit' }}>
        Loading application...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />;
  }

  return children;
};

const PortalLayout = ({ children }) => (
  <div className="portal-shell">
    <Navbar />
    <div className="portal-body">
      <Sidebar />
      <div className="main-content">
        <main className="page-content">
          {children}
        </main>
        <footer className="portal-footer">
          <p>© 2024 HostelHub Management System. All rights reserved.</p>
        </footer>
      </div>
    </div>
  </div>
);

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      {/* Public Home Landing Page */}
      <Route path="/" element={<Home />} />
      
      {/* Auth Route */}
      <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace /> : <Login />} />

      {/* Admin Portal Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRole="admin">
            <PortalLayout>
              <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/students" element={<StudentManagement />} />
                <Route path="/rooms" element={<RoomManagement />} />
                <Route path="/mess" element={<AdminMessMenu />} />
                <Route path="/complaints" element={<AdminComplaints />} />
                <Route path="/leave" element={<AdminLeaveManagement />} />
              </Routes>
            </PortalLayout>
          </ProtectedRoute>
        }
      />

      {/* Student Portal Routes */}
      <Route
        path="/student/*"
        element={
          <ProtectedRoute allowedRole="student">
            <PortalLayout>
              <Routes>
                <Route path="/" element={<StudentDashboard />} />
                <Route path="/profile" element={<StudentProfile />} />
                <Route path="/mess" element={<StudentMessMenu />} />
                <Route path="/complaints" element={<StudentComplaints />} />
                <Route path="/leave" element={<StudentLeave />} />
              </Routes>
            </PortalLayout>
          </ProtectedRoute>
        }
      />

      {/* Default fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
