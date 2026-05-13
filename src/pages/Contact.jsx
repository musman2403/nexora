import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Loader } from 'lucide-react';

function Contact({ userName }) {
  const [formData, setFormData] = useState({
    name: userName || '',
    email: '',
    phone: '',
    queryType: '',
    budget: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.id.replace('contact-', '')]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    const fullMessage = `
Phone: ${formData.phone}
Query Type: ${formData.queryType}
Budget: ${formData.budget}

Message:
${formData.message}
    `.trim();

    const { error } = await supabase.from('queries').insert([
      { 
        name: formData.name, 
        email: formData.email, 
        message: fullMessage,
        status: 'New'
      }
    ]);

    if (error) {
      console.error('Error submitting query:', error);
      setStatus('error');
    } else {
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', queryType: '', budget: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <div className="page-container">
      <div className="contact-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div>
          <span className="accent-text">Contact Us</span>
          <h1 className="title-reveal text-reveal" style={{ color: 'var(--white)', fontFamily: 'var(--font-display)' }}>
            {userName ? <>Let's Build Together, <span className="personalized-name">{userName}</span>.</> : "Let's Build Together."}
          </h1>
          <p className="subtitle" style={{ marginTop: '1.5rem' }}>
            Whether you're an investor looking for data-driven decisions or a homeowner seeking design excellence, NEXORA is your partner in real estate.
          </p>

          <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="glass-card" style={{ borderLeft: '3px solid var(--accent)' }}>
              <span className="accent-text" style={{ fontSize: '0.6rem' }}>Headquarters</span>
              <div style={{ fontWeight: '600', color: 'var(--white)' }}>New Lahore City, Pakistan</div>
            </div>
            <div className="glass-card" style={{ borderLeft: '3px solid var(--accent)' }}>
              <span className="accent-text" style={{ fontSize: '0.6rem' }}>Email</span>
              <div style={{ fontWeight: '600', color: 'var(--white)' }}>info@nexora.com.pk</div>
            </div>
            <div className="glass-card" style={{ borderLeft: '3px solid var(--accent)' }}>
              <span className="accent-text" style={{ fontSize: '0.6rem' }}>Director Key Projects</span>
              <div style={{ fontWeight: '600', color: 'var(--white)' }}>Zahid Munir - Premio Homes</div>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: 'clamp(1.5rem, 3vw, 3rem)', border: '1px solid var(--border-hover)', boxShadow: '0 0 30px var(--accent-soft)' }}>
          <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit}>
            <div className="float-field">
              <input type="text" placeholder=" " id="contact-name" value={formData.name} onChange={handleChange} required />
              <label htmlFor="contact-name">Full Name</label>
            </div>
            <div className="float-field">
              <input type="email" placeholder=" " id="contact-email" value={formData.email} onChange={handleChange} required />
              <label htmlFor="contact-email">Email Address</label>
            </div>
            <div className="float-field">
              <input type="tel" placeholder=" " id="contact-phone" value={formData.phone} onChange={handleChange} />
              <label htmlFor="contact-phone">Phone Number (Optional)</label>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="float-field" style={{ marginBottom: 0 }}>
                <select id="contact-queryType" value={formData.queryType} onChange={handleChange} style={{ 
                  width: '100%', 
                  background: 'rgba(0,0,0,0.2)', 
                  border: '1px solid var(--border)', 
                  padding: '1.2rem 1rem 0.5rem', 
                  borderRadius: 'var(--radius-md)', 
                  color: 'var(--text-primary)',
                  outline: 'none',
                  appearance: 'none',
                  cursor: 'pointer'
                }} required>
                  <option value="" disabled hidden></option>
                  <option value="Investment">Investment</option>
                  <option value="Consultancy">Consultancy</option>
                  <option value="Construction">Construction</option>
                  <option value="General">General Inquiry</option>
                </select>
                <label htmlFor="contact-queryType" style={{ top: formData.queryType ? '0.5rem' : '1.2rem', fontSize: formData.queryType ? '0.65rem' : '0.85rem' }}>Query Type</label>
              </div>

              <div className="float-field" style={{ marginBottom: 0 }}>
                <select id="contact-budget" value={formData.budget} onChange={handleChange} style={{ 
                  width: '100%', 
                  background: 'rgba(0,0,0,0.2)', 
                  border: '1px solid var(--border)', 
                  padding: '1.2rem 1rem 0.5rem', 
                  borderRadius: 'var(--radius-md)', 
                  color: 'var(--text-primary)',
                  outline: 'none',
                  appearance: 'none',
                  cursor: 'pointer'
                }}>
                  <option value="" disabled hidden></option>
                  <option value="< 10M PKR">Under 10M PKR</option>
                  <option value="10M - 50M PKR">10M - 50M PKR</option>
                  <option value="50M - 100M PKR">50M - 100M PKR</option>
                  <option value="> 100M PKR">100M+ PKR</option>
                  <option value="Not Sure">Not Sure</option>
                </select>
                <label htmlFor="contact-budget" style={{ top: formData.budget ? '0.5rem' : '1.2rem', fontSize: formData.budget ? '0.65rem' : '0.85rem' }}>Budget Range</label>
              </div>
            </div>

            <div className="float-field">
              <textarea placeholder=" " id="contact-message" rows="5" value={formData.message} onChange={handleChange} required />
              <label htmlFor="contact-message">Your Message</label>
            </div>
            
            <button className="glass-btn primary-btn" type="submit" disabled={status === 'loading'} style={{ marginTop: '1rem', width: '100%', justifyContent: 'center', opacity: status === 'loading' ? 0.7 : 1 }}>
              {status === 'loading' ? <Loader size={18} className="spin" /> : 'SEND INQUIRY'}
            </button>

            {status === 'success' && (
              <div style={{ marginTop: '1rem', color: 'var(--success)', fontSize: '0.85rem', textAlign: 'center', background: 'rgba(74, 222, 128, 0.1)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                Your inquiry has been successfully sent. We will contact you soon!
              </div>
            )}
            {status === 'error' && (
              <div style={{ marginTop: '1rem', color: 'var(--error)', fontSize: '0.85rem', textAlign: 'center', background: 'rgba(248, 113, 113, 0.1)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                An error occurred. Please try again later.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
