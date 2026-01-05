// src/components/InteractiveIconLink.jsx
import React, { useState } from 'react';
import './InteractiveIconLink.css';

export default function InteractiveIconLink({ href, label, icon, target, rel }) {
  const [pulse, setPulse] = useState(false);

  const onClick = (e) => {
    // Play a short pulse/ripple effect before navigation
    setPulse(true);
    setTimeout(() => setPulse(false), 450);

    // If opening in new tab, allow default
    const isMail = href?.startsWith('mailto:');
    if (!isMail && target === '_blank') {
      return; // default anchor behavior
    }

    // Otherwise, control navigation after a tiny delay
    e.preventDefault();
    setTimeout(() => {
      try {
        window.open(href, target || '_self', 'noopener,noreferrer');
      } catch (_) {
        const a = document.createElement('a');
        a.href = href;
        if (target) a.target = target;
        if (rel) a.rel = rel;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    }, 120);
  };

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      aria-label={label}
      className={`interactive-icon ${pulse ? 'pulse' : ''}`}
      onClick={onClick}
    >
      <span className="icon-ripple" aria-hidden="true" />
      <img src={icon} alt={label} className="icon-img" />
    </a>
  );
}
