import React from 'react';

function Contact({ userName }) {
  return (
    <div className="page-container">
      <div className="contact-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div>
          <span className="accent-text">Contact Us</span>
          <h1 className="title-reveal text-reveal">
            {userName ? `Let's Build, ${userName}.` : "Let's Build Together."}
          </h1>
          <p className="subtitle" style={{ marginTop: '1.5rem' }}>
            {userName ? `${userName}, we're ready to bring your vision to life.` : "Whether you're an investor looking for data-driven decisions or a homeowner seeking design excellence, NEXORA is your partner in real estate."}
          </p>

          <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="glass-card">
              <span className="accent-text" style={{ fontSize: '0.6rem' }}>Headquarters</span>
              <div style={{ fontWeight: '600' }}>New Lahore City, Pakistan</div>
            </div>
            <div className="glass-card">
              <span className="accent-text" style={{ fontSize: '0.6rem' }}>Email</span>
              <div style={{ fontWeight: '600' }}>info@nexora.com.pk</div>
            </div>
            <div className="glass-card">
              <span className="accent-text" style={{ fontSize: '0.6rem' }}>Director Key Projects</span>
              <div style={{ fontWeight: '600' }}>Zahid Munir - Premio Homes</div>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: 'clamp(1.5rem, 3vw, 3rem)' }}>
          <form style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="float-field">
              <input type="text" placeholder=" " id="contact-name" defaultValue={userName} />
              <label htmlFor="contact-name">Full Name</label>
            </div>
            <div className="float-field">
              <input type="email" placeholder=" " id="contact-email" />
              <label htmlFor="contact-email">Email Address</label>
            </div>
            <div className="float-field">
              <textarea placeholder=" " id="contact-message" rows="5" />
              <label htmlFor="contact-message">Your Message</label>
            </div>
            <button className="glass-btn primary-btn" type="submit" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>
              SEND INQUIRY
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
