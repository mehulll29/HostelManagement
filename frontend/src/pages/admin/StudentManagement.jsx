import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { UserPlus, Search, Edit3, Trash2 } from 'lucide-react';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    rollNumber: '',
    collegeName: 'Dharmsinh Desai University',
    course: 'MCA',
    semester: '1',
    fatherName: '',
    fatherPhone: '',
    roomId: '',
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsRes, roomsRes] = await Promise.all([
        API.get(`/students?search=${encodeURIComponent(search)}`),
        API.get('/rooms'),
      ]);
      setStudents(studentsRes.data.students || []);
      setRooms(roomsRes.data.rooms || []);
    } catch (err) {
      console.error('Error loading students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setFormData({
      fullName: '',
      email: '',
      password: '',
      phone: '',
      rollNumber: '',
      collegeName: 'Dharmsinh Desai University',
      course: 'MCA',
      semester: '1',
      fatherName: '',
      fatherPhone: '',
      roomId: '',
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (student) => {
    setEditingStudent(student);
    setFormData({
      fullName: student.fullName || '',
      email: student.email || '',
      password: '',
      phone: student.phone || '',
      rollNumber: student.rollNumber || '',
      collegeName: student.collegeName || 'Dharmsinh Desai University',
      course: student.course || 'MCA',
      semester: student.semester || '1',
      fatherName: student.fatherName || '',
      fatherPhone: student.fatherPhone || '',
      newRoomId: student.room ? student.room._id : '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      if (editingStudent) {
        await API.put(`/students/${editingStudent._id}`, formData);
        setMessage({ type: 'success', text: 'Student profile updated successfully!' });
      } else {
        await API.post('/students', formData);
        setMessage({ type: 'success', text: 'New student registered successfully with login credentials!' });
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Action failed' });
    }
  };

  const handleDelete = async (studentId, studentName) => {
    if (window.confirm(`Are you sure you want to delete student "${studentName}"? This will release their allocated room bed.`)) {
      try {
        await API.delete(`/students/${studentId}`);
        setMessage({ type: 'success', text: 'Student record removed successfully!' });
        fetchData();
      } catch (err) {
        setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to delete student' });
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Student Directory & Registration</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage student profiles, issue login credentials, and track room allocations</p>
        </div>
        <button onClick={handleOpenAddModal} className="btn btn-primary">
          <UserPlus size={18} />
          <span>Register New Student</span>
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl mb-6 font-semibold text-sm ${message.type === 'success' ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/15 border border-red-500/30 text-red-400'}`}>
          {message.text}
        </div>
      )}

      {/* Search Filter */}
      <div className="card mb-6 p-4">
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            className="form-control pl-11"
            placeholder="Search by student name, email, or roll number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Student Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Roll No</th>
              <th>Email Credentials</th>
              <th>Course / Sem</th>
              <th>Phone</th>
              <th>Allocated Room</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="text-center py-6 text-zinc-400">Loading student records...</td></tr>
            ) : students.length === 0 ? (
              <tr><td colSpan="7" className="text-center py-6 text-zinc-400">No student records found</td></tr>
            ) : (
              students.map((st) => (
                <tr key={st._id}>
                  <td className="font-bold text-white">{st.fullName}</td>
                  <td><span className="badge badge-available">{st.rollNumber || 'N/A'}</span></td>
                  <td className="text-zinc-300">{st.email}</td>
                  <td className="text-zinc-300">{st.course} - Sem {st.semester}</td>
                  <td className="text-zinc-300">{st.phone || 'N/A'}</td>
                  <td>
                    {st.room ? (
                      <span className="badge badge-resolved">Room {st.room.number} ({st.room.type})</span>
                    ) : (
                      <span className="badge badge-pending">Unallocated</span>
                    )}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenEditModal(st)} className="btn btn-outline btn-sm">
                        <Edit3 size={14} /> Edit
                      </button>
                      <button onClick={() => handleDelete(st._id, st.fullName)} className="btn btn-danger btn-sm">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Registering / Editing Student */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingStudent ? 'Edit Student Details' : 'Register New Student Credentials'}</h3>
              <button onClick={() => setShowModal(false)} className="close-btn">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label>Email Address (Username) *</label>
                  <input
                    type="email"
                    className="form-control"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>{editingStudent ? 'New Password (Optional)' : 'Password *'}</label>
                  <input
                    type="password"
                    className="form-control"
                    required={!editingStudent}
                    placeholder={editingStudent ? 'Leave blank to keep same' : 'Enter password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label>Roll Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label>Course</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Semester</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Room Allocation</label>
                <select
                  className="form-control"
                  value={editingStudent ? formData.newRoomId : formData.roomId}
                  onChange={(e) =>
                    editingStudent
                      ? setFormData({ ...formData, newRoomId: e.target.value })
                      : setFormData({ ...formData, roomId: e.target.value })
                  }
                >
                  <option value="">-- No Room Allocated --</option>
                  {rooms.map((r) => (
                    <option key={r._id} value={r._id} disabled={r.occupiedBeds >= r.capacity && (!editingStudent || editingStudent.room?._id !== r._id)}>
                      Room {r.number} ({r.type}) - {r.occupiedBeds}/{r.capacity} occupied {r.occupiedBeds >= r.capacity ? '(FULL)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingStudent ? 'Save Changes' : 'Register Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
