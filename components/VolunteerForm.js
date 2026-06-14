'use client';

import { useState } from 'react';

const SKILLS = [
  'Teaching / Tutoring',
  'Medical / Healthcare',
  'Construction / Repairs',
  'Food Distribution',
  'IT / Tech Support',
  'Counselling / Mental Health',
  'Event Management',
  'Social Media / Marketing',
  'Translation / Interpretation',
  'Other',
];

export default function VolunteerForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    skills: '',
    availability: '',
    message: '',
  });
  const [status, setStatus] = useState(null); // 'loading' | 'success' | 'error'
  const [msg, setMsg] = useState('');

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    setMsg('');

    try {
      const res = await fetch('/api/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        setStatus('success');
        setMsg('🎉 Thank you! Your registration was successful.');
        setForm({ name: '', email: '', phone: '', skills: '', availability: '', message: '' });
      } else {
        setStatus('error');
        setMsg(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMsg('Network error. Please check your connection.');
    }
  }

  return (
    <div className="card">
      {status === 'success' && <div className="alert alert-success">{msg}</div>}
      {status === 'error'   && <div className="alert alert-error">{msg}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Ravi Kumar"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="e.g. ravi@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="e.g. +91 9876543210"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          {/* Skills */}
          <div className="form-group">
            <label htmlFor="skills">Primary Skill *</label>
            <select
              id="skills"
              name="skills"
              value={form.skills}
              onChange={handleChange}
              required
            >
              <option value="">— Select a skill —</option>
              {SKILLS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Availability */}
          <div className="form-group">
            <label htmlFor="availability">Availability *</label>
            <select
              id="availability"
              name="availability"
              value={form.availability}
              onChange={handleChange}
              required
            >
              <option value="">— Select availability —</option>
              <option value="Weekdays">Weekdays</option>
              <option value="Weekends">Weekends</option>
              <option value="Both">Both Weekdays & Weekends</option>
              <option value="Flexible">Flexible</option>
            </select>
          </div>

          {/* Message */}
          <div className="form-group full-width">
            <label htmlFor="message">Additional Message (optional)</label>
            <textarea
              id="message"
              name="message"
              placeholder="Tell us a little about yourself or why you want to volunteer..."
              value={form.message}
              onChange={handleChange}
            />
          </div>

          {/* Submit */}
          <div className="form-actions full-width">
            <button type="submit" className="submit-btn" disabled={status === 'loading'}>
              {status === 'loading' ? 'Submitting...' : 'Submit Registration'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
