import React from 'react';
import { motion } from 'framer-motion';

const SectionDivider = () => {
  return (
    <motion.div
      className="section-divider"
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 0.4 }}
      viewport={{ once: true, amount: 'all' }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    />
  );
};

export default SectionDivider;