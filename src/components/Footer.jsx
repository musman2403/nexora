import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, MapPin, Phone, Share2, ExternalLink } from 'lucide-react';

function Footer() {
  return (
    <footer style={{ 
      background: 'var(--cream)',
      borderTop: '1px solid var(--walnut-10)',
      padding: '60px 10% 30px',
      position: 'relative',
      zIndex: 10,
      color: 'var(--ink)'
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '3rem' }}>
        <div style={{ gridColumn: 'span 2' }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            fontWeight: '800', 
            marginBottom: '1rem', 
            letterSpacing: '-0.04em',
            background: 'linear-gradient(135deg, #f5f0e6 0%, var(--tan) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>NEXORA.</h2>
          <p style={{ fontSize: '0.85rem', maxWidth: '300px', lineHeight: '1.6', color: 'var(--muted)' }}>
            A leading real estate solutions company dedicated to transforming architectural visions into high-value realities.
          </p>
        </div>

        <div>
          <h4 className="accent-text" style={{ marginBottom: '1rem', fontSize: '0.65rem' }}>Company</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <Link to="/" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '0.8rem' }}>Home</Link>
            <Link to="/about" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '0.8rem' }}>Our Story</Link>
            <Link to="/services" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '0.8rem' }}>Core Services</Link>
            <Link to="/projects" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '0.8rem' }}>Signature Projects</Link>
          </div>
        </div>

        <div>
          <h4 className="accent-text" style={{ marginBottom: '1rem', fontSize: '0.65rem' }}>Connect</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.8rem', color: 'var(--muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><MapPin size={14} color="var(--tan)" /> New Lahore City</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Mail size={14} color="var(--tan)" /> contact@nexora.com.pk</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Phone size={14} color="var(--tan)" /> +92 300 123 4567</div>
          </div>
        </div>

        <div>
          <h4 className="accent-text" style={{ marginBottom: '1rem', fontSize: '0.65rem' }}>Follow</h4>
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            {[
              { icon: <Globe size={16} />, label: 'Web' },
              { icon: <Share2 size={16} />, label: 'Social' },
              { icon: <ExternalLink size={16} />, label: 'External' }
            ].map((s, i) => (
              <div key={i} style={{ 
                padding: '0.6rem', 
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(193,153,113,0.15)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                color: 'var(--tan)'
              }}>
                {s.icon}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ 
        marginTop: '40px', 
        paddingTop: '20px', 
        borderTop: '1px solid var(--walnut-10)', 
        display: 'flex', 
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.65rem',
        color: 'var(--muted)',
        letterSpacing: '0.05em',
        opacity: 0.6
      }}>
        <span>© 2026 NEXORA VENTURES. ALL RIGHTS RESERVED.</span>
      </div>
    </footer>
  );
}

export default Footer;
