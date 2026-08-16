import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import API from '../../api/axios';
import { BedDouble, UtensilsCrossed, AlertCircle, CalendarCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [complaintsCount, setComplaintsCount] = useState(0);
  const [leavesCount, setLeavesCount] = useState(0);
  const [todayMenu, setTodayMenu] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [complaintsRes, leavesRes, messRes] = await Promise.all([
          API.get('/complaints'),
          API.get('/leaves'),
          API.get('/mess'),
        ]);

        setComplaintsCount((complaintsRes.data.complaints || []).length);
        setLeavesCount((leavesRes.data.leaves || []).length);

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const todayName = days[new Date().getDay()];
        const foundMenu = (messRes.data.menu || []).find((m) => m.day === todayName);
        setTodayMenu(foundMenu || (messRes.data.menu || [])[0]);
      } catch (err) {
        console.error('Error loading student dashboard:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Welcome back, {user?.fullName}!</h1>
        <p>Roll No: {user?.rollNumber || 'N/A'} • {user?.course} (Semester {user?.semester})</p>
      </div>

      {/* Room Allocation Status Banner */}
      <div className="room-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '1rem', backdropFilter: 'blur(4px)', flexShrink: 0 }}>
            <BedDouble size={38} color="white" />
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,237,213,0.9)', fontWeight: 700 }}>
              MY HOSTEL ROOM STATUS
            </span>
            {user?.room ? (
              <div>
                <h2 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'white', margin: '0.15rem 0 0', lineHeight: 1.1 }}>{user.room.number}</h2>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.85)', marginTop: '0.3rem' }}>
                  Block: {user.room.block} • Type: {user.room.type} • Occupants: {user.room.occupiedBeds}/{user.room.capacity}
                </p>
              </div>
            ) : (
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', margin: '0.15rem 0 0' }}>Room Allocation Pending</h2>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)', marginTop: '0.3rem' }}>Please contact your Hostel Administrator to allocate a room bed.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
        {/* Today's Mess Menu Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #333333' }}>
            <UtensilsCrossed size={22} className="text-orange-500" />
            <h3 className="text-base font-bold text-white">Today's Mess Menu ({todayMenu?.day || 'Today'})</h3>
          </div>
          {todayMenu ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: '#cccccc' }}>
              <p><strong style={{ color: '#999' }}>🍳 Breakfast:</strong> {todayMenu.breakfast}</p>
              <p><strong style={{ color: '#999' }}>🍱 Lunch:</strong> {todayMenu.lunch}</p>
              <p><strong style={{ color: '#999' }}>☕ Snacks:</strong> {todayMenu.snacks}</p>
              <p><strong style={{ color: '#999' }}>🍲 Dinner:</strong> {todayMenu.dinner}</p>
            </div>
          ) : (
            <p style={{ color: '#777777', fontSize: '0.875rem' }}>Loading menu schedule...</p>
          )}
          <div style={{ marginTop: '1.25rem' }}>
            <Link to="/student/mess" className="btn btn-outline btn-sm">View Full Week Schedule</Link>
          </div>
        </div>

        {/* Quick Links / Requests Summary */}
        <div className="card">
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>Active Requests Overview</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', border: '1px solid #333', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <AlertCircle size={18} style={{ color: '#fbbf24' }} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>My Complaints</span>
                </div>
                <span className="badge badge-in-progress">{complaintsCount} Filed</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', border: '1px solid #333', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <CalendarCheck size={18} style={{ color: '#34d399' }} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Leave Requests</span>
                </div>
                <span className="badge badge-resolved">{leavesCount} Submitted</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Link to="/student/complaints" className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
              Lodge Complaint
            </Link>
            <Link to="/student/leave" className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
              Apply Leave Pass
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
