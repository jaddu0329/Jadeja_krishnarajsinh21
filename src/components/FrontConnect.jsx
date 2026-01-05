// src/components/FrontConnect.jsx
import React from 'react';
import './FrontConnect.css';
import InteractiveIconLink from './InteractiveIconLink';

import githubIcon from '../assets/SocialImages/github.png';
import instagramIcon from '../assets/SocialImages/instagram.png';
import linkedinIcon from '../assets/SocialImages/linkedin.png';
import mailIcon from '../assets/SocialImages/mail.png';
import whatsappIcon from '../assets/SocialImages/whatsapp.png';
import facebookIcon from '../assets/SocialImages/facebook.png';

export default function FrontConnect() {
  const WA_NUMBER = '919904135841';
  const WA_TEXT = encodeURIComponent('Hi Krishnaraj! I saw your portfolio and would like to connect.');
  const connect = [
    { key: 'linkedin', label: 'LinkedIn', icon: linkedinIcon, href: 'https://www.linkedin.com/in/j-n-7651a6388/' },
    { key: 'email', label: 'Email', icon: mailIcon, href: 'https://mail.google.com/mail/?view=cm&fs=1&to=jkrishnaraj4@gmail.com' },
    { key: 'whatsapp', label: 'WhatsApp', icon: whatsappIcon, href: `https://wa.me/${WA_NUMBER}?text=${WA_TEXT}` },
    { key: 'instagram', label: 'Instagram', icon: instagramIcon, href: 'https://www.instagram.com/krishnarajsinh_jadeja_21/?__pwa=1' },
    { key: 'facebook', label: 'Facebook', icon: facebookIcon, href: 'https://www.facebook.com/krishnarajsinh_jadeja_21' },
  ];

  return (
    <div className="front-connect front-left">
      <div className="front-caption">Connect with me</div>
      <div className="front-icons front-large">
        {connect.map((c) => (
          <InteractiveIconLink
            key={c.key}
            href={c.href}
            label={c.label}
            icon={c.icon}
            target={c.href.startsWith('mailto:') ? undefined : '_blank'}
            rel={c.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
          />
        ))}
      </div>
    </div>
  );
}
