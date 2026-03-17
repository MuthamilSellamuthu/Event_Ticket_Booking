import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      padding: '0 24px',
      background: scrolled ? 'rgba(10,10,15,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      transition: 'all 0.3s ease',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>
        
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>🎟️</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Event<span style={{ color: 'var(--accent)' }}>Pulse</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="desktop-nav">
          <Link to="/" style={navLinkStyle(location.pathname === '/')}>Events</Link>
          {isAuthenticated && (
            <Link to="/my-bookings" style={navLinkStyle(location.pathname === '/my-bookings')}>My Tickets</Link>
          )}
          
          <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 8px' }} />

          {isAuthenticated ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--purple), var(--accent))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontWeight: 700,
                  fontSize: '0.9rem', color: '#0a0a0f',
                }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{user?.name}</span>
                <button onClick={handleLogout} className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Logout</button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to="/login" className="btn btn-ghost" style={{ padding: '9px 20px' }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '9px 20px' }}>Sign Up</Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} style={{
          display: 'none', background: 'none', border: 'none',
          color: 'var(--text-primary)', fontSize: 24, cursor: 'pointer',
        }} className="hamburger">☰</button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)',
          padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          <Link to="/" style={{ color: 'var(--text-primary)', padding: '8px 0' }}>Events</Link>
          {isAuthenticated && <Link to="/my-bookings" style={{ color: 'var(--text-primary)', padding: '8px 0' }}>My Tickets</Link>}
          {isAuthenticated ? (
            <button onClick={handleLogout} className="btn btn-ghost" style={{ width: '100%' }}>Logout</button>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
};

const navLinkStyle = (active) => ({
  padding: '8px 14px',
  borderRadius: 'var(--radius-sm)',
  color: active ? 'var(--accent)' : 'var(--text-secondary)',
  fontSize: '0.9rem',
  fontWeight: active ? 600 : 400,
  background: active ? 'var(--accent-dim)' : 'transparent',
  transition: 'all 0.2s',
  textDecoration: 'none',
});

export default Navbar;
