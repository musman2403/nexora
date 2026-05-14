import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, MapPin, Phone, Share2, ExternalLink } from 'lucide-react';

function Footer() {
  return (
    <footer style={{
      background: 'var(--bg)',
      borderTop: '1px solid var(--border)',
      padding: 'clamp(30px, 5vw, 60px) clamp(5%, 8vw, 10%) clamp(20px, 3vw, 30px)',
      position: 'relative',
      zIndex: 10,
      color: 'var(--white)'
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))', gap: '2.5rem' }}>
        <div className="footer-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
            <img src="/favicon.png" alt="Nexora Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
            <h2 style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
              fontWeight: '800',
              margin: 0,
              letterSpacing: '-0.04em',
              fontFamily: 'var(--font-display)',
              background: 'linear-gradient(135deg, #FFFFFF 0%, var(--accent) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>NEXORA VENTURES</h2>
          </div>
          <p style={{ fontSize: '0.82rem', maxWidth: '300px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
            A leading real estate solutions company dedicated to transforming architectural visions into high-value realities.
          </p>
        </div>

        <div>
          <h4 className="accent-text" style={{ marginBottom: '1rem', fontSize: '0.65rem' }}>Company</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.8rem' }}>Home</Link>
            <Link to="/about" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.8rem' }}>Our Story</Link>
            <Link to="/services" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.8rem' }}>Core Services</Link>
            <Link to="/projects" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.8rem' }}>Signature Projects</Link>
            <Link to="/blog" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.8rem' }}>Blog</Link>
          </div>
        </div>

        <div>
          <h4 className="accent-text" style={{ marginBottom: '1rem', fontSize: '0.65rem' }}>Connect</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><MapPin size={14} color="var(--accent)" /> New Lahore City</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Mail size={14} color="var(--accent)" /> contact@nexora.com.pk</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Phone size={14} color="var(--accent)" /> +92 300 123 4567</div>
          </div>
        </div>

        <div>
          <h4 className="accent-text" style={{ marginBottom: '1rem', fontSize: '0.65rem' }}>Follow</h4>
          <div style={{ display: 'flex', gap: '0.7rem' }}>
            {[
              { icon: <Globe size={16} />, label: 'Web' },
              { icon: <Share2 size={16} />, label: 'Social' },
              { icon: <ExternalLink size={16} />, label: 'External' }
            ].map((s, i) => (
              <div key={i} style={{
                padding: '0.6rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                color: 'var(--accent)'
              }}>
                {s.icon}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{
        marginTop: '30px',
        paddingTop: '15px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '0.6rem',
        color: 'var(--text-tertiary)',
        letterSpacing: '0.05em',
        opacity: 0.6,
        textAlign: 'center'
      }}>
        <span>© 2026 NEXORA VENTURES. ALL RIGHTS RESERVED.</span>
      </div>
    </footer>
  );
}

export default Footer;
