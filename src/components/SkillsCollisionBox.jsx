import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import './SkillsCollisionBox.css';
import SectionTransition from './SectionTransition';

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

// Default per-skill motion speeds (1.0 = baseline)
const DEFAULT_SPEEDS = {
  React: 1.25,
  'Next.js': 1.2,
  JavaScript: 1.3,
  'Node.js': 1.25,
  HTML5: 1.2,
  CSS3: 1.2,
  TailwindCSS: 1.25,
  Python: 1.15,
  Figma: 1.1,
  Git: 1.1,
};

const ICON_SIZE = 70; // Icon diameter for collision detection
const MIN_DISTANCE = ICON_SIZE + 20; // Minimum distance between icons (with buffer)
const PARTICLE_TOTAL_HEIGHT = 100; // ICON_SIZE (70) + label margin (8) + label height (approx 22)
const MAX_ATTEMPTS = 150; // Max attempts to find non-overlapping position
const VELOCITY_DAMPING = 0.995; // Softer damping keeps motion smooth
const MAX_VELOCITY = 2.4; // More speed while staying subtle
const BOUNCE_ELASTICITY = 0.8; // Bounce strength
const REPULSION_FORCE = 0.07; // Lower to reduce jitter on contact

// Calculate distance between two points
const distance = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

// Generate spread-out positions using a full-box grid with slight random jitter
const generateNonOverlappingPositions = (count, containerWidth, containerHeight) => {
  const edgePadding = 12;
  const desiredCellW = ICON_SIZE + 140; // room for icon + label + spacing
  const desiredCellH = PARTICLE_TOTAL_HEIGHT + 80; // vertical room

  // Compute columns to fill the entire width, ensure at least 3
  const cols = Math.max(3, Math.floor((containerWidth - edgePadding * 2) / desiredCellW));
  const rows = Math.max(1, Math.ceil(count / cols));

  // Exact cell size to evenly cover the whole box
  const cellW = (containerWidth - edgePadding * 2) / cols;
  const cellH = (containerHeight - edgePadding * 2) / rows;

  const positions = [];
  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);

    const cellX = edgePadding + col * cellW;
    const cellY = edgePadding + row * cellH;

    const jitterXMax = Math.max(cellW - ICON_SIZE, 0);
    const jitterYMax = Math.max(cellH - PARTICLE_TOTAL_HEIGHT, 0);

    const x = Math.min(
      cellX + Math.random() * jitterXMax,
      containerWidth - ICON_SIZE - edgePadding
    );
    const y = Math.min(
      cellY + Math.random() * jitterYMax,
      containerHeight - PARTICLE_TOTAL_HEIGHT - edgePadding
    );

    positions.push({
      id: i,
      x,
      y,
      vx: (Math.random() - 0.5) * MAX_VELOCITY * 0.5,
      vy: (Math.random() - 0.5) * MAX_VELOCITY * 0.5,
      isHovering: false,
    });
  }

  return positions;
};

// Presentational component for a skill particle using outer transform and inner hover effects
const SkillParticle = ({ skill, pos, domRef, onClick }) => (
  <div
    ref={domRef}
    className="skill-particle-physics"
    style={{
      transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
      willChange: 'transform',
    }}
  >
    <motion.div
      className="skill-interactive"
      whileHover={{ scale: 1.06, opacity: 1 }}
      transition={{ type: 'tween', ease: 'easeOut', duration: 0.2 }}
      onClick={onClick}
    >
      <span className="skill-hover-glow" />
      <div className="skill-icon-container">
        <img src={skill.icon} alt={skill.name} className="skill-icon" />
      </div>
      <span className="skill-label">{skill.name}</span>
    </motion.div>
  </div>
);

