// src/components/LightningOverlay.jsx
import React from 'react';

/**
 * LightningOverlay
 * Inline SVG lightning strokes with subtle glow and irregular dash animations.
 * Renders only when `active` is true to avoid unnecessary work.
 */
export default function LightningOverlay({ active }) {
  if (!active) return null;
  return (
    <span className="lightning" aria-hidden="true">
      <svg className="lightning-svg" viewBox="0 0 100 40" preserveAspectRatio="none">
        {/* Top zig-zag bolt (neon blue) */}
        <path
          className="bolt bolt-a"
          d="M6,6 L16,10 L12,12 L24,16 L20,18 L34,20 L28,22 L46,24 L40,26 L58,27 L52,28 L70,29 L66,31 L88,32"
        />
        {/* Right edge fork (electric purple) */}
        <path
          className="bolt bolt-b"
          d="M92,6 L86,12 L92,16 L86,20 L92,24 L86,28 L92,34"
        />
        {/* Bottom ripple bolt (blue/purple mix) */}
        <path
          className="bolt bolt-c"
          d="M8,34 L20,32 L16,30 L28,28 L24,26 L40,24 L36,22 L52,20 L48,18 L66,16 L62,14 L84,12"
        />
      </svg>
    </span>
  );
}
