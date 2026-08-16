import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Trash2 } from 'lucide-react';

const AdminLeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [status, setStatus] = useState('approved');
  const [adminRemark, setAdminRemark] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await API.get('/leaves');
      setLeaves(res.data.leaves || []);
    } catch (err) {
      console.error('Error fetching leaves:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleOpenReview = (leave) => {
    setSelectedLeave(leave);
    setStatus(leave.status === 'pending' ? 'approved' : leave.status);
    setAdminRemark(leave.adminRemark || '');
  };

  const handleSaveDecision = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/leaves/${selectedLeave._id}`, { status, adminRemark });
      setMessage({ type: 'success', text: `Leave request ${status} successfully!` });
      setSelectedLeave(null);
      fetchLeaves();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Decision failed' });
    }
  };

  const handleDeleteLeave = async (leaveId) => {
    if (window.confirm('Delete leave record?')) {
      try {
        await API.delete(`/leaves/${leaveId}`);
        setMessage({ type: 'success', text: 'Leave record deleted' });
        fetchLeaves();
      } catch (err) {
        setMessage({ type: 'error', text: err.response?.data?.message || 'Delete failed' });
      }
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white">Student Leave Applications</h1>
        <p className="text-zinc-400 text-sm mt-1">Review leave applications, grant approvals, or add administrative gate pass notes</p>
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
              <th>Leave Reason</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Admin Remark</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" className="text-center py-6 text-zinc-400">Loading leave applications...</td></tr>
            ) : leaves.length === 0 ? (
              <tr><td colSpan="8" className="text-center py-6 text-zinc-400">No leave applications found</td></tr>
            ) : (
              leaves.map((l) => (
                <tr key={l._id}>
                  <td className="font-bold text-white">{l.student?.fullName || 'Student'}</td>
                  <td className="text-zinc-300">{l.student?.room?.number || 'N/A'}</td>
                  <td className="text-zinc-300">{l.reason}</td>
                  <td className="text-zinc-400 text-xs">{new Date(l.startDate).toLocaleDateString()}</td>
                  <td className="text-zinc-400 text-xs">{new Date(l.endDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge badge-${l.status}`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="text-zinc-300 text-xs">{l.adminRemark || '-'}</td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenReview(l)} className="btn btn-outline btn-sm">
                        Review
                      </button>
                      <button onClick={() => handleDeleteLeave(l._id)} className="btn btn-danger btn-sm">
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

      {/* Review Modal */}
      {selectedLeave && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Review Leave Application</h3>
              <button onClick={() => setSelectedLeave(null)} className="close-btn">&times;</button>
            </div>
            <form onSubmit={handleSaveDecision} className="space-y-4 mt-4">
              <p className="text-sm text-zinc-300">
                <strong className="text-white">Applicant:</strong> {selectedLeave.student?.fullName}
              </p>
              <p className="text-sm text-zinc-300">
                <strong className="text-white">Reason:</strong> {selectedLeave.reason}
              </p>

              <div className="form-group">
                <label>Decision</label>
                <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="approved">Approve Leave</option>
                  <option value="rejected">Reject Leave</option>
                  <option value="pending">Keep Pending</option>
                </select>
              </div>

              <div className="form-group">
                <label>Admin Remark</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Approved. Submit departure pass at gate."
                  value={adminRemark}
                  onChange={(e) => setAdminRemark(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setSelectedLeave(null)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Decision</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLeaveManagement;
