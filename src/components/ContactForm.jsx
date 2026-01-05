// src/components/ContactForm.jsx
import React, { useState } from 'react';
import './ContactForm.css';
import ElectricButton from './ElectricButton';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // Lightweight default: open mail client prefilled
    // You can swap this with EmailJS/Web3Forms later if desired.
    const subject = encodeURIComponent(`Portfolio Contact – ${form.name || 'Visitor'}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`);
    const mailto = `mailto:jkrishnaraj4@gmail.com?subject=${subject}&body=${body}`;
    setSending(true);
    try {
      window.location.href = mailto;
    } finally {
      // Give the navigation a moment; keep UI responsive
      setTimeout(() => setSending(false), 600);
    }
  };

  return (
    <form className="contact-form" onSubmit={onSubmit} aria-label="Contact form">
      <div className="form-row">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Your full name"
          value={form.name}
          onChange={onChange}
          required
        />
      </div>
      <div className="form-row">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={onChange}
          required
        />
      </div>
      <div className="form-row">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Write your message..."
          value={form.message}
          onChange={onChange}
          required
        />
      </div>
      <div className="form-actions">
        <ElectricButton type="submit" disabled={sending} aria-busy={sending}>
          {sending ? 'Sending…' : 'Send Message'}
        </ElectricButton>
      </div>
    </form>
  );
}
