// src/components/ElectricButton.jsx
import React from 'react';
import './ElectricButton.css';
import { electricHoverEffect } from '../effects/electricHoverEffect';

/**
 * ElectricButton
 * A CTA button that exhibits a premium thunder/electric hover effect.
 * Props: { children, onClick, className, style }
 */
export default function ElectricButton({
  children,
  onClick,
  className = '',
  style = {},
  colorBlue,
  colorPurple,
  as = 'button',
  ...rest
}) {
  const { active, events, style: vars } = electricHoverEffect({ blue: colorBlue, purple: colorPurple });

  const classes = `electric-btn ${active ? 'electric-active' : ''} ${className}`;
  const Component = as;

  return (
    <Component
      type={as === 'button' ? 'button' : undefined}
      className={classes}
      onClick={onClick}
      {...events}
      style={{ ...vars, ...style }}
      aria-pressed={active ? 'true' : 'false'}
      {...rest}
    >
      <span className="electric-content">{children}</span>
    </Component>
  );
}
