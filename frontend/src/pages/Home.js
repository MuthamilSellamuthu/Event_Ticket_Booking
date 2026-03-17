import React, { useState, useEffect } from 'react';
import api from '../services/api';
import EventCard from '../components/EventCard';

const categories = ['All', 'Music', 'Sports', 'Tech', 'Arts', 'Comedy', 'Food'];

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line
  }, [category, page]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (category !== 'All') params.category = category;
      if (search) params.search = search;
      const res = await api.get('/events', { params });
      setEvents(res.data.events);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchEvents();
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{
        position: 'relative',
        paddingTop: 140,
        paddingBottom: 80,
        background: `
          radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,58,237,0.25) 0%, transparent 60%),
          radial-gradient(ellipse 50% 40% at 80% 20%, rgba(232,255,61,0.08) 0%, transparent 50%),
          var(--bg-primary)
        `,
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        {/* Floating orbs */}
        <div style={{
          position: 'absolute', width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
          top: -100, left: '10%', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,255,61,0.08) 0%, transparent 70%)',
          top: 50, right: '15%', pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 100,
            background: 'rgba(232,255,61,0.1)', border: '1px solid rgba(232,255,61,0.2)',
            color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 600,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            marginBottom: 24,
          }}>
            🎟️ Book. Experience. Remember.
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.4rem, 5vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            color: 'var(--text-primary)',
            marginBottom: 20,
            letterSpacing: '-0.03em',
          }}>
            Your Next Unforgettable<br />
            <span style={{ color: 'var(--accent)' }}>Experience</span> Awaits
          </h1>

          <p style={{
            color: 'var(--text-secondary)', fontSize: '1.1rem',
            maxWidth: 540, margin: '0 auto 40px',
          }}>
            Discover concerts, sports, tech events, and more. Book seats instantly with secure payments.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} style={{
            display: 'flex', gap: 12, maxWidth: 560,
            margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center',
          }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events, artists, venues..."
              style={{
                flex: 1, minWidth: 280,
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'var(--text-primary)',
                padding: '14px 20px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.95rem',
              }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '14px 28px' }}>
              🔍 Search
            </button>
          </form>
        </div>
      </div>

      {/* Category filter */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 70, zIndex: 100 }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 8, padding: '14px 0', overflowX: 'auto' }}>
            {categories.map((cat) => (
              <button key={cat} onClick={() => { setCategory(cat); setPage(1); }}
                style={{
                  padding: '8px 18px', borderRadius: 100, border: 'none',
                  background: category === cat ? 'var(--accent)' : 'rgba(255,255,255,0.06)',
                  color: category === cat ? '#0a0a0f' : 'var(--text-secondary)',
                  fontWeight: category === cat ? 700 : 400,
                  fontSize: '0.875rem', cursor: 'pointer',
                  whiteSpace: 'nowrap', transition: 'all 0.2s',
                  fontFamily: 'var(--font-body)',
                }}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events grid */}
      <div className="container" style={{ padding: '48px 24px' }}>
        {loading ? (
          <div className="loading-container">
            <div className="spinner" />
            <p>Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎭</div>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>No events found</h3>
            <p>Try a different category or search term</p>
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 24,
            }}>
              {events.map((event, i) => (
                <div key={event._id} style={{ animation: `fadeIn 0.4s ease ${i * 0.05}s both` }}>
                  <EventCard event={event} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 48 }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setPage(p)}
                    style={{
                      width: 40, height: 40, borderRadius: 10, border: '1px solid',
                      borderColor: page === p ? 'var(--accent)' : 'var(--border)',
                      background: page === p ? 'var(--accent)' : 'transparent',
                      color: page === p ? '#0a0a0f' : 'var(--text-secondary)',
                      fontWeight: 600, cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                    }}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
