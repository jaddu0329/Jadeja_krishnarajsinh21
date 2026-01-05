import React, { useRef, useEffect, useState } from 'react';
import { motion, useReducedMotion, useAnimation } from 'framer-motion';
import './SkillsFloatingParticles.css';

// --- IMPORTANT ---
// Create a folder at `src/assets/skills/` and place your icon files there.
// Then, update the paths below.
import reactIcon from '../assets/skills/react.png';
import jsIcon from '../assets/skills/javascript.png';
import cssIcon from '../assets/skills/css.png';
import htmlIcon from '../assets/skills/html.png';
import nodeIcon from '../assets/skills/nodejs.png';
import pythonIcon from '../assets/skills/python.png';
import figmaIcon from '../assets/skills/figma.png';
import gitIcon from '../assets/skills/git.png';
import nextjsIcon from '../assets/skills/nextjs.png';
import tailwindIcon from '../assets/skills/tailwind.png';

const skills = [
  { name: 'React', icon: reactIcon },
  { name: 'Next.js', icon: nextjsIcon },
  { name: 'JavaScript', icon: jsIcon },
  { name: 'Node.js', icon: nodeIcon },
  { name: 'HTML5', icon: htmlIcon },
  { name: 'CSS3', icon: cssIcon },
  { name: 'TailwindCSS', icon: tailwindIcon },
  { name: 'Python', icon: pythonIcon },
  { name: 'Figma', icon: figmaIcon },
  { name: 'Git', icon: gitIcon },
];

const Particle = ({ icon, name, containerRef }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const controls = useAnimation();
  const shouldReduceMotion = useReducedMotion();
  const iconSize = 60; // Approximate size of the icon for boundary calculations

  const animate = () => {
    if (!containerRef.current || shouldReduceMotion) return;

    const { width, height } = containerRef.current.getBoundingClientRect();
    
    // Subtle breathing motion - only 2-6px max movement
    const offsetX = (Math.random() - 0.5) * 4; // -2 to +2px
    const offsetY = (Math.random() - 0.5) * 6; // -3 to +3px

    controls.start({
      x: offsetX,
      y: offsetY,
      transition: {
        duration: Math.random() * 3 + 5, // 5-8 seconds for very slow movement
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'mirror',
      },
    });
  };

  useEffect(() => {
    // Set initial random position
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      const startX = Math.random() * (width - iconSize);
      const startY = Math.random() * (height - iconSize);
      setPosition({ x: startX, y: startY });
    }
  }, [containerRef, iconSize]);

  useEffect(() => {
    // Start animation once position is set
    if (position.x !== 0 || position.y !== 0) {
      animate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position]);

  return (
    <motion.div
      className="skill-particle"
      initial={{ x: position.x, y: position.y }}
      animate={controls}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      onHoverStart={() => !shouldReduceMotion && controls.stop()}
      onHoverEnd={() => !shouldReduceMotion && animate()}
    >
      <img src={icon} alt={name} className="skill-icon-img" />
      <span className="skill-name-tooltip">{name}</span>
    </motion.div>
  );
};

const SkillsFloatingParticles = () => {
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  // Initialize subtle floating skills with minimal motion
  const initSubtleFloatingSkills = () => {
    if (shouldReduceMotion) {
      // For reduced motion, render a static grid
      return (
        <div className="skills-static-grid">
          {skills.map((skill) => (
            <div key={skill.name} className="static-skill-item">
              <img src={skill.icon} alt={skill.name} className="skill-icon-img" />
              <span className="static-skill-name">{skill.name}</span>
            </div>
          ))}
        </div>
      );
    }

    // For full motion, render the floating particles
    return skills.map((skill) => (
      <Particle key={skill.name} icon={skill.icon} name={skill.name} containerRef={containerRef} />
    ));
  };

  return (
    <section id="skills" className="page-section">
      <motion.h2
        className="skills-main-title"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        My Skills
      </motion.h2>
      <div className="skills-particle-container" ref={containerRef}>
        {initSubtleFloatingSkills()}
      </div>
    </section>
  );
};

export default SkillsFloatingParticles;