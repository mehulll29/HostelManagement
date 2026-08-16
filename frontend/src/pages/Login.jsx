import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Zap } from 'lucide-react';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const data = await login(email, password);
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillQuickLogin = (userEmail, userPass) => {
    setEmail(userEmail);
    setPassword(userPass);
  };

  return (
    <div className="login-page">
      <Link to="/" className="login-back-btn">
        &larr; Back
      </Link>

      <div className="login-card">
        <h1 className="login-title">HostelHub</h1>
        <p className="login-subtitle">Access your portal in dark mode</p>

        <div className="role-toggle">
          <button
            type="button"
            className={role === 'student' ? 'role-btn active' : 'role-btn'}
            onClick={() => setRole('student')}
          >
            <GraduationCap size={28} />
            Student
          </button>
          <button
            type="button"
            className={role === 'admin' ? 'role-btn active' : 'role-btn'}
            onClick={() => setRole('admin')}
          >
            <Zap size={28} />
            Admin
          </button>
        </div>

        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">Username/Email</label>
            <input
              id="login-email"
              type="email"
              className="form-control"
              placeholder="Enter your username or email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#f97316',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.9375rem',
              fontWeight: 700,
              fontFamily: 'inherit',
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.7 : 1,
              marginTop: '0.5rem',
            }}
          >
            {submitting ? 'Logging in...' : 'Login to Portal'}
          </button>
        </form>

        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #333333', textAlign: 'center' }}>
          <p style={{ fontSize: '0.7rem', color: '#777777', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
            Quick Demo
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            <button
              onClick={() => { setRole('admin'); fillQuickLogin('admin@hostelhub.com', 'admin123'); }}
              style={{ background: 'transparent', border: '1px solid #444', borderRadius: '5px', color: '#f97316', fontSize: '0.75rem', padding: '0.3rem 0.75rem', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Admin Creds
            </button>
            <button
              onClick={() => { setRole('student'); fillQuickLogin('mehul@example.com', 'mehul123'); }}
              style={{ background: 'transparent', border: '1px solid #444', borderRadius: '5px', color: '#f97316', fontSize: '0.75rem', padding: '0.3rem 0.75rem', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Student Creds
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
