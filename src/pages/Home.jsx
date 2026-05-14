import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Building2, Globe2, Hammer, Droplet, TrendingUp, ShieldCheck,
  Leaf, Star, CheckCircle, ChevronRight, Briefcase, Users,
  Layout, Zap, Target, Cpu, Quote, ArrowRight, X, ChevronLeft
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

gsap.registerPlugin(ScrollTrigger);

// ═══════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════

const TextSlider = ({ text }) => {
  return (
    <div className="text-slider-container">
      <div className="text-slider-track">
        {[...Array(10)].map((_, i) => (
          <span key={i} className="text-slider-item">
            {text} <span className="separator">|</span>
          </span>
        ))}
      </div>
    </div>
  );
};

const FloatingHeadline = ({ text }) => {
  return (
    <div className="floating-headline-container">
      <div className="accent-bar bar-left" />
      <div className="floating-headline-text">
        {text}
      </div>
      <div className="accent-bar bar-right" />
    </div>
  );
};

const Carousel = () => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    async function fetchPartners() {
      const { data } = await supabase.from('partners').select('*').order('created_at', { ascending: false });
      if (data && data.length > 0) {
        setPartners(data);
      }
    }
    fetchPartners();
  }, []);

  const fallbackLogos = [
    { id: 1, name: "AeroTech", icon: <Cpu size={32} /> },
    { id: 2, name: "EcoBuild", icon: <Leaf size={32} /> },
    { id: 3, name: "Fortress", icon: <ShieldCheck size={32} /> },
    { id: 4, name: "GlobalNet", icon: <Globe2 size={32} /> },
    { id: 5, name: "Titan", icon: <Hammer size={32} /> },
    { id: 6, name: "AquaCorp", icon: <Droplet size={32} /> },
  ];

  const displayList = partners.length > 0 ? partners : fallbackLogos;

  return (
    <div style={{ width: '100%', overflow: 'hidden', padding: '3rem 0', position: 'relative', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--text-tertiary)', fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
        TRUSTED BY INDUSTRY LEADERS
      </div>
      <style>
        {`
          @keyframes scroll-logos {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .logo-track {
            display: flex;
            width: 200%;
            animation: scroll-logos 40s linear infinite;
            align-items: center;
          }
          .logo-item {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.8rem;
            color: var(--text-tertiary);
            font-weight: 700;
            font-size: 1.5rem;
            opacity: 0.4;
            transition: all 0.3s ease;
            cursor: pointer;
            text-decoration: none;
          }
          .logo-item:hover {
            opacity: 1;
            color: var(--accent);
          }
        `}
      </style>
      <div className="logo-track">
        {[...displayList, ...displayList, ...displayList, ...displayList].map((p, i) => (
          <div key={i} className="logo-item" onClick={() => p.logo_url !== undefined && navigate(`/partner/${encodeURIComponent(p.name)}`)}>
            {p.logo_url ? (
              <img src={p.logo_url} alt={p.name} style={{ height: '40px', objectFit: 'contain' }} loading="lazy" />
            ) : (
              p.icon
            )}
            {!p.logo_url && <span>{p.name}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

const SectionHeading = ({ accent, title, subtitle, centered = false }) => (
  <div style={{ textAlign: centered ? 'center' : 'left', marginBottom: '3rem', width: '100%' }}>
    {accent && <span className="accent-text">{accent}</span>}
    <h2 className="title-reveal" style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', fontFamily: 'var(--font-display)' }}>{title}</h2>
    {subtitle && <p className="subtitle" style={{ margin: centered ? '0 auto' : '0' }}>{subtitle}</p>}
  </div>
);

// ═══════════════════════════════════════════
// MAIN HOME COMPONENT
// ═══════════════════════════════════════════

function Home({ userName }) {
  const containerRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [heroHeadline, setHeroHeadline] = useState('Nexora Ventures delivers integrated real estate solutions — from strategic acquisition to turnkey delivery — for investors who demand precision.');
  const [tickerText, setTickerText] = useState("ARCHITECTING TOMORROW'S SKYLINES");

  useEffect(() => {
    async function fetchData() {
      const { data: projData } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (projData) setProjects(projData);

      const { data: blogData } = await supabase.from('blogs').select('*').order('created_at', { ascending: false }).limit(3);
      if (blogData) setLatestBlogs(blogData);

      const { data: configData, error: configError } = await supabase.from('site_config').select('*');
      console.log('--- DB FETCH DEBUG ---');
      console.log('Config Data:', configData);
      console.log('Config Error:', configError);
      
      if (configData && configData.length > 0) {
        const h = configData.find(item => item.id === 'hero_headline');
        const t = configData.find(item => item.id === 'hero_ticker');
        console.log('Found H:', h);
        console.log('Found T:', t);
        if (h && h.value) setHeroHeadline(h.value);
        if (t && t.value) setTickerText(t.value);
      } else {
        console.log('No config data returned from Supabase.');
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
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
  }, []);

  return (
    <div className="home-container" ref={containerRef}>

      {/* HERO */}
      <section className="home-section hero-section" style={{
        minHeight: '100vh',
        paddingTop: '180px',
        position: 'relative',
        backgroundImage: 'url("/hero_prime.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(10, 10, 15, 0.92) 20%, rgba(10, 10, 15, 0.5) 60%, rgba(79, 143, 255, 0.08) 100%)',
          zIndex: 0
        }} />
        <div className="section-content-inner" style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero-personal" style={{ marginBottom: '2rem' }}>
            <span className="accent-text">{userName ? `Welcome, ${userName}` : 'REAL ESTATE REDEFINED'}</span>
            <h1 className="text-reveal hero-title" style={{ fontSize: 'clamp(2.2rem, 8vw, 6rem)', fontWeight: 900, lineHeight: 0.9, fontFamily: 'var(--font-display)' }}>
              Where Architecture <br /> <span style={{ fontStyle: 'normal', fontFamily: 'inherit', color: 'var(--accent)' }}>Meets Intelligence.</span>
            </h1>
          </div>
          <p className="subtitle" style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.25rem)', maxWidth: '550px', color: 'var(--text-secondary)' }}>
            {heroHeadline}
          </p>
          <div className="hero-buttons" style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
            <Link to="/projects" className="glass-btn primary-btn" style={{ padding: '1rem 2.5rem' }}>EXPLORE PORTFOLIO</Link>
            <Link to="/contact" className="glass-btn" style={{ padding: '1rem 2.5rem' }}>SCHEDULE CONSULTATION</Link>
          </div>
        </div>
      </section>



      <TextSlider text={tickerText} />

      {/* STATS */}
      <section className="home-section" style={{ minHeight: 'auto', background: 'var(--bg-elevated)', padding: '80px 10%' }}>
        <div className="section-content-inner" style={{ width: '100%' }}>
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '2rem' }}>
            {[
              { val: '23+', label: 'Projects Completed', suffix: '+' },
              { val: '100%', label: 'Client Satisfaction', suffix: '%' },
              { val: '15+', label: 'Cities Active', suffix: '+' },
              { val: '10+', label: 'Years Experience', suffix: '+' }
            ].map((stat, i) => (
              <div key={i} className="stagger-item" style={{ textAlign: 'center', background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div className="counter-value" data-target={stat.val.replace(/\D/g, '')} data-suffix={stat.suffix} style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>0</div>
                <div className="counter-label" style={{ letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: 'clamp(0.65rem, 1.5vw, 0.8rem)', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROJECT */}
      <section className="home-section">
        <div className="section-content-inner">
          <SectionHeading
            accent="FEATURED DEVELOPMENT"
            title="Projects In Progress"
            subtitle="Current developments shaping the future of real estate."
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {projects.filter(p => p.status === 'In Progress').map((project) => (
              <div key={project.id} className="content-box featured-project-box" style={{ padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', overflow: 'hidden', border: '1px solid var(--border-hover)' }}>
                <div style={{ overflow: 'hidden', minHeight: '300px' }}>
                  <img src={project.image || "/cyber_project.png"} alt={project.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="featured-project-info" style={{ padding: 'clamp(1.5rem, 4vw, 4rem)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h3 style={{ fontSize: 'clamp(1.3rem, 3vw, 2rem)', marginBottom: '1rem', color: 'var(--white)' }}>{project.title}</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>{project.description}</p>
                  <ul className="feature-list" style={{ marginTop: '1rem' }}>
                    {project.features && Array.isArray(project.features) && project.features.map((feat, idx) => (
                      <li key={idx}><CheckCircle size={18} color="var(--accent)" /> {feat}</li>
                    ))}
                    {project.investment?.duration && (
                      <li><CheckCircle size={18} color="var(--accent)" /> Duration: {project.investment.duration}</li>
                    )}
                    {project.investment?.price && (
                      <li><CheckCircle size={18} color="var(--accent)" /> Investment: {project.investment.price} ({project.investment.plan || 'Once'})</li>
                    )}
                  </ul>
                  <Link to="/projects" className="glass-btn primary-btn" style={{ alignSelf: 'flex-start', marginTop: '1.5rem', display: 'inline-flex', alignItems: 'center' }}>VIEW DETAILS</Link>
                </div>
              </div>
            ))}
            
            {projects.filter(p => p.status === 'In Progress').length === 0 && (
              <div style={{ padding: '4rem', textAlign: 'center', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ color: 'var(--text-secondary)' }}>New developments coming soon. Contact us for exclusive early access.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="home-section" style={{ background: 'var(--bg)' }}>
        <div className="section-content-inner" style={{ width: '100%' }}>
          <SectionHeading
            accent="OUR CAPABILITIES"
            title="End-to-End Excellence"
            subtitle="We integrate the entire real estate value chain into a seamless experience."
          />
          <div className="services-grid">
            {[
              { 
                icon: <Briefcase />, 
                title: "Consultancy", 
                desc: "Strategic planning and market intelligence for informed investment.",
                bgImage: "/images/services/consultancy.png"
              },
              { 
                icon: <Building2 />, 
                title: "Development", 
                desc: "Constructing future-ready spaces with uncompromising integrity.",
                bgImage: "/images/services/construction.png"
              },
              { 
                icon: <TrendingUp />, 
                title: "Marketing", 
                desc: "High-impact growth strategies and asset lifecycle management.",
                bgImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000"
              },
              { 
                icon: <ShieldCheck />, 
                title: "Asset Management", 
                desc: "Preserving and enhancing value for long-term sustainability.",
                bgImage: "https://images.unsplash.com/photo-1454165833767-027ffea9e77b?q=80&w=1000"
              }
            ].map((s, i) => (
              <div 
                key={i} 
                className="service-card"
                style={{ 
                  backgroundImage: `url(${s.bgImage})`,
                  padding: 0
                }}
              >
                <div className="card-overlay"></div>
                <div className="service-card-content" style={{ padding: '2.5rem 2rem' }}>
                  <div className="service-icon" style={{ marginBottom: '1.5rem', color: 'var(--accent)' }}>{s.icon}</div>
                  <h4 style={{ color: 'var(--white)', marginBottom: '1rem', fontSize: '1.4rem' }}>{s.title}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>{s.desc}</p>
                  <div style={{ marginTop: '1.5rem' }}>
                    <Link to="/services" style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      LEARN MORE <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="home-section">
        <div className="section-content-inner" style={{ textAlign: 'center', margin: '0 auto', maxWidth: '900px' }}>
          <Quote size={50} color="var(--accent)" style={{ marginBottom: '2rem', opacity: 0.3 }} />
          <h2 style={{ fontSize: 'clamp(1.2rem, 3.5vw, 2.5rem)', fontWeight: 400, fontStyle: 'italic', lineHeight: 1.6, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
            "Nexora Ventures doesn't just build buildings; they build trust. Their integrated approach saved us months of friction and delivered a project that exceeded every benchmark."
          </h2>
          <div style={{ marginTop: '2.5rem' }}>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--white)' }}>Arsalan Khan</div>
            <div className="accent-text" style={{ fontSize: '0.7rem' }}>Strategic Investor</div>
          </div>
        </div>
      </section>

      {/* COMPLETED PROJECTS */}
      <section className="home-section">
        <div className="section-content-inner">
          <SectionHeading
            accent="OUR LEGACY"
            title="Completed Projects"
            subtitle="Explore the visionary spaces we've successfully delivered."
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {projects.filter(p => p.status === 'Already Done').map(project => (
              <div key={project.id} className="content-box" style={{ padding: '2rem', border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{project.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{project.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--success)' }}>● Completed</span>
                  <Link to="/projects" style={{ color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>Details <ArrowRight size={14} /></Link>
                </div>
              </div>
            ))}
            
            {projects.filter(p => p.status === 'Already Done').length === 0 && (
              <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ color: 'var(--text-secondary)' }}>Our portfolio is being updated. Check back soon.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="home-section" style={{ background: 'var(--bg-elevated)' }}>
        <div className="section-content-inner" style={{ width: '100%' }}>
          <div className="why-us-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div>
              <SectionHeading
                accent="THE NEXORA ADVANTAGE"
                title="Why We Lead"
                subtitle="In a market of fragmentation, we provide unity and precision."
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {[
                  { title: "Vertical Integration", desc: "No middleman friction. We handle everything from soil to sale." },
                  { title: "Data-Driven Precision", desc: "Every project is backed by rigorous market intelligence." },
                  { title: "Uncompromising Quality", desc: "We adhere to A+ standards in every square foot we build." }
                ].map((item, i) => (
                  <div key={i} style={{ borderLeft: '2px solid var(--accent)', paddingLeft: '1.5rem' }}>
                    <h4 style={{ color: 'var(--white)', marginBottom: '0.5rem' }}>{item.title}</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <div className="content-box" style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <Building2 size={80} color="var(--accent)" style={{ marginBottom: '1.5rem', opacity: 0.5 }} />
                  <h3>Experience the Edge</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Schedule a detailed consultation with our specialists.</p>
                  <Link to="/contact" className="glass-btn primary-btn" style={{ marginTop: '1.5rem' }}>GET IN TOUCH</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="home-section">
        <div className="section-content-inner" style={{ width: '100%' }}>
          <SectionHeading
            accent="OUR METHODOLOGY"
            title="The Path to Excellence"
            subtitle="A disciplined, four-phase approach to ensuring every project becomes a benchmark of quality."
            centered
          />
          <div className="process-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1.5rem', marginTop: '3rem' }}>
            {[
              { num: '01', title: 'Consultation', desc: 'We begin with deep discovery to align your objectives with market realities.', icon: <Users /> },
              { num: '02', title: 'Strategy', desc: 'Our team develops a data-driven blueprint for design, value, and execution.', icon: <Target /> },
              { num: '03', title: 'Execution', desc: 'Precision construction begins, adhering to A+ standards and rigorous oversight.', icon: <Hammer /> },
              { num: '04', title: 'Handover', desc: 'We deliver a turnkey asset, optimized for immediate utility and long-term yield.', icon: <Layout /> }
            ].map((step, i) => (
              <div key={i} className="process-step" style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  color: 'var(--accent)',
                  position: 'relative'
                }}>
                  {step.icon}
                  <span style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    background: 'var(--accent)',
                    color: 'var(--bg)',
                    fontSize: '0.6rem',
                    fontWeight: 900,
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {step.num}
                  </span>
                </div>
                <h4 style={{ color: 'var(--white)', marginBottom: '0.8rem', fontSize: '1.1rem' }}>{step.title}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.6' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section" style={{ background: 'var(--bg)' }}>
        <div className="section-content-inner" style={{ width: '100%' }}>
          <Carousel />
        </div>
      </section>

      {/* LATEST INSIGHTS */}
      <section className="home-section">
        <div className="section-content-inner" style={{ width: '100%' }}>
          <SectionHeading
            accent="KNOWLEDGE HUB"
            title="Latest Insights"
            subtitle="Expert perspectives on the future of infrastructure and strategic investments."
          />
          <div className="insights-grid">
            {latestBlogs.map((blog) => (
              <Link to={`/blog/${blog.id}`} key={blog.id} className="content-box" style={{ padding: 0, textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img src={blog.image} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '2rem' }}>
                  <div style={{ color: 'var(--accent)', fontSize: '0.7rem', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase' }}>{blog.category}</div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--white)' }}>{blog.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{blog.excerpt}</p>
                  <div style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    READ FULL ARTICLE <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <Link to="/blog" className="glass-btn">VIEW ALL INSIGHTS</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="home-section" style={{ minHeight: '60vh', textAlign: 'center' }}>
        <div className="section-content-inner" style={{ margin: '0 auto' }}>
          <h2 className="title-reveal" style={{ fontSize: 'clamp(2rem, 7vw, 5rem)', fontFamily: 'var(--font-display)' }}>
            Ready to Build <br /> <span style={{ color: 'var(--accent)' }}>The Future?</span>
          </h2>
          <p className="subtitle" style={{ margin: '1.5rem auto' }}>
            Join the elite circle of investors and partners shaping the next chapter of Pakistan's skyline.
          </p>
          <div style={{ marginTop: '3rem' }}>
            <Link to="/contact" className="glass-btn primary-btn" style={{ padding: 'clamp(1rem, 2vw, 1.5rem) clamp(2rem, 4vw, 4rem)', fontSize: 'clamp(0.75rem, 1.5vw, 1rem)' }}>
              START A CONVERSATION <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
