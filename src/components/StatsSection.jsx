import React, { useEffect, useRef } from "react";
import { motion, useInView, animate } from "framer-motion";
import { FaProjectDiagram, FaCalendarAlt, FaLaptopCode } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import "./StatsSection.css";

// Animated number component for the count-up effect
const AnimatedNumber = ({ value }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      // Use the animate function for more direct control over duration
      const controls = animate(0, value, {
        duration: 2.5, // Increased duration to 2.5 seconds for a slower, smoother count
        ease: "easeOut", // Smooth easing at the end
        onUpdate(latest) {
          if (ref.current) {
            // Format with commas for larger numbers
            ref.current.textContent = Math.round(latest).toLocaleString();
          }
        },
      });
      // Cleanup function to stop the animation if the component unmounts
      return () => controls.stop();
    }
  }, [isInView, value]);

  return <span ref={ref}>0</span>;
};

const statsData = [
  {
    icon: <FaProjectDiagram />,
    value: 6,
    label: "Projects Completed",
    suffix: "+",
  },
  {
    icon: <FaCalendarAlt />,
    value: 3,
    label: "Years of Experience",
    suffix: "+",
  },
  {
    icon: <FaLaptopCode />,
    value: 9,
    label: "Technologies Mastered",
    suffix: "+",
  },
  {
    icon: <SiLeetcode />,
    value: 699,
    label: "LeetCode Problems Solved",
    suffix: "+",
  },
];

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const StatsSection = () => {
  return (
    // Changed from a <section> with an id to a <div> to be nested within the "About" section.
    // This ensures the scroll-spy considers it part of "About".
    <div className="page-section stats-section">
      <motion.h2
        className="stats-title"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
      >
        My Achievements
      </motion.h2>
      <motion.div
        className="stats-container"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          visible: { transition: { staggerChildren: 0.15 } },
        }}
      >
        {statsData.map((stat, index) => (
          <motion.div
            key={index}
            className="stat-card"
            variants={cardVariants}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 30px rgba(124, 58, 237, 0.5)",
              borderColor: "rgba(124, 58, 237, 0.7)",
            }}
          >
            <div className="stat-icon">{stat.icon}</div>
            <h3 className="stat-number">
              <AnimatedNumber value={stat.value} />
              {stat.suffix}
            </h3>
            <p className="stat-label">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default StatsSection;