import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Navbar.css';

function Navbar({ userName }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-wrapper">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <img src="/favicon.png" alt="Nexora Ventures Logo" />
          <div className="logo-text-container">
            <span className="logo-text-top">NEXORA</span>
            <span className="logo-text-bottom">VENTURES</span>
          </div>
        </Link>

        {/* Desktop nav links — inside wrapper for centering */}
        <div className="nav-links-desktop">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            HOME
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            ABOUT US
          </NavLink>
          <NavLink to="/services" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            SERVICES
          </NavLink>
          <NavLink to="/projects" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            PROJECTS
          </NavLink>
          <NavLink to="/blog" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            BLOG
          </NavLink>
        </div>

        <div className="nav-right">
          {userName && (
            <span style={{ color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', marginRight: '0.8rem' }} className="nav-desktop-cta">
              Hi, {userName}
            </span>
          )}
          <NavLink to="/contact" className="contact-btn nav-desktop-cta">
            CONTACT US
          </NavLink>
          <button
            className={`nav-hamburger ${menuOpen ? 'nav-hamburger--open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile overlay — OUTSIDE nav-wrapper to avoid backdrop-filter containing block */}
      <div className={`nav-mobile-overlay ${menuOpen ? 'nav-mobile-overlay--open' : ''}`}>
        <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
          HOME
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
          ABOUT US
        </NavLink>
        <NavLink to="/services" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
          SERVICES
        </NavLink>
        <NavLink to="/projects" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
          PROJECTS
        </NavLink>
        <NavLink to="/blog" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
          BLOG
        </NavLink>
        <NavLink to="/contact" className="contact-btn" onClick={closeMenu}>
          CONTACT US
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
