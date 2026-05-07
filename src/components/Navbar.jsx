import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Navbar.css';

function Navbar({ userName }) {
  return (
    <nav className="navbar">
      <div className="nav-wrapper">
        <Link to="/" className="nav-logo">
          <img src="/images/logo.png" alt="Nexora Logo" />
          <span className="logo-text">NEXORA</span>
        </Link>
        
        <div className="nav-links">
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
        </div>

        <div className="nav-right" style={{ display: 'flex', alignItems: 'center' }}>
          <NavLink to="/contact" className="contact-btn">
            CONTACT US
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
