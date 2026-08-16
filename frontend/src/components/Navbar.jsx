import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const isAdmin = user.role === 'admin';

  const studentLinks = [
    { path: '/student', label: 'Dashboard', end: true },
    { path: '/student/profile', label: 'Profile' },
    { path: '/student/complaints', label: 'Complaints' },
    { path: '/student/leave', label: 'Leave Status' },
    { path: '/student/mess', label: 'Mess' },
  ];

  const adminLinks = [
    { path: '/admin', label: 'Dashboard', end: true },
    { path: '/admin/students', label: 'Students' },
    { path: '/admin/rooms', label: 'Rooms' },
    { path: '/admin/mess', label: 'Mess' },
    { path: '/admin/complaints', label: 'Complaints' },
    { path: '/admin/leave', label: 'Leave Requests' },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <header className="navbar">
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
        <img
          src="/logo.png"
          alt="HostelHub Logo"
          style={{ height: '2rem', width: 'auto', objectFit: 'contain', maxWidth: '7rem' }}
        />
        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
          Hostel<span style={{ color: '#f97316' }}>Hub</span>
        </span>
      </div>

      {/* Nav Links */}
      <nav className="navbar-nav">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.end}
            className={({ isActive }) => isActive ? 'nav-active' : ''}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Right side: Welcome + Logout */}
      <div className="navbar-right">
        <span className="navbar-welcome">
          Welcome, {user.fullName?.split(' ')[0] || 'User'}
        </span>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;

