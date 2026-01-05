import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// Smooth, fast, professional fade + slide transition
// Duration: 0.25–0.4s, small translate distance, ease-out timing
// Jitter-free transition: time-based tween, ease-out, small translate
export function fixMotionJitter() {
  return {
    initial: {
      opacity: 0,
      y: 12,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1], // cubic-bezier ease-out
        type: 'tween',
      },
    },
    exit: {
      opacity: 0,
      y: -12,
      transition: {
        duration: 0.28,
        ease: [0.22, 1, 0.36, 1],
        type: 'tween',
      },
    },
  };
}

// Wrapper that animates section enter/leave on viewport changes
const SectionTransition = ({ id, className, children }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: '-20% 0px -20% 0px' });
  const variants = fixMotionJitter();

  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      variants={variants}
      initial="initial"
      animate={inView ? 'animate' : 'exit'}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.section>
  );
};

export default SectionTransition;
