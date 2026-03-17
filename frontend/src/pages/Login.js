import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally { setLoading(false); }
  };

  const fillDemo = () => setForm({ email: 'john@example.com', password: 'password123' });
  const fillAdmin = () => setForm({ email: 'admin@eventpulse.com', password: 'admin123' });

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
      background: `radial-gradient(ellipse 70% 60% at 30% 40%, rgba(124,58,237,0.2) 0%, transparent 60%), var(--bg-primary)`,
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎟️</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>
            Welcome back
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Sign in to your EventPulse account</p>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '36px' }}>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', color: 'var(--error)', fontSize: '0.875rem', marginBottom: 20 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          {/* Demo credentials */}
          <div style={{ marginTop: 24, padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: 10, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Quick Demo</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={fillDemo} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem', padding: '8px' }}>User Demo</button>
              <button onClick={fillAdmin} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem', padding: '8px' }}>Admin Demo</button>
            </div>
          </div>

          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 24 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
