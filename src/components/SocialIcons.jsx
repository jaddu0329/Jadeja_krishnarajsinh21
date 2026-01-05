import React from "react";
import { motion } from "framer-motion";
import {
  FaLinkedin,
  FaGithub,
  FaInstagram,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import "./SocialIcons.css";

// --- Animation Variants ---
const sidebarContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 1.5, // Delay to let main page content animate in first
    },
  },
};

const iconVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { ease: "easeOut" } },
};

// --- Data for Social Links ---
const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/j-n-7651a6388/",
    icon: <FaLinkedin />,
  },
  { label: "Email", href: "https://mail.google.com/mail/?view=cm&fs=1&to=jkrishnaraj4@gmail.com", icon: <MdEmail /> },
  {
    label: "GitHub",
    href: "https://github.com/your-github-username", // TODO: Update this link
    icon: <FaGithub />,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/krishnarajsinh_jadeja_21/?__pwa=1",
    icon: <FaInstagram />,
  },
];

const SocialIcons = () => {
  return (
    <motion.div
      className="social-sidebar"
      variants={sidebarContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {socialLinks.map((link) => (
        <motion.a
          key={link.label}
          href={link.href}
          target={link.label !== "Email" ? "_blank" : "_self"}
          rel="noopener noreferrer"
          aria-label={link.label}
          variants={iconVariants}
        >
          {link.icon}
        </motion.a>
      ))}
    </motion.div>
  );
};

export default SocialIcons;
