import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Box, Shield, Zap, Globe, Layers } from 'lucide-react';
import './EliteLanding.css';

gsap.registerPlugin(ScrollTrigger);

const EliteLanding = () => {
  const containerRef = useRef(null);
  const marqueeRef = useRef(null);
  const revealRef = useRef(null);

  useGSAP(() => {
    // Hero Animation
    const tl = gsap.timeline();
    tl.from('.elite-hero-h1', { y: 100, opacity: 0, duration: 1.2, ease: 'power4.out' })
      .from('.elite-hero-sub', { opacity: 0, y: 20, duration: 0.8 }, '-=0.8')
      .from('.elite-btn-group', { opacity: 0, y: 20, duration: 0.8 }, '-=0.6');

    // Marquee Animation
    gsap.to('.marquee-content', {
      xPercent: -50,
      repeat: -1,
      duration: 20,
      ease: 'none'
    });

    // Bento Cards Entrance
    gsap.from('.bento-card', {
      scrollTrigger: {
        trigger: '.bento-grid',
        start: 'top 80%',
      },
      y: 100,
      opacity: 0,
      stagger: 0.1,
      duration: 1,
      ease: 'power3.out'
    });

    // Scrubbing Text Reveal
    const words = revealRef.current.querySelectorAll('.reveal-word');
    gsap.to(words, {
      scrollTrigger: {
        trigger: revealRef.current,
        start: 'top 70%',
        end: 'bottom 40%',
        scrub: true,
      },
      opacity: 1,
      stagger: 0.1,
      ease: 'none'
    });

    // Image Parallax / Scale on Scroll
    gsap.utils.toArray('.scroll-image-wrap').forEach((wrap) => {
      const img = wrap.querySelector('img');
      gsap.fromTo(img, 
        { scale: 1.2, yPercent: -10 },
        {
          scale: 1,
          yPercent: 10,
          scrollTrigger: {
            trigger: wrap,
            scrub: true,
            start: 'top bottom',
            end: 'bottom top'
          }
        }
      );
    });

    // Footer Stagger
    gsap.from('.footer-cta-title', {
      scrollTrigger: {
        trigger: '.elite-footer',
        start: 'top 80%',
      },
      y: 200,
      opacity: 0,
      duration: 1.5,
      ease: 'power4.out'
    });

  }, { scope: containerRef });

  const bentoItems = [
    { title: 'Smart Infrastructure', desc: 'AI-driven spatial optimization', icon: <Box />, size: 'span-2 row-2', img: 'architecture' },
    { title: 'Cyber Security', desc: 'Protected digital assets', icon: <Shield />, size: 'span-1', img: 'server' },
    { title: 'Instant ROI', desc: 'Predictive analytics integration', icon: <Zap />, size: 'span-1', img: 'money' },
    { title: 'Global Reach', desc: 'Tokenized property network', icon: <Globe />, size: 'span-2', img: 'world' },
    { title: 'Modular Living', desc: 'Adaptive architectural nodes', icon: <Layers />, size: 'span-2', img: 'building' },
  ];

  return (
    <main className="elite-page" ref={containerRef}>
      <nav className="elite-nav">
        <a href="#hero" className="active">Nexus</a>
        <a href="#assets">Assets</a>
        <a href="#vision">Vision</a>
        <a href="#contact">Contact</a>
      </nav>

      {/* Attention: Cinematic Hero */}
      <section id="hero" className="elite-hero">
        <div className="elite-hero-bg"></div>
        <h1 className="elite-hero-h1">
          ARCHITECTING THE <br /> <span>DIGITAL FRONTIER.</span>
        </h1>
        <p className="elite-hero-sub">
          Nexora Ventures fuses high-performance technology with elite real estate to build the smart infrastructure of 2026.
        </p>
        <div className="elite-btn-group">
          <a href="#assets" className="elite-primary-btn">Explore Nodes</a>
          <button className="glass-btn" style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>Get Started</button>
        </div>
      </section>

      {/* Infinite Marquee */}
      <div className="elite-marquee">
        <div className="marquee-content">
          <span>SMART LIVING</span>
          <span>•</span>
          <span>DIGITAL ASSETS</span>
          <span>•</span>
          <span>AI ARCHITECTURE</span>
          <span>•</span>
          <span>QUANTUM REALTY</span>
          <span>•</span>
          <span>SMART LIVING</span>
          <span>•</span>
          <span>DIGITAL ASSETS</span>
          <span>•</span>
          <span>AI ARCHITECTURE</span>
          <span>•</span>
          <span>QUANTUM REALTY</span>
        </div>
      </div>

      {/* Interest: Bento Grid */}
      <section id="assets" className="elite-section">
        <div className="bento-grid">
          {bentoItems.map((item, i) => (
            <div key={i} className={`bento-card ${item.size}`}>
              <img 
                src={`https://picsum.photos/seed/${item.img}/1200/800`} 
                alt={item.title} 
                className="bento-image" 
              />
              <div className="bento-content">
                <div style={{ color: 'var(--elite-cyan)', marginBottom: '1rem' }}>{item.icon}</div>
                <h3 className="bento-title">{item.title}</h3>
                <p className="bento-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Desire: Pinned Scroll & Text Reveal */}
      <section id="vision" className="pin-section">
        <div className="pin-sidebar">
          <span className="accent-text" style={{ color: 'var(--elite-cyan)' }}>THE NEXUS VISION</span>
          <h2 style={{ fontSize: '4rem', fontWeight: 900, marginTop: '1rem' }}>REDEFINING <br />SPACE.</h2>
          <p style={{ color: 'var(--elite-muted)', marginTop: '2rem', maxWidth: '300px' }}>
            We don't just build structures. We deploy intelligent environments that adapt to the human experience.
          </p>
        </div>
        <div className="pin-content">
          <div className="scroll-image-wrap">
            <img src="https://picsum.photos/seed/tech-build/1200/1600" alt="Tech Architecture" />
          </div>
          
          <div className="reveal-text" ref={revealRef}>
            {"The future of real estate is not made of bricks and mortar alone. It is woven from data, intelligence, and sustainable precision. Nexora Ventures is the catalyst for this transformation, ensuring your physical assets thrive in a digital-first economy.".split(' ').map((word, i) => (
              <span key={i} className="reveal-word">{word}</span>
            ))}
          </div>

          <div className="scroll-image-wrap" style={{ marginTop: '10rem' }}>
            <img src="https://picsum.photos/seed/future-city/1200/1600" alt="Future City" />
          </div>
        </div>
      </section>

      {/* Action: Massive Footer */}
      <footer id="contact" className="elite-footer">
        <h2 className="footer-cta-title">BUILD THE <br /> FUTURE.</h2>
        <a href="mailto:nexus@nexora.com" className="elite-primary-btn" style={{ fontSize: '1.5rem', padding: '2rem 5rem' }}>
          INITIATE PROTOCOL <ArrowRight size={24} style={{ marginLeft: '1rem' }} />
        </a>

        <div className="footer-links">
          <div>
            <h4 style={{ color: 'var(--elite-cyan)', marginBottom: '1.5rem' }}>PLATFORM</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li><a href="#">Asset Manager</a></li>
              <li><a href="#">Smart Nodes</a></li>
              <li><a href="#">Security Protocol</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'var(--elite-cyan)', marginBottom: '1.5rem' }}>COMPANY</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li><a href="#">Vision</a></li>
              <li><a href="#">Logistics</a></li>
              <li><a href="#">Infrastructure</a></li>
            </ul>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ fontWeight: 900, fontSize: '2.5rem' }}>NEXORA</h2>
            <p style={{ color: 'var(--elite-muted)', marginTop: '0.5rem' }}>© 2026 Nexus Protocol. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default EliteLanding;
