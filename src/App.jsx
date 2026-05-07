import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Services from './pages/Services';
import Contact from './pages/Contact';
import useNexora from './useNexora';

// Cookie Helpers
const setCookie = (name, value, days) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
};

const getCookie = (name) => {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, '');
};

/* 9. Split Screen Wipe Transition */
function PageWipe() {
  const location = useLocation();
  const wipeRef = useRef(null);
  const isFirst = useRef(true);

  useEffect(() => {
    const el = wipeRef.current;
    if (!el) return;
    el.classList.add('active');
    const timer = setTimeout(() => el.classList.remove('active'), 600);
    window.scrollTo(0, 0);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="page-wipe" ref={wipeRef}>
      <div className="page-wipe__panel page-wipe__panel--ink" />
      <div className="page-wipe__panel page-wipe__panel--cream" />
    </div>
  );
}

function AppInner() {
  useNexora();
  const [isReady, setIsReady] = useState(false);
  const [userName, setUserName] = useState('');
  const [showEntry, setShowEntry] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsReady(false);
    const timer = setTimeout(() => setIsReady(true), 400); // Fast 0.4s load
    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    const savedName = getCookie('nexora_user_name');
    if (savedName) {
      setUserName(savedName);
    } else {
      setShowEntry(true);
    }
  }, []);

  const handleNameSubmit = (name) => {
    setUserName(name);
    setCookie('nexora_user_name', name, 365);
    setShowEntry(false);
  };

  return (
    <div className={`app-reveal ${isReady ? 'is-visible' : ''}`}>
      <PageWipe />
      <Navbar userName={userName} />
      <main>
        <Routes>
          <Route path="/" element={<Home userName={userName} showEntry={showEntry} onNameSubmit={handleNameSubmit} />} />
          <Route path="/about" element={<About userName={userName} />} />
          <Route path="/services" element={<Services userName={userName} />} />
          <Route path="/projects" element={<Projects userName={userName} />} />
          <Route path="/contact" element={<Contact userName={userName} />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}

export default App;
