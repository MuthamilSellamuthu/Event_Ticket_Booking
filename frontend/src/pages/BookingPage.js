import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import SeatSelector from '../components/SeatSelector';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        setEvent(res.data.event);
      } catch { setError('Failed to load event'); }
      finally { setLoading(false); }
    };
    fetchEvent();
  }, [id]);

  const handleSeatToggle = (seatId) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    );
  };

  const handleBook = async () => {
    if (selectedSeats.length === 0) { setError('Please select at least one seat.'); return; }
    setBooking(true); setError('');
    try {
      const res = await api.post('/bookings', { eventId: event._id, seats: selectedSeats });
      navigate(`/payment/${res.data.booking._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally { setBooking(false); }
  };

  if (loading) return <div className="loading-container" style={{ paddingTop: 120 }}><div className="spinner" /></div>;
  if (!event) return <div className="container" style={{ paddingTop: 120, color: 'var(--error)' }}>{error || 'Event not found'}</div>;

  const totalPrice = selectedSeats.length * event.price;

  return (
    <div style={{ minHeight: '100vh', paddingTop: 90, paddingBottom: 60, background: 'var(--bg-primary)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-body)' }}>
            ← Back
          </button>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>Select Your Seats</h1>
          <p style={{ color: 'var(--text-secondary)' }}>{event.title}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>
          {/* Seat Selector */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '32px' }}>
            <SeatSelector
              seats={event.seats}
              selectedSeats={selectedSeats}
              onSeatToggle={handleSeatToggle}
              rows={event.rows}
              cols={event.cols}
            />
          </div>

          {/* Summary */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px', position: 'sticky', top: 90 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: 24 }}>Order Summary</h2>

            {/* Event info */}
            <div style={{ padding: 16, background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)', marginBottom: 24 }}>
              <div style={{ fontWeight: 600, marginBottom: 4, fontSize: '0.95rem' }}>{event.title}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                {new Date(event.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} • {event.venue?.city}
              </div>
            </div>

            {/* Selected seats */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Selected Seats</div>
              {selectedSeats.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No seats selected</p>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {selectedSeats.map((s) => (
                    <span key={s} style={{
                      padding: '5px 12px', borderRadius: 8,
                      background: 'var(--accent-dim)', border: '1px solid rgba(232,255,61,0.2)',
                      color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 600,
                    }}>{s}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Price breakdown */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 8 }}>
                <span>₹{event.price?.toLocaleString('en-IN')} × {selectedSeats.length} seats</span>
                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 16 }}>
                <span>Convenience fee</span>
                <span>₹0</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--accent)' }}>
                <span>Total</span>
                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {error && <p style={{ color: 'var(--error)', fontSize: '0.875rem', marginBottom: 16 }}>{error}</p>}

            <button
              className="btn btn-primary"
              onClick={handleBook}
              disabled={booking || selectedSeats.length === 0}
              style={{ width: '100%', justifyContent: 'center', padding: '15px' }}
            >
              {booking ? 'Processing...' : `Proceed to Payment`}
            </button>

            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: 14 }}>
              Selected seats are held for 10 minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