const SkillsCollisionBox = () => {
  const containerRef = useRef(null);
  const particlesRef = useRef([]); // Holds the latest particle data for the animation loop
  const particleDomRefs = useRef([]); // DOM refs to avoid re-renders on motion
  const [particles, setParticles] = useState([]); // State to trigger re-renders
  const [isMobile, setIsMobile] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const [skillSpeedMap, setSkillSpeedMap] = useState(DEFAULT_SPEEDS);

  // External navigation mapping to official sites
  const handleExternalAppNavigation = useCallback((skillName) => {
    const MAP = {
      React: 'https://react.dev',
      'Next.js': 'https://nextjs.org',
      JavaScript: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
      'Node.js': 'https://nodejs.org',
      HTML5: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
      CSS3: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
      TailwindCSS: 'https://tailwindcss.com',
      Python: 'https://www.python.org',
      Figma: 'https://www.figma.com',
      Git: 'https://git-scm.com',
    };
    const url = MAP[skillName];
    if (url) {
      try {
        window.open(url, '_blank', 'noopener,noreferrer');
      } catch (_) {
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    }
  }, []);

  // Public function to update motion speed per skill
  const setMotionSpeedForSkills = useCallback((updates) => {
    setSkillSpeedMap((prev) => ({ ...prev, ...updates }));
  }, []);

  // Expose the setter on window for easy tuning during development
  useEffect(() => {
    window.setMotionSpeedForSkills = setMotionSpeedForSkills;
  }, [setMotionSpeedForSkills]);

  // Check for mobile view on mount and resize for performance
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize non-overlapping positions once the container is rendered
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      if (width > 100 && height > 100) {
        const baseParticles = generateNonOverlappingPositions(skillsData.length, width, height);
        const newParticles = baseParticles.map((p, i) => ({
          ...p,
          speed: skillSpeedMap[skillsData[i].name] ?? 1.0,
        }));
        particlesRef.current = newParticles;
        setParticles(newParticles);
        resizeObserver.disconnect();
      }
    });

    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [skillSpeedMap]);

  // Update particle speeds if the map changes
  useEffect(() => {
    particlesRef.current = particlesRef.current.map((p, i) => ({
      ...p,
      speed: skillSpeedMap[skillsData[i].name] ?? p.speed ?? 1.0,
    }));
  }, [skillSpeedMap]);

  // Main physics animation loop
  useEffect(() => {
    if (shouldReduceMotion || isMobile) return;

    let animationFrameId;
    const updatePhysics = () => {
      const container = containerRef.current;
      if (!container) return;

      const { width, height } = container.getBoundingClientRect();
      const nextParticles = particlesRef.current.map(p => ({ ...p }));

      // Update velocities based on inter-particle collisions
      for (let i = 0; i < nextParticles.length; i++) {
        const p1 = nextParticles[i];
        for (let j = i + 1; j < nextParticles.length; j++) {
          const p2 = nextParticles[j];
          const dist = distance(p1.x, p1.y, p2.x, p2.y);

          if (dist < MIN_DISTANCE) {
            const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);

            // Apply repulsion force to both particles
            p1.vx -= cos * REPULSION_FORCE;
            p1.vy -= sin * REPULSION_FORCE;
            p2.vx += cos * REPULSION_FORCE;
            p2.vy += sin * REPULSION_FORCE;
          }
        }
      }

      // Update positions and handle boundary collisions
      nextParticles.forEach(p => {
        // Apply velocity and damping
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= VELOCITY_DAMPING;
        p.vy *= VELOCITY_DAMPING;

        // Boundary collision
        const padding = 10;
        if (p.x <= padding) { p.x = padding; p.vx = Math.abs(p.vx) * BOUNCE_ELASTICITY; }
        if (p.x >= width - ICON_SIZE - padding) { p.x = width - ICON_SIZE - padding; p.vx = -Math.abs(p.vx) * BOUNCE_ELASTICITY; }
        if (p.y <= padding) { p.y = padding; p.vy = Math.abs(p.vy) * BOUNCE_ELASTICITY; } // Top boundary
        if (p.y >= height - PARTICLE_TOTAL_HEIGHT - padding) { p.y = height - PARTICLE_TOTAL_HEIGHT - padding; p.vy = -Math.abs(p.vy) * BOUNCE_ELASTICITY; } // Bottom boundary

        // Enforce minimal motion and cap to per-icon max velocity
        const mag = Math.sqrt(p.vx ** 2 + p.vy ** 2);
        const minSpeed = 0.08 * (p.speed ?? 1.0); // More baseline drift for visible motion
        const maxSpeed = MAX_VELOCITY * (p.speed ?? 1.0);

        // If nearly stationary, nudge proportionally to previous direction
        if (mag < minSpeed) {
          const factor = (minSpeed + 0.0001) / (mag + 0.0001);
          p.vx *= factor;
          p.vy *= factor;
        }

        // Cap maximum speed
        if (mag > maxSpeed) {
          p.vx = (p.vx / mag) * maxSpeed;
          p.vy = (p.vy / mag) * maxSpeed;
        }
      });

      particlesRef.current = nextParticles;
      // Apply transforms directly to DOM nodes to avoid React re-renders
      nextParticles.forEach((p, i) => {
        const el = particleDomRefs.current[i];
        if (el) {
          el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
        }
      });
      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    animationFrameId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationFrameId);
  }, [shouldReduceMotion, isMobile]);

  // Hover is purely visual; no state updates on hover to avoid layout shifts

  // Renders either the physics-based particles or a static grid
  const initCollisionBasedSkillParticles = () => {
    if (shouldReduceMotion || isMobile) {
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

    // Physics-based floating layout
    return particles.map((p, index) => (
      <SkillParticle
        key={skillsData[index].name}
        skill={skillsData[index]}
        pos={p}
        domRef={(el) => { particleDomRefs.current[index] = el; }}
        onClick={() => handleExternalAppNavigation(skillsData[index].name)}
      />
    ));
  };

  return (
    <SectionTransition id="skills" className="page-section skills-section">
      <motion.h2
        className="skills-title"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <span className="skills-title-prefix">My</span>
        <span className="skills-title-accent">Skills</span>
      </motion.h2>

      <motion.p
        className="skills-subtitle"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        Blending technical expertise with creative vision 🚀 — explore my core competencies below.
      </motion.p>

      <div className="skills-collision-box" ref={containerRef}>
        {initCollisionBasedSkillParticles()}
      </div>
    </SectionTransition>
  );
};

export default SkillsCollisionBox;
