import React from 'react';
import { Link } from 'react-router-dom';

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return {
    day: d.toLocaleDateString('en-IN', { day: '2-digit' }),
    month: d.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase(),
    year: d.getFullYear(),
    time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
  };
};

const categoryColors = {
  Music: { bg: 'rgba(124,58,237,0.2)', color: '#a855f7' },
  Sports: { bg: 'rgba(34,197,94,0.15)', color: '#22c55e' },
  Tech: { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
  Arts: { bg: 'rgba(249,115,22,0.15)', color: '#fb923c' },
  Comedy: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
  Food: { bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
  Other: { bg: 'rgba(148,163,184,0.15)', color: '#94a3b8' },
};

const EventCard = ({ event }) => {
  const date = formatDate(event.date);
  const catStyle = categoryColors[event.category] || categoryColors.Other;
  const availPct = (event.availableSeats / event.totalSeats) * 100;
  const isAlmostFull = availPct < 20 && availPct > 0;
  const isSoldOut = availPct === 0;

  return (
    <Link to={`/events/${event._id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        transition: 'all 0.25s ease',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-6px)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
          e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.5)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.boxShadow = 'none';
        }}>
        
        {/* Image */}
        <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
          <img
            src={event.image}
            alt={event.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800'; }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, transparent 50%, rgba(10,10,15,0.9) 100%)',
          }} />
          
          {/* Category badge */}
          <div style={{
            position: 'absolute', top: 14, left: 14,
            padding: '5px 12px', borderRadius: 100,
            background: catStyle.bg, color: catStyle.color,
            fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase', backdropFilter: 'blur(8px)',
          }}>
            {event.category}
          </div>

          {/* Date pill */}
          <div style={{
            position: 'absolute', top: 14, right: 14,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10,
            padding: '8px 12px',
            textAlign: 'center',
            minWidth: 52,
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem', color: 'var(--accent)', lineHeight: 1 }}>{date.day}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', letterSpacing: '0.06em', marginTop: 2 }}>{date.month}</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.05rem', fontWeight: 700,
            color: 'var(--text-primary)', lineHeight: 1.3,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {event.title}
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: '0.83rem' }}>
            <span>📍</span>
            <span>{event.venue?.city}</span>
            <span>•</span>
            <span>{date.time}</span>
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 2 }}>Starting from</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--accent)' }}>
                ₹{event.price?.toLocaleString('en-IN')}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              {isSoldOut ? (
                <span style={{ fontSize: '0.8rem', color: 'var(--error)', fontWeight: 600 }}>Sold Out</span>
              ) : isAlmostFull ? (
                <span style={{ fontSize: '0.8rem', color: 'var(--warning)', fontWeight: 600 }}>⚡ Almost Full</span>
              ) : (
                <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600 }}>✓ Available</span>
              )}
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                {event.availableSeats} seats left
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
