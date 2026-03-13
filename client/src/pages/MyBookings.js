import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const statusStyle = {
  completed: { bg: 'rgba(34,197,94,0.15)', color: '#22c55e', label: '✓ Confirmed' },
  pending: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', label: '⏳ Pending' },
  failed: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', label: '✗ Failed' },
  refunded: { bg: 'rgba(148,163,184,0.15)', color: '#94a3b8', label: '↩ Refunded' },
};

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get(`/bookings/user/${user.id}`);
        setBookings(res.data.bookings);
      } catch (err) {
        console.error(err);
      } finally { setLoading(false); }
    };
    if (user?.id) fetchBookings();
  }, [user]);

  if (loading) return <div className="loading-container" style={{ paddingTop: 120 }}><div className="spinner" /></div>;

  return (
    <div style={{ minHeight: '100vh', paddingTop: 90, paddingBottom: 60 }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>My Tickets</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 40 }}>All your bookings in one place</p>

        {bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🎟️</div>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 12, fontSize: '1.3rem' }}>No bookings yet</h3>
            <p style={{ marginBottom: 32 }}>Start discovering amazing events!</p>
            <Link to="/" className="btn btn-primary">Browse Events</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {bookings.map((booking) => {
              const event = booking.eventId;
              const status = statusStyle[booking.paymentStatus] || statusStyle.pending;
              const date = event ? new Date(event.date) : null;

              return (
                <div key={booking._id} style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)', padding: '24px',
                  display: 'flex', gap: 20, alignItems: 'center',
                  transition: 'all 0.2s',
                  animation: 'fadeIn 0.4s ease',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}>
                  
                  {/* Event image */}
                  {event?.image && (
                    <img
                      src={event.image}
                      alt={event.title}
                      style={{ width: 90, height: 70, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  )}

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 12, flexWrap: 'wrap' }}>
                      <div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', marginBottom: 4, lineHeight: 1.3 }}>
                          {event?.title || 'Event'}
                        </h3>
                        {date && (
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                            {date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} • {event?.venue?.city}
                          </p>
                        )}
                      </div>
                      <div style={{
                        padding: '5px 12px', borderRadius: 100,
                        background: status.bg, color: status.color,
                        fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap',
                      }}>
                        {status.label}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, flexWrap: 'wrap', gap: 12 }}>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {booking.seats.map((s) => (
                          <span key={s} style={{ padding: '3px 9px', borderRadius: 6, background: 'rgba(232,255,61,0.1)', border: '1px solid rgba(232,255,61,0.15)', color: 'var(--accent)', fontSize: '0.78rem', fontWeight: 600 }}>{s}</span>
                        ))}
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>• ₹{booking.totalPrice?.toLocaleString('en-IN')}</span>
                      </div>
                      {booking.paymentStatus === 'completed' && (
                        <Link to={`/ticket/${booking._id}`} className="btn btn-secondary" style={{ padding: '7px 16px', fontSize: '0.82rem' }}>
                          View Ticket →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
