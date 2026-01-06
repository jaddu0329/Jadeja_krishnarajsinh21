// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import './App.css';

// --- Import local assets ---
import cinematicLandscape from './assets/cinematic-landscape.png'; // NOTE: Create an 'assets' folder in 'src' and place your image here.
import myPhoto from './assets/my-photo.png';
import SocialIcons from './components/SocialIcons'; // Import the new SocialIcons component
import StatsSection from './components/StatsSection'; // Import the new StatsSection component
import SplashScreen from './components/SplashScreen';
import SkillsCollisionBox from './components/SkillsCollisionBox';
import SectionDivider from './components/SectionDivider';
import SectionTransition from './components/SectionTransition';
import ElectricButton from './components/ElectricButton';
import ContactDetails from './components/ContactDetails';
import ContactForm from './components/ContactForm';
import FrontConnect from './components/FrontConnect';


// --- Typing Effect Component ---
const TypingEffect = ({ text, start }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (start && currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 25); // Typing speed per character (faster for a smoother feel)
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, start]);

  return (
    <span className="typing-text">
      {displayedText}
      {/* Show cursor only while typing */}
      {currentIndex < text.length && <span className="cursor"></span>}
    </span>
  );
};

// --- Main App Component ---
function App() {
  const [loading, setLoading] = useState(true);
  const [startTyping, setStartTyping] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const navigate = useNavigate();

  // --- Navigation and Content Data ---
  const navItems = ['Home', 'About', 'Gallery', 'Skills', 'Resume', 'Contact'];

  // --- Hooks for Cinematic About Section ---
  const aboutSectionRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: aboutSectionRef,
    // Start when the top of the target hits the top of the viewport
    // End when the bottom of the target hits the bottom of the viewport
    offset: ["start start", "end end"],
  });

  // Image transforms from fullscreen to half-screen
  const imageScale = useTransform(scrollYProgress, [0, 0.4], shouldReduceMotion ? [1, 1] : [2, 1]);
  const imageX = useTransform(scrollYProgress, [0, 0.4], shouldReduceMotion ? ['0vw', '0vw'] : ['25vw', '0vw']);

  // Text box fades and slides in after the image animation is mostly done
  const textOpacity = useTransform(scrollYProgress, [0.5, 0.7], [0, 1]);
  const textX = useTransform(scrollYProgress, [0.5, 0.7], [50, 0]);

  // --- Hooks for Gallery Parallax ---
  const galleryImageRef = useRef(null);
  const galleryHeroContentRef = useRef(null);
  const handleGalleryMouseMove = (e) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width;
    const my = (e.clientY - rect.top) / rect.height;
    const rotY = (mx - 0.5) * 4; // subtle horizontal tilt
    const rotX = -(my - 0.5) * 2; // subtle vertical tilt
    const el = galleryHeroContentRef.current;
    if (el) {
      el.style.transform = `translateY(-50%) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    }
  };
  const handleGalleryMouseLeave = () => {
    const el = galleryHeroContentRef.current;
    if (el) {
      el.style.transform = `translateY(-50%) rotateX(0deg) rotateY(0deg)`;
    }
  };
  const { scrollYProgress: galleryImageScrollYProgress } = useScroll({
    target: galleryImageRef,
    offset: ['start end', 'end start']
  });
  const galleryImageParallaxY = useTransform(galleryImageScrollYProgress, [0, 1], ['-20%', '20%']);


  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -60% 0px' } // Triggers when the section is in the middle of the screen
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    // The cleanup function should disconnect the observer instance.
    // This is more efficient and robust than unobserving each element individually.
    return () => {
      observer.disconnect();
    };
  }, [loading]);

  // On initial load (after splash), jump to the Gallery section
  useEffect(() => {
    if (!loading) {
      const el = document.getElementById('gallery');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [loading]);

  // --- Hobbies Data ---
  const hobbies = [
    { icon: '🎧', text: 'Listening to Music', url: 'https://youtu.be/BWczaSneA0Q?si=8QLNnUKb27yYjyWp' },
    { icon: '📷', text: 'Photography' },
    { icon: '🎮', text: 'Gaming', url: 'https://venge.io/' },
    { icon: '🏀', text: 'Sports & Fitness' }
  ];

  // External Sports Navigation with Live Match Detection
  const handleSportsMatchNavigation = React.useCallback(async () => {
    const LIVE_URLS = [
      'https://www.cricbuzz.com/cricket-match/live-scores',
      'https://www.espncricinfo.com/live-cricket-score',
    ];
    const SUMMARY_URLS = [
      'https://www.cricbuzz.com/cricket-match/live-scores/latest-matches',
      'https://www.espncricinfo.com/series',
    ];
    const FALLBACK_URL = 'https://www.google.com/search?q=ind+match';

    const openExternal = (url) => {
      try {
        window.open(url, '_blank', 'noopener,noreferrer');
      } catch (e) {
        // Fallback to setting location if window.open is blocked
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    };

    // Attempt a lightweight live check (best-effort, with timeout)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    let isLive = false;
    try {
      // Known public endpoint (may be subject to CORS): best-effort only
      const res = await fetch('https://www.cricbuzz.com/match-api/livematches.json', {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json().catch(() => null);
        const matches = data?.matches || data?.match || [];
        for (const m of matches) {
          const t1 = (m?.team1?.name || m?.team1_name || '').toLowerCase();
          const t2 = (m?.team2?.name || m?.team2_name || '').toLowerCase();
          const state = (m?.state || m?.state_title || m?.status || '').toLowerCase();
          const involvesIndia = t1.includes('india') || t2.includes('india') || t1.includes('ind') || t2.includes('ind');
          const liveState = state.includes('live');
          if (involvesIndia && liveState) {
            isLive = true;
            break;
          }
        }
      }
    } catch (_) {
      // Ignore errors (CORS/timeouts); fall back to defaults
    }

    if (isLive) {
      openExternal(LIVE_URLS[0]);
    } else {
      // Try summary first, then fallback
      openExternal(SUMMARY_URLS[0] || FALLBACK_URL);
    }
  }, []);

  // --- Animation Variants ---
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const greetingVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const nameVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
  };

  const underlineVariants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: { scaleX: 1, opacity: 1, transition: { duration: 0.7, ease: "easeOut" } },
  };

  const subtitleVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { ease: "easeOut" } },
  };

  const scaleInVariant = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  };

  const textSlideVariant = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const tagsContainerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const cardsContainerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };

  return (
    <div className="app-container">
      {/* Splash Screen */}
      <AnimatePresence>
        {loading && <SplashScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {/* 
        Main Content Wrapper
        This content is now always in the DOM. We just control its opacity.
        This prevents a race condition where scroll-triggered animations
        might not fire correctly when the entire component tree is mounted at once.
      */}
      <motion.div
        className="main-content-wrapper"
        initial="hidden"
        animate={loading ? "hidden" : "visible"}
        variants={{
          hidden: { opacity: 0, scale: 0.98 },
          visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.2, ease: "easeOut" } }
        }}
      >
          {/* Fixed Social Sidebar */}
          <SocialIcons />

          {/* Navbar */}
          <motion.nav 
            className="navbar"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Left Side: Logo */}
            <a href="#home" className="nav-logo-link">
              <div className="logo-circle">JK</div>
            </a>

            {/* Right Side: Links */}
            <ul className="nav-links">
              {navItems.map((item) => (
                <li key={item}>
                  <a 
                    href={`#${item.toLowerCase()}`} 
                    className={`nav-item ${activeSection === item.toLowerCase() ? 'active' : ''}`}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>

          {/* Hero Section */}
    {/* Inside src/App.jsx -> Hero Section */}
<section className="hero-section" id="home">
  <motion.div
    className="hero-left"
    variants={containerVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
  >
    {/* --- Hero Title Group --- */}
    <div className="hero-title-container">
      <motion.p className="hero-greeting" variants={greetingVariants}>
        Hi! I’m
      </motion.p>
      <motion.h1 className="hero-name" variants={nameVariants}>
        JADEJA KRISHNARAJ
      </motion.h1>
      <motion.div className="hero-underline" variants={underlineVariants}></motion.div>
    </div>

    {/* --- Subtitle --- */}
    <motion.div
      className="subtitle"
      variants={subtitleVariants}
      onAnimationComplete={() => setStartTyping(true)}
    >
      <span>Frontend Developer</span>
      <span>|</span>
      <span>Web & App Developer</span>
      <span>|</span>
      <span>Tech Explorer</span>
    </motion.div>

    {/* --- Description --- */}
    <motion.div className="typing-container" variants={itemVariants}>
      <TypingEffect
        text="Crafting pixel-perfect, interactive web experiences. Turning complex problems into elegant, user-centric code."
        start={startTyping}
      />
    </motion.div>

    {/* --- Tags --- */}
    <motion.div className="tags-container" variants={tagsContainerVariants}>
      {['Frontend Architecture', 'React & Next.js', 'Mobile App Dev', 'UI/UX Design'].map((tag) => (
        <motion.div key={tag} className="tag-chip" variants={scaleInVariant} whileHover={{
          scale: 1.05,
          backgroundColor: 'rgba(124, 58, 237, 0.1)',
          borderColor: '#7C3AED',
          boxShadow: '0 0 20px rgba(124, 58, 237, 0.6)',
          color: '#fff'
        }}>
          {tag}
        </motion.div>
      ))}
    </motion.div>

    {/* --- Info Cards --- */}
    <motion.div className="info-cards" variants={cardsContainerVariants}>
      <motion.div className="card" variants={scaleInVariant} whileHover={{ borderColor: '#7C3AED', y: -5 }}>
        <h3>📍 Location</h3>
        <p>MORBI, Gujarat, India</p>
      </motion.div>
      <motion.div className="card" variants={scaleInVariant} whileHover={{ borderColor: '#5EEAD4', y: -5 }}>
        <h3>📞 Contact</h3>
        <p>jkrishnaraj4@gmail.com</p>
      </motion.div>
    </motion.div>

    {/* --- Front-side Connect section (icons with pulse/ripple on click) --- */}
    <motion.div variants={itemVariants}>
      <FrontConnect />
    </motion.div>

    {/* --- CTA Button with Electric Hover --- */}
    <motion.div className="cta-row" variants={itemVariants} style={{ marginTop: 16 }}>
      <ElectricButton
        onClick={() => {
          const el = document.getElementById('contact');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }}
      >
        ⚡ Contact Me
      </ElectricButton>
    </motion.div>

  </motion.div>

  {/* Right Side Image */}
  <motion.div 
    className="hero-right"
    initial={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
    transition={{ delay: 1, duration: 1, ease: "easeOut" }}
  >
    <div className="image-wrapper">
      <img 
        src={myPhoto} // <-- 2. Use the imported photo
        alt="Jadeja Krishnaraj" 
        className="profile-img" 
      />
    </div>
  </motion.div>
</section>

          {/* Placeholder sections for navigation */}
          <section id="about" className="about-parent-section">
            {/* Part 1: Static, full-viewport heading */}
            <div className="about-heading-viewport">
              <h2 className="about-mega-heading">
                <span>ABOUT </span>
                <span className="gradient-text">ME?</span>
              </h2>
            </div>

            {/* Part 2: Scroll-animated content */}
            <div className="about-animation-section" ref={aboutSectionRef}>
              <div className="about-sticky-wrapper">
                <div className="about-content-flex">
                  {/* Left Side: Image */}
                  <motion.div
                    className="about-image-container"
                    style={{ scale: imageScale, x: imageX }}
                  >
                    <img
                      src={cinematicLandscape}
                      alt="Cinematic landscape"
                      className="about-image"
                    />
                  </motion.div>

                  {/* Right Side: Text */}
                  <motion.div
                    className="about-text-container"
                    style={{ opacity: textOpacity, x: textX }}
                  >
                    <h2 className="about-heading">
                      Who am I?
                    </h2>
                    <p className="about-description">
                      I’m Jadeja Krishnaraj, a passionate website and application developer focused on building modern, user-friendly digital experiences.
                    </p>
                    <p className="about-description">
                      As a 4th-year engineering student, I enjoy turning ideas into real-world applications through code.
                    </p>
                    <p className="about-description">
                      Driven by curiosity and continuous learning, I aim to grow as a developer.
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Hobbies and Achievements are now part of the "About" section for scroll-spy purposes */}
            <div className="page-section hobbies-section">
              <motion.h2 
                  className="hobbies-title"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6 }}
              >
                  Hobbies
              </motion.h2>
              <motion.div 
                  className="hobbies-container"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              >
                  {hobbies.map((hobby) => {
                      const isSports = hobby.text === 'Sports & Fitness';

                      // Build props for ElectricButton (supports anchor via `as`)
                      const btnProps = hobby.url
                        ? {
                            as: 'a',
                            href: hobby.url,
                            target: '_blank',
                            rel: 'noopener noreferrer',
                          }
                        : isSports
                          ? {
                              onClick: handleSportsMatchNavigation,
                              onKeyDown: (e) => {
                                if (e.key === 'Enter' || e.key === ' ') handleSportsMatchNavigation();
                              },
                            }
                          : {};

                      return (
                        <motion.div key={hobby.text} variants={itemVariants}>
                          <ElectricButton
                            className="hobby-electric"
                            {...btnProps}
                            colorBlue="#5EE3FF"
                            colorPurple="#A78BFA"
                            style={{ marginRight: 0 }}
                          >
                            <span className="hobby-icon">{hobby.icon}</span>
                            <span className="hobby-text">{hobby.text}</span>
                          </ElectricButton>
                        </motion.div>
                      );
                  })}
              </motion.div>
            </div>
          </section>

          <SectionDivider />

          {/* --- Gallery Section --- */}
          <SectionTransition id="gallery" className="page-section gallery-section">
            {/* Gallery Heading */}
            <motion.h2
              className="gallery-heading"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              My <span className="gallery-heading-accent">Gallery</span>
            </motion.h2>
            
            {/* Gallery Image */}
            <div className="gallery-image-wrapper" ref={galleryImageRef} onMouseMove={handleGalleryMouseMove} onMouseLeave={handleGalleryMouseLeave}>
              <motion.img
                src={cinematicLandscape}
                alt="Featured gallery"
                className="gallery-main-image"
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: [1.06, 1.02, 1.06] }}
                transition={{ duration: 14, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }}
                style={{ y: galleryImageParallaxY, willChange: 'opacity, transform' }}
              />
              {/* Cinematic overlay for readability */}
              <div className="gallery-hero-overlay" />
              {/* Shine sweep overlay */}
              <div className="gallery-hero-shine" />
              {/* Text Overlay */}
              <motion.div
                className="gallery-hero-content"
                ref={galleryHeroContentRef}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut', type: 'tween' }}
              >
                <h3 className="gallery-hero-title">A Journey Captured in Frames</h3>
                <p className="gallery-hero-description">
                  A curated collection of moments, perspectives, and stories captured through my lens.
                </p>
                <motion.button
                  className="gallery-hero-cta"
                  onClick={() => navigate('/local-photos')}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2, ease: 'easeOut', type: 'tween' }}
                >
                  View My Gallery →
                </motion.button>
              </motion.div>
            </div>

          </SectionTransition>

          <SectionDivider />

          {/* Achievements as its own section below Gallery */}
          <SectionTransition id="achievements" className="page-section">
            <StatsSection />
          </SectionTransition>

          <SectionDivider />

          <SkillsCollisionBox />

          <SectionDivider />

          <SectionTransition id="resume" className="page-section">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Resume
            </motion.h2>
          </SectionTransition>
          <section id="contact" className="page-section">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Contact
            </motion.h2>
            {/* Contact details: email, GitHub, LinkedIn, Instagram, WhatsApp */}
            <ContactDetails />
            {/* Simple contact form */}
            <ContactForm />
          </section>
      </motion.div>
    </div>
  );
}

export default App;