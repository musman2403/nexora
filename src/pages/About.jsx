import React from 'react';

const leaders = [
  {
    name: "Zubair Ahsan Farooqi",
    role: "CEO & Director Strategic Planning",
    image: "/images/ceo_portrait.jpg",
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
    highlights: [
      "UK-educated project leader with over a decade of Lahore market mastery.",
      "Pivotal role in high-profile projects like District One & Pak Valley.",
      "Head of Premio Homes, overseeing 1,000-home flagship development.",
      "Expert in rapid sales absorption and long-term value creation."
    ]
  }
];

function About({ userName }) {
  return (
    <div className="page-container">
      {/* About Section */}
      <div style={{ marginBottom: '8rem' }}>
        <span className="accent-text">Our Story</span>
        <h1 className="title-reveal">
          {userName ? `For You, ${userName}` : 'About Us'}
        </h1>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '3rem',
          marginTop: '3rem'
        }}>
          <div className="glass-card" style={{ gridColumn: 'span 2' }}>
            <p className="subtitle" style={{ fontSize: '1.4rem', maxWidth: '100%', color: 'var(--text-main)', fontWeight: '500' }}>
              Nexora is a full-spectrum real estate solutions company committed to transforming how people build, invest, and experience spaces.
            </p>
            <p className="subtitle" style={{ fontSize: '1.1rem', maxWidth: '100%', marginTop: '2rem' }}>
              We provide integrated services across development, construction, consultancy, design, marketing, and turnkey execution ensuring seamless delivery from concept to completion.
            </p>
            <p className="subtitle" style={{ fontSize: '1.1rem', maxWidth: '100%', marginTop: '1.5rem' }}>
              With a deep understanding of market dynamics and client needs, Nexora creates high-value residential, commercial, and specialized projects that combine functionality, aesthetics, and long-term returns.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-card" style={{ padding: '2rem', borderLeft: '4px solid var(--primary)' }}>
              <h4 style={{ color: 'var(--primary)', marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.2em', fontWeight: '800' }}>Our Mission</h4>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-main)', lineHeight: '1.5', fontWeight: '500' }}>
                To provide full-spectrum real estate solutions focused on value, aesthetics, and long-term returns.
              </p>
            </div>
            <div className="glass-card" style={{ padding: '2rem', borderLeft: '4px solid var(--primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ color: 'var(--primary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.2em', fontWeight: '800' }}>Our Vision</h4>
              </div>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-main)', lineHeight: '1.5', fontWeight: '500' }}>
                <span style={{ color: 'var(--primary)', fontWeight: '800' }}>VISION:</span> To redefine how people live, work, and invest <br/>
                <span style={{ color: 'var(--primary)', fontWeight: '800' }}>STATEMENT:</span> through integrated real estate solutions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Pillars Section */}
      <div style={{ marginBottom: '8rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="accent-text">Our Foundation</span>
          <h2 className="title-reveal" style={{ fontSize: '3.5rem' }}>Core Pillars</h2>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {[
            { 
              title: "Integrated Solutions", 
              desc: "From land acquisition to turnkey delivery",
              icon: <div style={{ color: 'var(--primary)' }}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg></div>
            },
            { 
              title: "Design Excellence", 
              desc: "Architecture that blends function with aesthetics",
              icon: <div style={{ color: 'var(--primary)' }}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19 7-7 3 3-7 7-3-3Z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5Z"/><path d="m2 2 20 20"/><path d="m5 16 2 2"/></svg></div>
            },
            { 
              title: "Investment Intelligence", 
              desc: "Data-driven property decisions",
              icon: <div style={{ color: 'var(--primary)' }}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg></div>
            },
            { 
              title: "Quality Construction", 
              desc: "Built for durability and long-term value",
              icon: <div style={{ color: 'var(--primary)' }}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg></div>
            },
            { 
              title: "Transparency & Trust", 
              desc: "Clear processes, honest dealings",
              icon: <div style={{ color: 'var(--primary)' }}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
            },
            { 
              title: "Innovation & Sustainability", 
              desc: "Future-ready development",
              icon: <div style={{ color: 'var(--primary)' }}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></div>
            }
          ].map((pillar, i) => (
            <div key={i} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ background: 'var(--bg-dark)', padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                {pillar.icon}
              </div>
              <h4 style={{ color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: '700' }}>{pillar.title}</h4>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: '1.6' }}>{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Leadership Section */}
      <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <span className="accent-text">Meet Our Leaders</span>
        <h2 className="title-reveal" style={{ fontSize: '3rem' }}>Visionary Leadership</h2>
        <p className="subtitle" style={{ margin: '0 auto' }}>
          Driven by corporate discipline and entrepreneurial agility, our leadership team positions NEXORA as a forward-looking platform for strategic growth.
        </p>
      </div>

      <div className="leaders-grid">
        {leaders.map((leader, i) => (
          <div key={i} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ 
              width: '100%', 
              height: '350px', 
              borderRadius: '16px', 
              overflow: 'hidden',
              marginBottom: '1.5rem',
              background: 'var(--bg-dark)',
              border: '1px solid var(--border)'
            }}>
              <img 
                src={leader.image} 
                alt={leader.name} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  filter: 'grayscale(10%) contrast(110%)'
                }} 
              />
            </div>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>{leader.name}</h3>
            <span className="accent-text" style={{ fontSize: '0.75rem', margin: '0', letterSpacing: '0.15em' }}>{leader.role}</span>
            
            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              marginTop: '1.5rem', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '0.8rem' 
            }}>
              {leader.highlights.map((h, j) => (
                <li key={j} style={{ 
                  fontSize: '0.85rem', 
                  color: 'var(--muted)', 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '0.6rem',
                  lineHeight: '1.5'
                }}>
                  <div style={{ marginTop: '0.3rem', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--tan)', flexShrink: 0 }} />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default About;
