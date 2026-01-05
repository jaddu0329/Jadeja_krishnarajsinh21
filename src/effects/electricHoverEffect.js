// src/effects/electricHoverEffect.js
import { useState, useMemo } from 'react';

/**
 * electricHoverEffect()
 * React hook to drive the premium electric/thunder hover effect.
 * - Enables effect only on precise pointers (desktop) and when hover is supported
 * - Seeds CSS variables for micro-burst flicker timings and colors
 * - Provides mouse enter/leave handlers and an `active` flag
 */
export function electricHoverEffect(options = {}) {
  const {
    blue = '#5EE3FF', // neon blue
    purple = '#A78BFA', // electric purple
  } = options;

  const [active, setActive] = useState(false);

  const interactive = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const hoverOK = window.matchMedia('(hover: hover)').matches;
    const pointerFine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return hoverOK && pointerFine && !reduced;
  }, []);

  const onMouseEnter = () => {
    if (interactive) setActive(true);
  };
  const onMouseLeave = () => {
    setActive(false);
  };

  // Random micro-burst timing seeds (100–200ms) + small delays
  const vars = useMemo(() => {
    // Helper to clamp and round
    const randMs = (min, max) => Math.round(min + Math.random() * (max - min));

    const speedA = randMs(120, 190);
    const speedB = randMs(110, 180);
    const speedC = randMs(130, 200);
    const delayA = randMs(10, 90);
    const delayB = randMs(0, 70);
    const delayC = randMs(20, 100);

    // Colors
    const blueRgb = hexToRgb(blue);
    const purpleRgb = hexToRgb(purple);

    return {
      '--electric-speed-a': `${speedA}ms`,
      '--electric-speed-b': `${speedB}ms`,
      '--electric-speed-c': `${speedC}ms`,
      '--electric-delay-a': `${delayA}ms`,
      '--electric-delay-b': `${delayB}ms`,
      '--electric-delay-c': `${delayC}ms`,
      '--electric-blue': blue,
      '--electric-purple': purple,
      '--electric-blue-rgb': blueRgb ? `${blueRgb.r}, ${blueRgb.g}, ${blueRgb.b}` : '94, 227, 255',
      '--electric-purple-rgb': purpleRgb ? `${purpleRgb.r}, ${purpleRgb.g}, ${purpleRgb.b}` : '167, 139, 250',
    };
  // Re-seed when activation changes so each hover feels unique
  }, [active, blue, purple]);

  return {
    active,
    events: { onMouseEnter, onMouseLeave },
    style: vars,
  };
}

function hexToRgb(hex) {
  try {
    const normalized = hex.replace('#', '');
    const bigint = parseInt(normalized.length === 3
      ? normalized.split('').map((c) => c + c).join('')
      : normalized, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  } catch (_) {
    return null;
  }
}
