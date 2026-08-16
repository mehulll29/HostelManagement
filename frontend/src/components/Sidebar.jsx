import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  BedDouble,
  UtensilsCrossed,
  AlertCircle,
  CalendarCheck,
  User,
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  const isAdmin = user.role === 'admin';

  const navItems = isAdmin
    ? [
        { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/students', label: 'Student Directory', icon: Users },
        { path: '/admin/rooms', label: 'Room Allocations', icon: BedDouble },
        { path: '/admin/mess', label: 'Mess Schedule', icon: UtensilsCrossed },
        { path: '/admin/complaints', label: 'Complaints Queue', icon: AlertCircle },
        { path: '/admin/leave', label: 'Leave Requests', icon: CalendarCheck },
      ]
    : [
        { path: '/student', label: 'My Dashboard', icon: LayoutDashboard },
        { path: '/student/profile', label: 'My Profile', icon: User },
        { path: '/student/mess', label: 'Mess Schedule', icon: UtensilsCrossed },
        { path: '/student/complaints', label: 'My Complaints', icon: AlertCircle },
        { path: '/student/leave', label: 'Leave Pass', icon: CalendarCheck },
      ];

  const linkBase = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    padding: '0.625rem 0.875rem',
    borderRadius: '0.625rem',
    fontWeight: 600,
    fontSize: '0.8125rem',
    textDecoration: 'none',
    transition: 'all 0.18s ease',
    borderLeft: '3px solid transparent',
    color: '#a1a1aa',
  };

  const linkActive = {
    ...linkBase,
    background: 'rgba(249,115,22,0.1)',
    color: '#fb923c',
    borderLeftColor: '#f97316',
  };

  const linkInactive = {
    ...linkBase,
    color: '#a1a1aa',
    background: 'transparent',
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-label">
        {isAdmin ? 'Admin Management' : 'Student Portal'}
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin' || item.path === '/student'}
              style={({ isActive }) => (isActive ? linkActive : linkInactive)}
              onMouseEnter={(e) => {
                if (!e.currentTarget.dataset.active) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.color = '#e4e4e7';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.dataset.active) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#a1a1aa';
                }
              }}
            >
              <Icon size={15} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
