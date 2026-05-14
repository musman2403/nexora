import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Login from './pages/Login';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminProjects from './pages/AdminProjects';
import AdminBlogs from './pages/AdminBlogs';
import AdminQueries from './pages/AdminQueries';
import AdminPartners from './pages/AdminPartners';
import PartnerDetail from './pages/PartnerDetail';
import AdminSettings from './pages/AdminSettings';
import useNexora from './useNexora';
import { supabase } from './supabaseClient';
import { ArrowRight, Sparkles } from 'lucide-react';

// ── Cookie Helpers ──
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

// ── Premium Entry Gate ──
function EntryGate({ onSubmit }) {
  const [name, setName] = useState('');
  const [phase, setPhase] = useState('intro'); // intro → input → exiting
  const inputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setPhase('input'), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase === 'input' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [phase]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setPhase('exiting');
    setTimeout(() => onSubmit(name.trim()), 600);
  };

  const handleSkip = () => {
    setPhase('exiting');
    setTimeout(() => onSubmit(''), 600);
  };

  return (
    <div className={`entry-gate ${phase === 'exiting' ? 'entry-gate--exit' : ''}`}>
      {/* Background grid pattern */}
      <div className="entry-gate__grid" />
      
      <div className={`entry-gate__content ${phase !== 'intro' ? 'entry-gate__content--visible' : ''}`}>
        <div className="entry-gate__icon">
          <Sparkles size={28} />
        </div>
        
        <h2 className="entry-gate__title">Welcome to Nexora</h2>
        <p className="entry-gate__subtitle">
          We'd like to personalize your experience.<br />
          What should we call you?
        </p>

        <form onSubmit={handleSubmit} className="entry-gate__form">
          <div className="entry-gate__input-wrap">
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your first name"
              className="entry-gate__input"
              maxLength={30}
              autoComplete="given-name"
            />
            <div className="entry-gate__input-line" />
          </div>

          <button
            type="submit"
            className={`glass-btn primary-btn entry-gate__btn ${name.trim() ? 'entry-gate__btn--visible' : ''}`}
            disabled={!name.trim()}
          >
            ENTER NEXORA <ArrowRight size={16} />
          </button>
        </form>

        <button onClick={handleSkip} className="entry-gate__skip">
          Continue without personalizing →
        </button>
      </div>
    </div>
  );
}

/* Split Screen Wipe Transition */
function PageWipe() {
  const location = useLocation();
  const wipeRef = useRef(null);

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
      <div className="page-wipe__panel page-wipe__panel--tan" />
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
    const timer = setTimeout(() => setIsReady(true), 400);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    const savedName = getCookie('nexora_user');
    if (savedName) {
      setUserName(savedName);
    } else if (!location.pathname.startsWith('/admin')) {
      setShowEntry(true);
    }

    // Session Tracking
    const trackSession = async () => {
      if (!sessionStorage.getItem('nexora_session_tracked')) {
        try {
          await supabase.from('sessions').insert([{ user_agent: navigator.userAgent }]);
          sessionStorage.setItem('nexora_session_tracked', 'true');
        } catch (e) {
          console.error('Session tracking error:', e);
        }
      }
    };
    
    if (!location.pathname.startsWith('/admin')) {
      trackSession();
    }
  }, []);

  const handleNameSubmit = (name) => {
    if (name) {
      setUserName(name);
      setCookie('nexora_user', name, 365);
    }
    setShowEntry(false);
  };

  const isExcludedRoute = location.pathname.startsWith('/admin') || location.pathname === '/login';

  return (
    <>
      {showEntry && !isExcludedRoute && <EntryGate onSubmit={handleNameSubmit} />}
      <div className={`app-reveal ${isReady && (!showEntry || isExcludedRoute) ? 'is-visible' : ''}`}>
        <PageWipe />
        {!isExcludedRoute && <Navbar userName={userName} />}
        <main>
          <Routes>
            <Route path="/" element={<Home userName={userName} />} />
            <Route path="/about" element={<About userName={userName} />} />
            <Route path="/services" element={<Services userName={userName} />} />
            <Route path="/projects" element={<Projects userName={userName} />} />
            <Route path="/contact" element={<Contact userName={userName} />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/partner/:name" element={<PartnerDetail />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="blogs" element={<AdminBlogs />} />
              <Route path="queries" element={<AdminQueries />} />
              <Route path="partners" element={<AdminPartners />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </main>
        {!isExcludedRoute && <Footer />}
      </div>
    </>
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
