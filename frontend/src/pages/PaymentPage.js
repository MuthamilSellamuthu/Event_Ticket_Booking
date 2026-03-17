import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const paymentMethods = [
  { id: 'card', icon: '💳', label: 'Credit / Debit Card' },
  { id: 'upi', icon: '📱', label: 'UPI' },
  { id: 'netbanking', icon: '🏦', label: 'Net Banking' },
  { id: 'wallet', icon: '👛', label: 'Wallet' },
];

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get(`/bookings/${bookingId}`);
        setBooking(res.data.booking);
      } catch { setError('Booking not found'); }
      finally { setLoading(false); }
    };
    fetchBooking();
  }, [bookingId]);

  const handlePayment = async () => {
    setProcessing(true); setError('');
    try {
      await api.post('/payment', { bookingId, paymentMethod });
      navigate(`/ticket/${bookingId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  if (loading) return <div className="loading-container" style={{ paddingTop: 120 }}><div className="spinner" /></div>;
  if (!booking) return <div className="container" style={{ paddingTop: 120 }}>{error}</div>;

  const event = booking.eventId;

  return (
    <div style={{ minHeight: '100vh', paddingTop: 90, paddingBottom: 60 }}>
      <div className="container" style={{ maxWidth: 720 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: 24, fontFamily: 'var(--font-body)' }}>
          ← Back
        </button>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>Complete Payment</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 40 }}>Choose your payment method</p>

        {/* Order summary */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Order</div>
              <div style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: 4 }}>{event?.title}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{event?.venue?.city} • {new Date(event?.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</div>
              <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {booking.seats.map((s) => (
                  <span key={s} style={{ padding: '4px 10px', borderRadius: 6, background: 'var(--accent-dim)', border: '1px solid rgba(232,255,61,0.2)', color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 600 }}>{s}</span>
                ))}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.6rem', color: 'var(--accent)' }}>
                ₹{booking.totalPrice?.toLocaleString('en-IN')}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{booking.seats.length} seat{booking.seats.length > 1 ? 's' : ''}</div>
            </div>
          </div>
        </div>

        {/* Payment methods */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px', marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 20, fontSize: '1rem' }}>Payment Method</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {paymentMethods.map((pm) => (
              <label key={pm.id} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '16px 20px', borderRadius: 'var(--radius-md)',
                border: `1.5px solid ${paymentMethod === pm.id ? 'var(--accent)' : 'var(--border)'}`,
                background: paymentMethod === pm.id ? 'var(--accent-dim)' : 'transparent',
                cursor: 'pointer', transition: 'all 0.2s',
              }}>
                <input type="radio" name="payment" value={pm.id} checked={paymentMethod === pm.id} onChange={() => setPaymentMethod(pm.id)} style={{ display: 'none' }} />
                <span style={{ fontSize: 22 }}>{pm.icon}</span>
                <span style={{ fontWeight: paymentMethod === pm.id ? 600 : 400, color: paymentMethod === pm.id ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  {pm.label}
                </span>
                {paymentMethod === pm.id && <span style={{ marginLeft: 'auto', color: 'var(--accent)', fontSize: '1.1rem' }}>✓</span>}
              </label>
            ))}
          </div>
        </div>

        {/* Demo note */}
        <div style={{
          padding: '14px 20px', borderRadius: 'var(--radius-md)',
          background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
          color: '#fbbf24', fontSize: '0.85rem', marginBottom: 24,
        }}>
          🔔 <strong>Demo Mode:</strong> Payment is simulated. No real transaction will occur.
        </div>

        {error && <p style={{ color: 'var(--error)', marginBottom: 16 }}>{error}</p>}

        <button
          className="btn btn-primary btn-lg"
          onClick={handlePayment}
          disabled={processing}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          {processing ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 18, height: 18, border: '2px solid #0a0a0f', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} />
              Processing...
            </span>
          ) : `Pay ₹${booking.totalPrice?.toLocaleString('en-IN')}`}
        </button>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: 16 }}>
          🔒 256-bit SSL Encryption • PCI DSS Compliant
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;
