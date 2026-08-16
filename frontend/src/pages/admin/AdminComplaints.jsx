import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Trash2, Edit } from 'lucide-react';

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [status, setStatus] = useState('resolved');
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await API.get('/complaints');
      setComplaints(res.data.complaints || []);
    } catch (err) {
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleOpenUpdate = (complaint) => {
    setSelectedComplaint(complaint);
    setResolutionNote(complaint.resolutionNote || '');
    setStatus(complaint.status || 'resolved');
  };

  const handleUpdateComplaint = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/complaints/${selectedComplaint._id}`, { status, resolutionNote });
      setMessage({ type: 'success', text: 'Complaint status updated!' });
      setSelectedComplaint(null);
      fetchComplaints();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    }
  };

  const handleDeleteComplaint = async (complaintId) => {
    if (window.confirm('Delete this complaint record?')) {
      try {
        await API.delete(`/complaints/${complaintId}`);
        setMessage({ type: 'success', text: 'Complaint deleted!' });
        fetchComplaints();
      } catch (err) {
        setMessage({ type: 'error', text: err.response?.data?.message || 'Delete failed' });
      }
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white">Student Complaints Queue</h1>
        <p className="text-zinc-400 text-sm mt-1">Review student grievances, assign priorities, update status, and add resolution remarks</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl mb-6 font-semibold text-sm ${message.type === 'success' ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/15 border border-red-500/30 text-red-400'}`}>
          {message.text}
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Room</th>
              <th>Category</th>
              <th>Title / Description</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Submitted Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" className="text-center py-6 text-zinc-400">Loading complaints...</td></tr>
            ) : complaints.length === 0 ? (
              <tr><td colSpan="8" className="text-center py-6 text-zinc-400">No complaints filed yet</td></tr>
            ) : (
              complaints.map((c) => (
                <tr key={c._id}>
                  <td className="font-bold text-white">{c.student?.fullName || 'Student'}</td>
                  <td className="text-zinc-300">{c.student?.room?.number || 'N/A'}</td>
                  <td><span className="badge badge-in-progress">{c.category}</span></td>
                  <td>
                    <div className="font-semibold text-white">{c.title}</div>
                    <div className="text-xs text-zinc-400">{c.description}</div>
                  </td>
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
                  <td className="text-zinc-400 text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenUpdate(c)} className="btn btn-outline btn-sm">
                        <Edit size={14} /> Update Status
                      </button>
                      <button onClick={() => handleDeleteComplaint(c._id)} className="btn btn-danger btn-sm">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal to update status */}
      {selectedComplaint && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Update Complaint Status</h3>
              <button onClick={() => setSelectedComplaint(null)} className="close-btn">&times;</button>
            </div>
            <form onSubmit={handleUpdateComplaint} className="space-y-4 mt-4">
              <p className="text-sm text-zinc-300 font-semibold mb-2">
                Subject: <span className="text-white">{selectedComplaint.title}</span> ({selectedComplaint.student?.fullName})
              </p>

              <div className="form-group">
                <label>Status</label>
                <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div className="form-group">
                <label>Resolution Note / Admin Remark</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Explain resolution steps..."
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setSelectedComplaint(null)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminComplaints;
