import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Building2, Globe2, Hammer, Droplet, TrendingUp, ShieldCheck, 
  Leaf, Star, CheckCircle, ChevronRight, Briefcase, Users, 
  Layout, Zap, Target, Cpu, Quote, ArrowRight, MousePointer2 
} from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

// ═══════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════

const Entry = ({ onNameSubmit, show }) => {
  const [name, setName] = useState('');
  
  if (!show) return null;

  return (
    <div className={`entry-overlay ${!show ? 'hidden' : ''}`}>
      <div className="entry-content">
        <span className="accent-text" style={{ marginBottom: '0.5rem' }}>WELCOME TO NEXORA</span>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Before we begin...</h2>
        <div className="entry-input-wrap">
          <label className="entry-label">What is your name?</label>
          <input 
            type="text" 
            className="entry-input" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type here..."
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && name.trim() && onNameSubmit(name)}
          />
        </div>
        <div className={`entry-btn ${name.trim().length > 1 ? 'visible' : ''}`}>
          <button 
            className="glass-btn primary-btn" 
            onClick={() => onNameSubmit(name)}
            style={{ padding: '1rem 3rem' }}
          >
            ENTER EXPERIENCE <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

const SectionHeading = ({ accent, title, subtitle, centered = false }) => (
  <div style={{ textAlign: centered ? 'center' : 'left', marginBottom: '4rem', width: '100%' }}>
    {accent && <span className="accent-text">{accent}</span>}
    <h2 className="title-reveal" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>{title}</h2>
    {subtitle && <p className="subtitle" style={{ margin: centered ? '0 auto' : '0' }}>{subtitle}</p>}
  </div>
);

// ═══════════════════════════════════════════
// MAIN HOME COMPONENT
// ═══════════════════════════════════════════

function Home({ userName, showEntry, onNameSubmit }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (showEntry) return;

    const ctx = gsap.context(() => {
      // General section reveal
      gsap.utils.toArray(".home-section").forEach((section) => {
        const content = section.querySelector(".section-content-inner");
        if (!content) return;
        
        gsap.fromTo(content, 
          { y: 50, opacity: 0 },
          {
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "play none none reverse"
            },
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out"
          }
        );
      });

      // Hero specific
      gsap.fromTo(".hero-personal", 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.5, ease: "power4.out" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [showEntry]);

  return (
    <div className="home-container" ref={containerRef}>
      <Entry show={showEntry} onNameSubmit={onNameSubmit} />

      {/* 2. HERO — Hook */}
      <section className="home-section" style={{ 
        minHeight: '100vh', 
        paddingTop: '180px', 
        position: 'relative',
        backgroundImage: 'url("/hero_bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'linear-gradient(90deg, var(--cream) 30%, rgba(13, 9, 7, 0.6) 100%)',
          zIndex: 0 
        }} />
        <div className="section-content-inner" style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero-personal" style={{ marginBottom: '2rem' }}>
            <span className="accent-text">ESTABLISHED EXCELLENCE</span>
            <h1 className="text-reveal" style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', fontWeight: 900, lineHeight: 0.9 }}>
              REDEFINING <br /> <span className="personalized-text">{userName || 'YOUR'}</span> FUTURE.
            </h1>
          </div>
          <p className="subtitle" style={{ fontSize: '1.25rem', maxWidth: '550px' }}>
            Nexora Ventures transforms ambitious visions into high-value architectural realities across Pakistan. 
            We build more than structures; we build legacies.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '3.5rem' }}>
            <button className="glass-btn primary-btn" style={{ padding: '1.2rem 3rem' }}>EXPLORE VISION</button>
            <button className="glass-btn" style={{ padding: '1.2rem 3rem' }}>OUR STORY</button>
          </div>
        </div>
        
        <div className="float-anim" style={{ position: 'absolute', right: '10%', top: '50%', transform: 'translateY(-50%)', opacity: 0.1, pointerEvents: 'none' }}>
           <Building2 size={400} color="var(--tan)" strokeWidth={0.5} />
        </div>
      </section>

      {/* 3. STATS — Credibility */}
      <section className="home-section" style={{ minHeight: '60vh', background: 'var(--parchment)' }}>
        <div className="section-content-inner" style={{ width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem' }}>
            {[
              { val: '20+', label: 'Years of Mastery', suffix: '+' },
              { val: '100%', label: 'Execution Success', suffix: '%' },
              { val: '15+', label: 'Premium Projects', suffix: '+' },
              { val: 'A+', label: 'Quality Standard', suffix: '' }
            ].map((stat, i) => (
              <div key={i} className="stagger-item" style={{ textAlign: 'center' }}>
                <div className="counter-value" data-target={stat.val.replace(/\D/g,'')} data-suffix={stat.suffix} style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--tan)' }}>0</div>
                <div className="counter-label" style={{ letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.5rem' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PROJECT — Desire */}
      <section className="home-section" style={{ minHeight: '100vh' }}>
        <div className="section-content-inner">
          <SectionHeading 
            accent="FEATURED DEVELOPMENT"
            title="Premio Homes"
            subtitle="A masterpiece of modern living, where luxury meets functional brilliance."
          />
          <div className="content-box" style={{ padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', minHeight: '500px' }}>
            <div style={{ overflow: 'hidden' }}>
              <img src="/images/premio_homes_project_1777986545307.png" alt="Premio Homes" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
            </div>
            <div style={{ padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Elevated Lifestyle</h3>
              <p>Premio Homes represents our commitment to redefining urban standards. Every corner is architected for efficiency, precision, and aesthetic pleasure.</p>
              <ul className="feature-list">
                <li><CheckCircle size={18} /> Optimized Spatial Planning</li>
                <li><CheckCircle size={18} /> Sustainable Material Integration</li>
                <li><CheckCircle size={18} /> High-Yield Asset Value</li>
              </ul>
              <button className="glass-btn" style={{ alignSelf: 'flex-start', marginTop: '2rem' }}>VIEW PROJECT DETAILS</button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SERVICES — Clarity */}
      <section className="home-section" style={{ background: 'var(--parchment)' }}>
        <div className="section-content-inner" style={{ width: '100%' }}>
          <SectionHeading 
            accent="OUR CAPABILITIES"
            title="End-to-End Excellence"
            subtitle="We integrate the entire real estate value chain into a seamless experience."
          />
          <div className="services-grid">
            {[
              { icon: <Briefcase />, title: "Consultancy", desc: "Strategic planning and market intelligence for informed investment." },
              { icon: <Building2 />, title: "Development", desc: "Constructing future-ready spaces with uncompromising integrity." },
              { icon: <TrendingUp />, title: "Marketing", desc: "High-impact growth strategies and asset lifecycle management." },
              { icon: <ShieldCheck />, title: "Asset Management", desc: "Preserving and enhancing value for long-term sustainability." }
            ].map((s, i) => (
              <div key={i} className="service-card">
                <div className="service-icon">{s.icon}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
                <div style={{ marginTop: '2rem' }}>
                  <Link to="/services" style={{ color: 'var(--tan)', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    LEARN MORE <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIAL — Trust */}
      <section className="home-section">
        <div className="section-content-inner" style={{ textAlign: 'center', margin: '0 auto', maxWidth: '900px' }}>
          <Quote size={60} color="var(--tan)" style={{ marginBottom: '3rem', opacity: 0.3 }} />
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 400, fontStyle: 'italic', lineHeight: 1.6, color: 'var(--walnut)' }}>
            "Nexora doesn't just build buildings; they build trust. Their integrated approach saved us months of friction and delivered a project that exceeded every benchmark."
          </h2>
          <div style={{ marginTop: '3rem' }}>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--ink)' }}>Arsalan Khan</div>
            <div className="accent-text" style={{ fontSize: '0.7rem' }}>Strategic Investor</div>
          </div>
        </div>
      </section>

      {/* 7. WHY US — Differentiation */}
      <section className="home-section" style={{ background: 'var(--parchment)' }}>
        <div className="section-content-inner" style={{ width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '5% ', alignItems: 'center' }}>
            <div>
              <SectionHeading 
                accent="THE NEXORA ADVANTAGE"
                title="Why We Lead"
                subtitle="In a market of fragmentation, we provide unity and precision."
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {[
                  { title: "Vertical Integration", desc: "No middleman friction. We handle everything from soil to sale." },
                  { title: "Data-Driven Precision", desc: "Every project is backed by rigorous market intelligence." },
                  { title: "Uncompromising Quality", desc: "We adhere to A+ standards in every square foot we build." }
                ].map((item, i) => (
                  <div key={i} style={{ borderLeft: '2px solid var(--walnut-10)', paddingLeft: '2rem' }}>
                    <h4 style={{ color: 'var(--walnut)', marginBottom: '0.5rem' }}>{item.title}</h4>
                    <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <div className="content-box" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <div style={{ textAlign: 'center' }}>
                    <MousePointer2 size={100} color="var(--tan)" style={{ marginBottom: '2rem', opacity: 0.5 }} />
                    <h3>Experience the Edge</h3>
                    <p>Schedule a detailed consultation with our specialists.</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. PROCESS — How It Works */}
      <section className="home-section">
        <div className="section-content-inner" style={{ width: '100%' }}>
          <SectionHeading 
            accent="OUR METHODOLOGY"
            title="The Path to Excellence"
            subtitle="A disciplined, four-phase approach to ensuring every project becomes a benchmark of quality."
            centered
          />
          <div className="process-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', marginTop: '4rem' }}>
            {[
              { num: '01', title: 'Consultation', desc: 'We begin with deep discovery to align your objectives with market realities.', icon: <Users /> },
              { num: '02', title: 'Strategy', desc: 'Our team develops a data-driven blueprint for design, value, and execution.', icon: <Target /> },
              { num: '03', title: 'Execution', desc: 'Precision construction begins, adhering to A+ standards and rigorous oversight.', icon: <Hammer /> },
              { num: '04', title: 'Handover', desc: 'We deliver a turnkey asset, optimized for immediate utility and long-term yield.', icon: <Layout /> }
            ].map((step, i) => (
              <div key={i} className="process-step" style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%', 
                  background: 'var(--parchment)', 
                  border: '1px solid var(--walnut-10)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 2rem',
                  color: 'var(--tan)',
                  position: 'relative'
                }}>
                  {step.icon}
                  <span style={{ 
                    position: 'absolute', 
                    top: '-5px', 
                    right: '-5px', 
                    background: 'var(--tan)', 
                    color: 'var(--cream)', 
                    fontSize: '0.65rem', 
                    fontWeight: 900, 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    {step.num}
                  </span>
                </div>
                <h4 style={{ color: 'var(--ink)', marginBottom: '1rem', fontSize: '1.2rem' }}>{step.title}</h4>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>{step.desc}</p>
                
                {i < 3 && (
                  <div className="process-connector" style={{ 
                    position: 'absolute', 
                    top: '40px', 
                    right: '-25%', 
                    width: '50%', 
                    height: '1px', 
                    background: 'linear-gradient(90deg, var(--walnut-10), transparent)',
                    display: 'none' // Hidden on mobile, handled by media query or desktop logic
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CTA — Close */}
      <section className="home-section" style={{ height: '80vh', textAlign: 'center' }}>
        <div className="section-content-inner" style={{ margin: '0 auto' }}>
          <h2 className="title-reveal" style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)' }}>
            Ready to Build <br /> <span className="personalized-text">{userName ? `With Us, ${userName}?` : 'The Future?'}</span>
          </h2>
          <p className="subtitle" style={{ margin: '2rem auto' }}>
            Join the elite circle of investors and partners shaping the next chapter of Pakistan's skyline.
          </p>
          <div style={{ marginTop: '4rem' }}>
            <Link to="/contact" className="glass-btn primary-btn" style={{ padding: '1.5rem 4rem', fontSize: '1rem' }}>
              INITIATE PARTNERSHIP <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
