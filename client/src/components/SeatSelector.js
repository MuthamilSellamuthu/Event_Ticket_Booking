import React from 'react';

const SeatSelector = ({ seats, selectedSeats, onSeatToggle, rows, cols }) => {
  const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  if (!seats || seats.length === 0) {
    return <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>No seat data available.</div>;
  }

  const seatRows = [];
  for (let r = 0; r < rows; r++) {
    seatRows.push(seats.slice(r * cols, r * cols + cols));
  }

  const getSeatStatus = (seat) => {
    if (seat.isBooked) return 'booked';
    if (selectedSeats.includes(seat.seatId)) return 'selected';
    return 'available';
  };

  const getSeatStyle = (status) => {
    const base = {
      width: 36, height: 36, borderRadius: 8, display: 'flex',
      alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem',
      fontWeight: 600, cursor: status === 'booked' ? 'not-allowed' : 'pointer',
      transition: 'all 0.15s ease', userSelect: 'none',
      border: '1.5px solid',
    };
    switch (status) {
      case 'booked':
        return { ...base, background: 'rgba(255,255,255,0.04)', borderColor: 'var(--text-muted)', color: 'var(--text-muted)', opacity: 0.4 };
      case 'selected':
        return { ...base, background: 'var(--accent)', borderColor: 'var(--accent)', color: '#0a0a0f', transform: 'scale(1.1)', boxShadow: '0 0 12px rgba(232,255,61,0.4)' };
      default:
        return { ...base, background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.15)', color: 'var(--text-secondary)' };
    }
  };

  return (
    <div>
      {/* Screen indicator */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{
          display: 'inline-block',
          padding: '8px 48px',
          background: 'linear-gradient(to bottom, rgba(232,255,61,0.3), transparent)',
          borderTop: '2px solid var(--accent)',
          borderRadius: '0 0 60px 60px',
          fontSize: '0.75rem', color: 'var(--accent)',
          letterSpacing: '0.2em', textTransform: 'uppercase',
          fontWeight: 600,
        }}>
          STAGE / SCREEN
        </div>
      </div>

      {/* Seat grid */}
      <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
        <div style={{ display: 'inline-block', minWidth: 'max-content', margin: '0 auto' }}>
          {seatRows.map((row, rIdx) => (
            <div key={rIdx} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              {/* Row label */}
              <div style={{
                width: 24, textAlign: 'center', fontSize: '0.75rem',
                color: 'var(--text-muted)', fontWeight: 700, flexShrink: 0,
              }}>
                {rowLabels[rIdx]}
              </div>

              {/* Seats */}
              {row.map((seat) => {
                const status = getSeatStatus(seat);
                return (
                  <div
                    key={seat.seatId}
                    style={getSeatStyle(status)}
                    onClick={() => status !== 'booked' && onSeatToggle(seat.seatId)}
                    title={`${seat.seatId} – ${status}`}
                    onMouseEnter={e => { if (status === 'available') e.currentTarget.style.borderColor = 'var(--accent)'; }}
                    onMouseLeave={e => { if (status === 'available') e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                  >
                    {seat.seatId.slice(1)}
                  </div>
                );
              })}

              {/* Row label right */}
              <div style={{ width: 24, textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                {rowLabels[rIdx]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginTop: 28 }}>
        {[
          { color: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.15)', label: 'Available' },
          { color: 'var(--accent)', border: 'var(--accent)', label: 'Selected' },
          { color: 'rgba(255,255,255,0.04)', border: 'var(--text-muted)', label: 'Booked' },
        ].map(({ color, border, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 18, height: 18, borderRadius: 4, background: color, border: `1.5px solid ${border}` }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatSelector;
