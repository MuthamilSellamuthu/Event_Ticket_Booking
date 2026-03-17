import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import QRCodeGenerator from '../components/QRCodeGenerator';

const TicketPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const [ticketRes, bookingRes] = await Promise.all([
          api.get(`/tickets/booking/${bookingId}`),
          api.get(`/bookings/${bookingId}`),
        ]);
        setTicket(ticketRes.data.ticket);
        setBooking(bookingRes.data.booking);
      } catch (err) {
        setError('Ticket not found');
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [bookingId]);

  if (loading) return <div className="loading-container" style={{ paddingTop: 120 }}><div className="spinner" /></div>;

  if (error || !ticket) return (
    <div style={{ paddingTop: 120, textAlign: 'center', minHeight: '60vh' }} className="container">
      <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
      <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>{error || 'Ticket not found'}</h2>
      <Link to="/" className="btn btn-primary">Back to Events</Link>
    </div>
  );

  const event = ticket.eventId;
  const date = new Date(event?.date);

  return (
    <div style={{ minHeight: '100vh', paddingTop: 90, paddingBottom: 60, background: 'var(--bg-primary)' }}>
      <div className="container" style={{ maxWidth: 720 }}>
        {/* Success banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 100%)',
          border: '1px solid rgba(34,197,94,0.3)',
          borderRadius: 'var(--radius-lg)', padding: '24px 32px',
          marginBottom: 32, display: 'flex', alignItems: 'center', gap: 20,
          animation: 'fadeIn 0.5s ease',
        }}>
          <div style={{ fontSize: 48 }}>🎉</div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', color: '#22c55e', fontSize: '1.3rem', marginBottom: 4 }}>
              Booking Confirmed!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Your e-ticket has been generated. Show the QR code at the venue.
            </p>
          </div>
        </div>

        {/* Ticket */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}>
          {/* Ticket header */}
          <div style={{
            background: `linear-gradient(135deg, var(--purple) 0%, #1a1a4e 100%)`,
            padding: '32px',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
            <div style={{ position: 'absolute', right: 40, bottom: -60, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <span style={{ fontSize: 22 }}>🎟️</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem' }}>EventPulse</span>
              <span style={{ marginLeft: 'auto', padding: '4px 12px', borderRadius: 100, background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.4)', color: '#22c55e', fontSize: '0.75rem', fontWeight: 700 }}>CONFIRMED</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: 8, lineHeight: 1.2 }}>{event?.title}</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>{event?.category} • {event?.venue?.city}</p>
          </div>

          {/* Perforated divider */}
          <div style={{ position: 'relative', height: 2 }}>
            <div style={{ position: 'absolute', left: -1, top: -14, width: 28, height: 28, borderRadius: '50%', background: 'var(--bg-primary)', border: '1px solid var(--border)' }} />
            <div style={{ borderTop: '2px dashed var(--border)', margin: '14px 28px' }} />
            <div style={{ position: 'absolute', right: -1, top: -14, width: 28, height: 28, borderRadius: '50%', background: 'var(--bg-primary)', border: '1px solid var(--border)' }} />
          </div>

          {/* Ticket body */}
          <div style={{ padding: '32px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'start' }}>
            <div>
              {/* Ticket details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
                {[
                  { label: 'DATE', value: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) },
                  { label: 'TIME', value: date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) },
                  { label: 'VENUE', value: event?.venue?.name },
                  { label: 'SEATS', value: ticket.seats.join(', ') },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 4 }}>{label}</div>
                    <div style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.9rem' }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Ticket number */}
              <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 4 }}>TICKET NUMBER</div>
                <div style={{ fontFamily: 'monospace', color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.04em' }}>{ticket.ticketNumber}</div>
              </div>

              {/* Amount */}
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Amount Paid</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--accent)', fontSize: '1.3rem' }}>
                  ₹{booking?.totalPrice?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* QR Code */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <QRCodeGenerator data={ticket.qrData || ticket.ticketNumber} size={160} />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 16, marginTop: 28, flexWrap: 'wrap' }}>
          <Link to="/my-bookings" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
            📋 My Tickets
          </Link>
          <Link to="/" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
            🎟️ Browse More Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TicketPage;
