import React, { useRef, useEffect, useState } from 'react';
import { motion, useReducedMotion, useAnimation } from 'framer-motion';
import './SkillsFloatingBox.css';

// Import skill icons from local PNG files
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

const skillsData = [
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

// Individual skill icon component
const SkillIcon = ({ skill, initialPosition, containerRef }) => {
  const controls = useAnimation();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // Start the subtle breathing motion
    if (!shouldReduceMotion && containerRef.current) {
      const startBreathing = () => {
        const offsetX = (Math.random() - 0.5) * 4; // -2 to +2px
        const offsetY = (Math.random() - 0.5) * 4; // -2 to +2px

        controls.start({
          x: offsetX,
          y: offsetY,
          transition: {
            duration: Math.random() * 2 + 4, // 4-6 seconds
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'mirror',
          },
        });
      };

      startBreathing();
    }
  }, [shouldReduceMotion, controls, containerRef]);

  return (
    <motion.div
      className="skill-icon-wrapper"
      initial={{ x: initialPosition.x, y: initialPosition.y }}
      animate={controls}
      whileHover={{ scale: 1.05 }}
    >
      <div className="skill-icon-container">
        <img 
          src={skill.icon} 
          alt={skill.name} 
          className="skill-icon" 
        />
      </div>
      <span className="skill-label">{skill.name}</span>
    </motion.div>
  );
};

const SkillsFloatingBox = () => {
  const containerRef = useRef(null);
  const [positions, setPositions] = useState([]);
  const shouldReduceMotion = useReducedMotion();

  // Initialize positions once on component mount
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const { width, height } = container.getBoundingClientRect();
    const iconSize = 100; // Width + label height
    const iconWidth = 90; // Approximate icon column width

    // Generate random positions distributed across the wide space
    const newPositions = skillsData.map((_, index) => {
      // Distribute icons more evenly across the horizontal space
      const xRange = Math.max(width - iconWidth * 2, 0);
      const yRange = Math.max(height - iconSize - 80, 0);
      
      return {
        x: Math.random() * xRange,
        y: Math.random() * yRange,
      };
    });

    setPositions(newPositions);
  }, []);

  // Initialize wide skills container with minimal motion
  const initWideSkillsContainer = () => {
    if (shouldReduceMotion) {
      // Static grid layout for reduced motion
      return (
        <div className="skills-static-grid">
          {skillsData.map((skill) => (
            <div key={skill.name} className="static-skill-item">
              <div className="skill-icon-container">
                <img src={skill.icon} alt={skill.name} className="skill-icon" />
              </div>
              <span className="skill-label">{skill.name}</span>
            </div>
          ))}
        </div>
      );
    }

    // Floating layout with minimal motion
    return skillsData.map((skill, index) => (
      <SkillIcon
        key={skill.name}
        skill={skill}
        initialPosition={positions[index] || { x: 0, y: 0 }}
        containerRef={containerRef}
      />
    ));
  };

  return (
    <section id="skills" className="page-section skills-section">
      <motion.h2
        className="skills-title"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        My Skills
      </motion.h2>

      <div className="skills-floating-box" ref={containerRef}>
        {initWideSkillsContainer()}
      </div>
    </section>
  );
};

export default SkillsFloatingBox;
