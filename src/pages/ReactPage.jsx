import React from 'react';
import { motion } from 'framer-motion';

const ReactPage = () => {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0a0a0a' }}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut', type: 'tween' } }}
        exit={{ opacity: 0, y: -12, transition: { duration: 0.28, ease: 'easeOut', type: 'tween' } }}
        style={{ color: '#fff', textAlign: 'center' }}
      >
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>React</h1>
        <p>Welcome to the React page.</p>
      </motion.div>
    </main>
  );
};

export default ReactPage;
