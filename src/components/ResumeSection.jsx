import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './ResumeSection.css';

const ResumeSection = () => {
  // Place a file at public/resume.pdf or replace with your actual resume URL
  const resumeUrl = '/resume.pdf';
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start center', 'end center'] });
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const titleGlow = useTransform(scrollYProgress, [0, 1], [0.25, 0.6]);
  const titleShadow = useTransform(titleGlow, (v) => `0 0 40px rgba(124, 58, 237, ${v})`);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  const chipHover = {
    scale: 1.04,
    backgroundColor: 'rgba(124, 58, 237, 0.12)',
    borderColor: '#7C3AED',
    color: '#fff',
  };

  return (
    <section id="resume" className="page-section resume-section" ref={sectionRef}>
      {/* Header + Download */}
      <div className="resume-header">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="resume-title"
          style={{ scale: titleScale, textShadow: titleShadow }}
        >
          My Resume
        </motion.h2>
        <a
          className="resume-download-btn"
          href={resumeUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
        >
          Download Resume
        </a>
      </div>

      {/* Profile Card */}
      <motion.div className="resume-card" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
        <motion.h3 className="resume-name" variants={itemVariants}>Jadeja Krishnaraj</motion.h3>
        <motion.div className="resume-meta" variants={itemVariants}>
          <span>🎓 B.Tech — Information Technology (IT)</span>
          <span>•</span>
          <span>📍 Gujarat, India</span>
          <span>•</span>
          <span>✉️ jkrishnaraj4@gmail.com</span>
        </motion.div>
        <motion.p className="resume-summary" variants={itemVariants}>
          Passionate Information Technology student with a strong foundation in web and application development. Skilled in frontend technologies, problem-solving, and building responsive, user-friendly digital experiences. Always eager to learn new technologies and apply them to real-world projects.
        </motion.p>

        {/* Skills */}
        <motion.div className="resume-skills" variants={containerVariants}>
          {['HTML', 'CSS', 'JavaScript', 'React.js', 'Vite', 'Git & GitHub', 'Responsive Web Design', 'Basic Backend & APIs', 'Problem Solving & Debugging'].map((skill) => (
            <motion.span key={skill} className="resume-skill-chip" variants={itemVariants} whileHover={chipHover}>
              {skill}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>

      {/* Education */}
      <motion.div className="resume-education" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
        <div className="edu-card">
          <div className="edu-title">B.Tech in Information Technology (IT)</div>
          <div className="edu-subtitle">AU – Atmiya University, Rajkot</div>
          <div className="edu-duration">2023 – 2026</div>
        </div>
        <div className="edu-card">
          <div className="edu-title">Diploma in Information Technology (IT)</div>
          <div className="edu-subtitle">GTU – L.E. College, Morbi</div>
          <div className="edu-duration">2020 – 2023</div>
        </div>
        <div className="edu-card">
          <div className="edu-title">Secondary (10th)</div>
          <div className="edu-subtitle">Nalanda Vidhyalaya, Morbi</div>
          <div className="edu-duration">2019 – 2020</div>
        </div>
      </motion.div>
    </section>
  );
};

export default ResumeSection;
