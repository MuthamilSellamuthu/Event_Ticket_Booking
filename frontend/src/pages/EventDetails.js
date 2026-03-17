import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        setEvent(res.data.event);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) return <div className="loading-container" style={{ paddingTop: 120 }}><div className="spinner" /></div>;
  if (!event) return <div className="container" style={{ paddingTop: 120 }}>Event not found</div>;

  const date = new Date(event.date);
  const isSoldOut = event.availableSeats === 0;

  return (
    <div style={{ minHeight: '100vh', paddingTop: 70 }}>
      {/* Hero Image */}
      <div style={{ position: 'relative', height: 420, overflow: 'hidden' }}>
        <img
          src={event.image}
          alt={event.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800'; }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(10,10,15,0.3) 0%, rgba(10,10,15,0.95) 100%)',
        }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <div className="container" style={{ paddingBottom: 40 }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 16 }}>
              ← Back to Events
            </Link>
            <div style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '5px 14px', borderRadius: 100,
              background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)',
              fontSize: '0.78rem', color: 'var(--text-primary)', fontWeight: 600,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              marginBottom: 12,
            }}>
              {event.category}
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              color: 'var(--text-primary)', lineHeight: 1.2,
              maxWidth: 700,
            }}>
              {event.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40, alignItems: 'start' }}>
          
          {/* Left */}
          <div>
            {/* Event info cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 40 }}>
              {[
                { icon: '📅', label: 'Date', value: date.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
                { icon: '🕐', label: 'Time', value: date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) },
                { icon: '📍', label: 'Venue', value: `${event.venue?.name}, ${event.venue?.city}` },
                { icon: '🪑', label: 'Seats', value: `${event.availableSeats} of ${event.totalSeats} available` },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)', padding: '18px 20px',
                }}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{label}</div>
                  <div style={{ color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 500 }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px 32px', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: 16, color: 'var(--text-primary)' }}>About this Event</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>{event.description}</p>
            </div>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {event.tags.map((tag) => (
                  <span key={tag} style={{
                    padding: '6px 14px', borderRadius: 100,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)', fontSize: '0.82rem',
                  }}>#{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* Right – booking card */}
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '32px',
            position: 'sticky', top: 90,
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent)', marginBottom: 4 }}>
              ₹{event.price?.toLocaleString('en-IN')}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 28 }}>per seat</div>

            {/* Venue */}
            <div style={{ marginBottom: 28, padding: '16px', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6 }}>📍 VENUE</div>
              <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{event.venue?.name}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{event.venue?.address}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{event.venue?.city}, {event.venue?.country}</div>
            </div>

            {isSoldOut ? (
              <button className="btn" style={{ width: '100%', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', cursor: 'not-allowed' }} disabled>
                Sold Out
              </button>
            ) : isAuthenticated ? (
              <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => navigate(`/book/${event._id}`)}>
                🎟️ Book Tickets
              </button>
            ) : (
              <Link to="/login" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>
                Login to Book
              </Link>
            )}

            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: 16 }}>
              🔒 Secure payment • Instant confirmation
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .details-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default EventDetails;
