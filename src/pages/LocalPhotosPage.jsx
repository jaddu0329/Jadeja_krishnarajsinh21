import React from 'react';
import { motion } from 'framer-motion';

const LocalPhotosPage = () => {
  const [photos, setPhotos] = React.useState([]);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('galleryPhotos');
      if (raw) {
        const parsed = JSON.parse(raw);
        const normalized = Array.isArray(parsed)
          ? parsed.map((p) => (typeof p === 'string' ? { src: p } : p)).filter((p) => p && p.src)
          : [];
        setPhotos(normalized);
      }
    } catch (_) {
      setPhotos([]);
    }
  }, []);

  return (
    <main style={{ minHeight: '100vh', background: '#000', padding: '100px 2rem', boxSizing: 'border-box' }}>
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut', type: 'tween' }}
        style={{ color: '#fff', fontSize: '3rem', fontWeight: 800, textAlign: 'center', marginBottom: '2rem' }}
      >
        Local Photos
      </motion.h1>

      {photos.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          style={{ color: '#9ca3af', textAlign: 'center', maxWidth: 680, margin: '0 auto' }}
        >
          <p>No local photos found in browser storage.</p>
          <p>Save an array under <strong>localStorage.galleryPhotos</strong> with image URLs or base64 data.</p>
          <pre style={{ textAlign: 'left', background: '#111', padding: '1rem', borderRadius: 8, overflowX: 'auto' }}>
{`// Example (run in DevTools console):
const samples = [
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200',
  'https://images.unsplash.com/photo-1520975922202-6b05c1d51f5b?w=1200'
];
localStorage.setItem('galleryPhotos', JSON.stringify(samples));`}
          </pre>
        </motion.div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem',
            maxWidth: 1400,
            margin: '0 auto',
          }}
        >
          {photos.map((p, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut', type: 'tween' }}
              style={{ background: '#111', border: '1px solid #333', borderRadius: 16, overflow: 'hidden' }}
            >
              <img
                src={p.src}
                alt={p.title || `Photo ${idx + 1}`}
                style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }}
              />
              {p.title && (
                <div style={{ padding: '0.75rem 1rem', color: '#fff' }}>{p.title}</div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
};

export default LocalPhotosPage;
