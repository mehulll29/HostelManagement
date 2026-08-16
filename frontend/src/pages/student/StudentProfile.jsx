import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import API from '../../api/axios';
import { User, Save, Lock } from 'lucide-react';

const StudentProfile = () => {
  const { user, updateUserProfile } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    fatherName: user?.fatherName || '',
    fatherPhone: user?.fatherPhone || '',
    collegeName: user?.collegeName || 'Dharmsinh Desai University',
    course: user?.course || 'MCA',
    semester: user?.semester || '1',
    password: '',
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setSubmitting(true);
    try {
      const res = await API.put('/auth/profile', formData);
      if (res.data.success) {
        updateUserProfile(res.data.user);
        setMessage({ type: 'success', text: 'Profile details updated successfully!' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white">Student Profile Management</h1>
        <p className="text-zinc-400 text-sm mt-1">View and update your personal information and contact details</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl mb-6 font-semibold text-sm ${message.type === 'success' ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/15 border border-red-500/30 text-red-400'}`}>
          {message.text}
        </div>
      )}

      <div className="card bg-zinc-900 border-zinc-800">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="text-zinc-200">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="text-zinc-200">Email (Username)</label>
              <input type="email" className="form-control bg-zinc-800/50 text-zinc-400 cursor-not-allowed" value={user?.email || ''} disabled />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="text-zinc-200">Roll Number</label>
              <input type="text" className="form-control bg-zinc-800/50 text-zinc-400 cursor-not-allowed" value={user?.rollNumber || ''} disabled />
            </div>

            <div className="form-group">
              <label className="text-zinc-200">Phone Number</label>
              <input
                type="text"
                className="form-control"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="text-zinc-200">Course</label>
              <input
                type="text"
                className="form-control"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="text-zinc-200">Semester</label>
              <input
                type="text"
                className="form-control"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="text-zinc-200">Father's Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.fatherName}
                onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="text-zinc-200">Father's Contact Phone</label>
              <input
                type="text"
                className="form-control"
                value={formData.fatherPhone}
                onChange={(e) => setFormData({ ...formData, fatherPhone: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group border-t border-zinc-800 pt-5 mt-4">
            <label className="flex items-center gap-2 text-zinc-200 font-semibold mb-2">
              <Lock size={16} className="text-orange-500" /> Change Password (Optional)
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter new password to change"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              <Save size={18} />
              <span>{submitting ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentProfile;
