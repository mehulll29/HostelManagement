import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { AlertCircle, Plus, Trash2 } from 'lucide-react';

const StudentComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    category: 'Maintenance',
    priority: 'medium',
    description: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchMyComplaints = async () => {
    try {
      setLoading(true);
      const res = await API.get('/complaints');
      setComplaints(res.data.complaints || []);
    } catch (err) {
      console.error('Error fetching student complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/complaints', form);
      setMessage({ type: 'success', text: 'Complaint submitted successfully!' });
      setShowModal(false);
      setForm({ title: '', category: 'Maintenance', priority: 'medium', description: '' });
      fetchMyComplaints();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to lodge complaint' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this complaint record?')) {
      try {
        await API.delete(`/complaints/${id}`);
        setMessage({ type: 'success', text: 'Complaint deleted' });
        fetchMyComplaints();
      } catch (err) {
        setMessage({ type: 'error', text: err.response?.data?.message || 'Delete failed' });
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>My Complaints &amp; Requests</h1>
          <p>Lodge hostel maintenance, electrical, plumbing or internet grievances</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={18} />
          <span>Lodge Complaint</span>
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
          {message.text}
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Resolution Remark</th>
              <th>Submitted Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '1.5rem', color: '#777' }}>Loading your complaints...</td></tr>
            ) : complaints.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '1.5rem', color: '#777' }}>No complaints filed yet</td></tr>
            ) : (
              complaints.map((c) => (
                <tr key={c._id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{c.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#777777' }}>{c.description}</div>
                  </td>
                  <td><span className="badge badge-in-progress">{c.category}</span></td>
                  <td>
                    <span className={`badge ${c.priority === 'high' ? 'badge-rejected' : 'badge-pending'}`}>
                      {c.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${c.status}`}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ color: '#cccccc', fontSize: '0.8125rem' }}>{c.resolutionNote || '-'}</td>
                  <td style={{ color: '#aaaaaa', fontSize: '0.8125rem' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleDelete(c._id)} className="btn btn-danger btn-sm">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Lodge Complaint Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Lodge New Complaint</h3>
              <button onClick={() => setShowModal(false)} className="close-btn">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="form-group">
                <label className="text-zinc-200">Complaint Title *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. Fan noisy / Light bulb burnt"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="text-zinc-200">Category</label>
                  <select
                    className="form-control"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="Maintenance">Maintenance</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Cleanliness">Cleanliness</option>
                    <option value="Mess / Food">Mess / Food</option>
                    <option value="Internet / Wi-Fi">Internet / Wi-Fi</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="text-zinc-200">Priority</label>
                  <select
                    className="form-control"
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="text-zinc-200">Grievance Description *</label>
                <textarea
                  className="form-control"
                  rows="4"
                  required
                  placeholder="Provide detailed description of the issue..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Complaint</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentComplaints;
