import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Users, BedDouble, AlertCircle, CalendarCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    studentsCount: 0,
    roomsCount: 0,
    occupiedBeds: 0,
    totalCapacity: 0,
    pendingComplaints: 0,
    pendingLeaves: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [studentsRes, roomsRes, complaintsRes, leavesRes] = await Promise.all([
          API.get('/students'),
          API.get('/rooms'),
          API.get('/complaints'),
          API.get('/leaves'),
        ]);

        const students = studentsRes.data.students || [];
        const rooms = roomsRes.data.rooms || [];
        const complaints = complaintsRes.data.complaints || [];
        const leaves = leavesRes.data.leaves || [];

        const totalCap = rooms.reduce((acc, r) => acc + r.capacity, 0);
        const occBeds = rooms.reduce((acc, r) => acc + r.occupiedBeds, 0);

        setStats({
          studentsCount: students.length,
          roomsCount: rooms.length,
          occupiedBeds: occBeds,
          totalCapacity: totalCap,
          pendingComplaints: complaints.filter((c) => c.status === 'pending').length,
          pendingLeaves: leaves.filter((l) => l.status === 'pending').length,
        });
      } catch (err) {
        console.error('Error fetching admin dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="text-zinc-400 p-4">Loading dashboard statistics...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white">Admin Dashboard</h1>
        <p className="text-zinc-400 text-sm mt-1">Hostel Management Overview & Quick Actions</p>
      </div>

      <div className="stats-grid">
        <div className="card stat-card card-hover border-l-4 border-orange-500">
          <div className="stat-icon bg-orange-500/10 text-orange-400">
            <Users />
          </div>
          <div className="stat-info">
            <h4>Total Registered Students</h4>
            <p className="text-white">{stats.studentsCount}</p>
          </div>
        </div>

        <div className="card stat-card card-hover border-l-4 border-sky-500">
          <div className="stat-icon bg-sky-500/10 text-sky-400">
            <BedDouble />
          </div>
          <div className="stat-info">
            <h4>Bed Occupancy</h4>
            <p className="text-white">{stats.occupiedBeds} / {stats.totalCapacity}</p>
          </div>
        </div>

        <div className="card stat-card card-hover border-l-4 border-amber-500">
          <div className="stat-icon bg-amber-500/10 text-amber-400">
            <AlertCircle />
          </div>
          <div className="stat-info">
            <h4>Pending Complaints</h4>
            <p className="text-white">{stats.pendingComplaints}</p>
          </div>
        </div>

        <div className="card stat-card card-hover border-l-4 border-emerald-500">
          <div className="stat-icon bg-emerald-500/10 text-emerald-400">
            <CalendarCheck />
          </div>
          <div className="stat-info">
            <h4>Pending Leave Requests</h4>
            <p className="text-white">{stats.pendingLeaves}</p>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-bold text-white mb-4">Quick Management Portals</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/students" className="no-underline">
          <div className="card card-hover flex justify-between items-center h-full">
            <div>
              <h3 className="text-base font-bold text-white mb-1">Student Directory</h3>
              <p className="text-xs text-zinc-400">Register new students, update profiles & details</p>
            </div>
            <ArrowRight className="text-orange-500" size={20} />
          </div>
        </Link>

        <Link to="/admin/rooms" className="no-underline">
          <div className="card card-hover flex justify-between items-center h-full">
            <div>
              <h3 className="text-base font-bold text-white mb-1">Room Allocations</h3>
              <p className="text-xs text-zinc-400">Manage rooms, bed occupancy & AC/Non-AC inventory</p>
            </div>
            <ArrowRight className="text-orange-500" size={20} />
          </div>
        </Link>

        <Link to="/admin/mess" className="no-underline">
          <div className="card card-hover flex justify-between items-center h-full">
            <div>
              <h3 className="text-base font-bold text-white mb-1">Mess Schedule</h3>
              <p className="text-xs text-zinc-400">Update daily food menus for breakfast, lunch & dinner</p>
            </div>
            <ArrowRight className="text-orange-500" size={20} />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
