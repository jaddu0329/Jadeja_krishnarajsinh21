import React from 'react';
import { motion } from 'framer-motion';
import './SocialConnect.css';

// Correctly import images from the single, case-sensitive folder
// The path is relative from 'src/components/' to 'src/assets/SocialImages/'
import githubIcon from "../assets/SocialImages/github.png";
import instagramIcon from "../assets/SocialImages/instagram.png";
import linkedinIcon from "../assets/SocialImages/linkedin.png";
import mailIcon from "../assets/SocialImages/mail.png";
import whatsappIcon from "../assets/SocialImages/whatsapp.png";

const WHATSAPP_NUMBER = '919904135841';
const WHATSAPP_MESSAGE = encodeURIComponent('Hi Krishnaraj! I saw your portfolio and would like to connect.');

const socialLinksData = [
  // TODO: Replace '#' with your actual profile URLs
  { key: 'github', icon: githubIcon, url: '#', alt: 'GitHub' },
  { key: 'linkedin', icon: linkedinIcon, url: 'https://www.linkedin.com/in/j-n-7651a6388/', alt: 'LinkedIn' },
  { key: 'instagram', icon: instagramIcon, url: '#', alt: 'Instagram' },
  { key: 'whatsapp', icon: whatsappIcon, url: `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}` , alt: 'WhatsApp' },
  { key: 'email', icon: mailIcon, url: 'https://mail.google.com/mail/?view=cm&fs=1&to=jkrishnaraj4@gmail.com', alt: 'Email' },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 1.2, // Delay to let main hero content animate in first
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { ease: "easeOut" } },
};

const SocialConnect = () => {
  return (
    <motion.div
      className="social-icons-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {socialLinksData.map((link) => (
        <motion.a
          key={link.key}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon-link"
          aria-label={link.alt}
          variants={itemVariants}
          whileHover={{
            scale: 1.2,
            filter: 'drop-shadow(0 0 8px var(--primary))'
          }}
        >
          <img src={link.icon} alt={link.alt} className="social-icon-img" />
        </motion.a>
      ))}
    </motion.div>
  );
};

export default SocialConnect;
