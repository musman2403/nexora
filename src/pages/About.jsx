import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ArrowRight } from 'lucide-react';

const leaders = [
  {
    name: "Zubair Ahsan Farooqi",
    role: "CEO & Director Strategic Planning",
    image: "/images/ceo_portrait.jpg",
    bio: "Zubair Ahsan Farooqi is a visionary leader with over 23 years of experience in Pakistan's corporate energy and real estate sectors. He has been instrumental in numerous high-impact national initiatives and brings a unique blend of corporate discipline and entrepreneurial agility to Nexora Ventures.",
    highlights: [
      "23+ years in Pakistan's corporate energy & real estate sectors.",
      "Expertise in residential/commercial planning and turnkey execution.",
      "Blends corporate discipline with entrepreneurial agility.",
      "Former key managerial lead in high-impact national initiatives."
    ]
  },
  {
    name: "Mr. Syed Shiraz",
    role: "Director – Sales",
    image: "/images/sales_director.png",
    bio: "Mr. Syed Shiraz is a strategic sales leader with 15+ years of experience in the real estate industry. He specializes in strategic land acquisition and has an extensive network that he leverages to identify high-potential opportunities for Nexora Ventures and its clients.",
    highlights: [
      "Strategic leader with 15+ years in high-impact sales.",
      "Expert in strategic land acquisition and opportunity identification.",
      "Extensive network in international brand ambassadorship.",
      "Core strength in sourcing high-potential land parcels."
    ]
  },
  {
    name: "Mr. Zahid Munir",
    role: "Director Key Projects",
    image: "/images/projects_director.jpg",
    bio: "Mr. Zahid Munir, educated in the UK, has over a decade of experience in the Lahore real estate market. As the Head of Premio Homes, he oversees a flagship development of 1,000 homes, focusing on rapid sales absorption and long-term value creation.",
    highlights: [
      "UK-educated project leader with over a decade of Lahore market mastery.",
      "Pivotal role in high-profile projects like District One & Pak Valley.",
      "Head of Premio Homes, overseeing 1,000-home flagship development.",
      "Expert in rapid sales absorption and long-term value creation."
    ]
  }
];

const Modal = ({ leader, onClose }) => {
  if (!leader) return null;
  return (
    <div className="modal-overlay" onClick={onClose} data-lenis-prevent>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X /></button>
        <div className="modal-body">
          <div className="modal-image">
            <img src={leader.image} alt={leader.name} />
          </div>
          <div className="modal-info">
            <span className="accent-text">{leader.role}</span>
            <h2>{leader.name}</h2>
            <p className="bio">{leader.bio}</p>
            <ul className="modal-highlights">
              {leader.highlights.map((h, i) => (
                <li key={i}><CheckCircle size={16} /> {h}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

function About({ userName }) {
  const [selectedLeader, setSelectedLeader] = useState(null);
  
  useEffect(() => {
    if (selectedLeader) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [selectedLeader]);

  return (
    <div className="page-container">
      <Modal leader={selectedLeader} onClose={() => setSelectedLeader(null)} />

      {/* About Section */}
      <div style={{ marginBottom: '5rem' }}>
        <span className="accent-text">Our Story</span>
        <h1 className="title-reveal hero-title" style={{ fontFamily: 'var(--font-display)' }}>
          {userName ? <>{userName}, this is <span className="personalized-name">Nexora</span></> : 'About Nexora Ventures'}
        </h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: '2rem',
          marginTop: '2.5rem'
        }}>
          <div className="glass-card about-main-card">
            <p className="subtitle" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', maxWidth: '100%', color: 'var(--white)', fontWeight: '500' }}>
              Nexora Ventures is a tech-integrated real estate powerhouse, optimizing how people interact with physical environments.
            </p>
            <p className="subtitle" style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', maxWidth: '100%', marginTop: '1.5rem' }}>
              We deploy smart infrastructure, data-driven consultancy, and precision turnkey execution to deliver assets that are future-proof and high-yield.
            </p>
            <p className="subtitle" style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', maxWidth: '100%', marginTop: '1rem' }}>
              By merging advanced logistics with architectural mastery, Nexora Ventures creates the next generation of smart residential and commercial ecosystems.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent)' }}>
              <h4 style={{ color: 'var(--accent)', marginBottom: '0.8rem', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.2em', fontWeight: '800' }}>Our Mission</h4>
              <p style={{ fontSize: '1rem', color: 'var(--white)', lineHeight: '1.5', fontWeight: '500' }}>
                To provide full-spectrum real estate solutions focused on value, aesthetics, and long-term returns.
              </p>
            </div>
            <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <h4 style={{ color: 'var(--accent)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.2em', fontWeight: '800' }}>Our Vision</h4>
              </div>
              <p style={{ fontSize: '1rem', color: 'var(--white)', lineHeight: '1.5', fontWeight: '500' }}>
                <span style={{ color: 'var(--accent)', fontWeight: '800' }}>VISION:</span> To redefine how people live, work, and invest <br />
                <span style={{ color: 'var(--accent)', fontWeight: '800' }}>STATEMENT:</span> through integrated real estate solutions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Pillars Section */}
      <div style={{ marginBottom: '5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="accent-text">Our Foundation</span>
          <h2 className="title-reveal" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontFamily: 'var(--font-display)' }}>Core Pillars</h2>
        </div>

        <div className="pillars-list">
          {[
            { title: "Integrated Solutions", desc: "From land acquisition to turnkey delivery" },
            { title: "Design Excellence", desc: "Architecture that blends function with aesthetics" },
            { title: "Investment Intelligence", desc: "Data-driven property decisions" },
            { title: "Quality Construction", desc: "Built for durability and long-term value" },
            { title: "Transparency & Trust", desc: "Clear processes, honest dealings" },
            { title: "Innovation & Sustainability", desc: "Future-ready development" }
          ].map((pillar, i) => (
            <div key={i} className="pillar-line-item">
              <div className="pillar-dot" />
              <div className="pillar-text">
                <h4>{pillar.title}</h4>
                <p>{pillar.desc}</p>
              </div>
              <div className="pillar-line" />
            </div>
          ))}
        </div>
      </div>

      {/* Leadership Section */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <span className="accent-text">Meet Our Leaders</span>
        <h2 className="title-reveal" style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontFamily: 'var(--font-display)' }}>Visionary Leadership</h2>
        <p className="subtitle" style={{ margin: '0 auto' }}>
          Driven by corporate discipline and entrepreneurial agility, our leadership team positions NEXORA VENTURES as a forward-looking platform for strategic growth.
        </p>
      </div>

      <div className="leaders-grid">
        {leaders.map((leader, i) => (
          <div key={i} className="leader-card" onClick={() => setSelectedLeader(leader)} style={{ cursor: 'pointer' }}>
            <div className="leader-image-wrap">
              <img src={leader.image} alt={leader.name} />
            </div>
            <h3>{leader.name}</h3>
            <span className="accent-text">{leader.role}</span>
            <div className="view-profile-link">
              VIEW PROFILE <ArrowRight size={14} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default About;
