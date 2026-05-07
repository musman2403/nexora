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
          <img src="/images/logo.png" alt="Nexora Logo" />
          <span className="logo-text">NEXORA</span>
        </Link>
        
        <div className={`nav-links ${menuOpen ? 'nav-links--open' : ''}`}>
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
          <NavLink to="/contact" className="contact-btn nav-mobile-cta" onClick={closeMenu}>
            CONTACT US
          </NavLink>
        </div>

        <div className="nav-right">
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
    </nav>
  );
}

export default Navbar;
