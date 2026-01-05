// src/components/ContactDetails.jsx
import React from 'react';
import { motion } from 'framer-motion';
import './ContactDetails.css';

import githubIcon from '../assets/SocialImages/github.png';
import instagramIcon from '../assets/SocialImages/instagram.png';
import linkedinIcon from '../assets/SocialImages/linkedin.png';
import mailIcon from '../assets/SocialImages/mail.png';
import whatsappIcon from '../assets/SocialImages/whatsapp.png';

// Pre-configured WhatsApp deep link (India number)
const WHATSAPP_NUMBER = '919904135841';
const WHATSAPP_MESSAGE = encodeURIComponent('Hi Krishnaraj! I saw your portfolio and would like to connect.');

const items = [
  { key: 'email', label: 'Email', icon: mailIcon, url: 'https://mail.google.com/mail/?view=cm&fs=1&to=jkrishnaraj4@gmail.com' },
  { key: 'github', label: 'GitHub', icon: githubIcon, url: '#' },
  { key: 'linkedin', label: 'LinkedIn', icon: linkedinIcon, url: 'https://www.linkedin.com/in/j-n-7651a6388/' },
  { key: 'instagram', label: 'Instagram', icon: instagramIcon, url: 'https://www.instagram.com/krishnarajsinh_jadeja_21/?__pwa=1' },
  { key: 'whatsapp', label: 'WhatsApp', icon: whatsappIcon, url: `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}` },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { ease: 'easeOut', duration: 0.3 } },
};

export default function ContactDetails() {
  return (
    <motion.div className="contact-details" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
      {items.map((i) => (
        <motion.a
          key={i.key}
          href={i.url}
          target={i.url?.startsWith('mailto:') ? undefined : '_blank'}
          rel={i.url?.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
          className="contact-item"
          aria-label={i.label}
          variants={itemVariants}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
        >
          <img src={i.icon} alt={i.label} className="contact-icon" />
        </motion.a>
      ))}
    </motion.div>
  );
}
