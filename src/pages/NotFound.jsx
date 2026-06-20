import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

const NotFound = ({ userName }) => {
  return (
    <div className="page-container" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      padding: '120px 2rem 60px'
    }}>
      <SEO title="404 — Page Not Found" description="This page does not exist." noindex={true} />
      {/* Background Radial Glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50vw',
        height: '50vw',
        background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.8
      }} />

      {/* Decorative Grid Lines */}
      <div className="entry-gate__grid" style={{ opacity: 0.5, pointerEvents: 'none' }} />

      <div className="content-box" style={{
        maxWidth: '600px',
        width: '100%',
        padding: '4rem 3rem',
        textAlign: 'center',
        zIndex: 1,
        border: '1px solid var(--border-hover)',
        boxShadow: 'var(--shadow-elevated), var(--shadow-glow)'
      }}>
        {/* Animated Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          background: 'var(--accent-soft)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 2.5rem',
          color: 'var(--accent)',
          animation: 'iconPulse 3s ease-in-out infinite'
        }}>
          <Compass size={40} style={{ animation: 'spin 20s linear infinite' }} />
        </div>

        <h1 style={{
          fontSize: 'clamp(5rem, 12vw, 8rem)',
          lineHeight: 1,
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          margin: '0 0 1rem',
          background: 'linear-gradient(135deg, var(--white) 30%, var(--accent) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.03em'
        }}>
          404
        </h1>

        <h2 style={{
          fontSize: 'var(--text-h3)',
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          marginBottom: '1.5rem',
          color: 'var(--white)'
        }}>
          Page Uncharted
        </h2>

        <p style={{
          color: 'var(--text-secondary)',
          lineHeight: '1.8',
          fontSize: '1.05rem',
          marginBottom: '2.5rem',
          maxWidth: '450px',
          margin: '0 auto 2.5rem'
        }}>
          {userName ? (
            <>
              Sorry <span className="personalized-name">{userName}</span>, the page you are looking for does not exist or has been relocated. Let us guide you back to our homepage.
            </>
          ) : (
            "The page you are looking for does not exist or has been relocated. Let us guide you back to our homepage."
          )}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Link to="/" className="glass-btn primary-btn" style={{ margin: 0 }}>
            <Home size={16} /> RETURN HOME <ArrowRight size={14} style={{ marginLeft: '0.3rem' }} />
          </Link>
        </div>
      </div>

      {/* Embedded CSS for spin animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default NotFound;
