import React from 'react';

const SectionDivider = () => {
  return (
    <div
      className="section-divider"
      aria-hidden="true"
      style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '2rem auto',
        height: '1px',
        background: 'linear-gradient(90deg, rgba(94, 234, 212, 0), rgba(94, 234, 212, 0.4), rgba(94, 234, 212, 0))'
      }}
    />
  );
};

export default SectionDivider;
