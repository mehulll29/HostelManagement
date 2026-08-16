import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Trash2 } from 'lucide-react';

const StudentLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    reason: '',
    startDate: '',
    endDate: '',
    destination: '',
    parentContact: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchMyLeaves = async () => {
    try {
      setLoading(true);
      const res = await API.get('/leaves');
      setLeaves(res.data.leaves || []);
    } catch (err) {
      console.error('Error fetching student leaves:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLeaves();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('/leaves', form);
      setMessage({ type: 'success', text: 'Leave application submitted successfully!' });
      setForm({ reason: '', startDate: '', endDate: '', destination: '', parentContact: '' });
      fetchMyLeaves();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to submit leave request' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Cancel/Delete this leave request?')) {
      try {
        await API.delete(`/leaves/${id}`);
        setMessage({ type: 'success', text: 'Leave request deleted' });
        fetchMyLeaves();
      } catch (err) {
        setMessage({ type: 'error', text: err.response?.data?.message || 'Delete failed' });
      }
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <h1>Leave Status</h1>
        <p>View and apply for leave</p>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
          {message.text}
        </div>
      )}

      {/* Apply for Leave — Inline Form Card */}
      <div className="form-section">
        <h2 className="form-section-title">Apply for Leave</h2>

        <form onSubmit={handleSubmit}>
          {/* Row 1: From Date + To Date */}
          <div className="form-grid-2">
            <div className="form-group">
              <label>From Date *</label>
              <input
                type="date"
                className="form-control"
                required
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>To Date *</label>
              <input
                type="date"
                className="form-control"
                required
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </div>
          </div>

          {/* Row 2: Destination + Reason */}
          <div className="form-grid-2">
            <div className="form-group">
              <label>Destination *</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder=""
                value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Reason *</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder=""
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
              />
            </div>
          </div>

          {/* Row 3: Parent/Guardian Contact (full width) */}
          <div className="form-group">
            <label>Parent/Guardian Contact *</label>
            <input
              type="tel"
              className="form-control"
              required
              placeholder="10-digit mobile number"
              value={form.parentContact}
              onChange={(e) => setForm({ ...form, parentContact: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ marginTop: '0.5rem' }}
          >
            {submitting ? 'Submitting...' : 'Apply for Leave'}
          </button>
        </form>
      </div>

      {/* Leave History Table */}
      {leaves.length > 0 && (
        <div className="form-section">
          <h2 className="form-section-title">My Leave Applications</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Reason</th>
                  <th>Destination</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Status</th>
                  <th>Remark</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: '1.5rem', color: '#777' }}>Loading...</td></tr>
                ) : (
                  leaves.map((l) => (
                    <tr key={l._id}>
                      <td style={{ fontWeight: 600 }}>{l.reason}</td>
                      <td style={{ color: '#aaaaaa', fontSize: '0.8125rem' }}>{l.destination || '-'}</td>
                      <td style={{ color: '#aaaaaa', fontSize: '0.8125rem' }}>{new Date(l.startDate).toLocaleDateString()}</td>
                      <td style={{ color: '#aaaaaa', fontSize: '0.8125rem' }}>{new Date(l.endDate).toLocaleDateString()}</td>
                      <td><span className={`badge badge-${l.status}`}>{l.status}</span></td>
                      <td style={{ color: '#cccccc', fontSize: '0.8125rem' }}>{l.adminRemark || '-'}</td>
                      <td>
                        <button onClick={() => handleDelete(l._id)} className="btn btn-danger btn-sm">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentLeave;


