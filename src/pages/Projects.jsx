import React from 'react';

function Projects({ userName }) {
  const flagshipProjects = [
    {
      title: "Premio Homes",
      location: "New Lahore City, Pakistan",
      status: "Actively Developing",
      description: "A premier collection of 5-Marla independent double-story homes designed for modern families. Premio Homes combines luxury aesthetics with structural integrity, offering a 5-star living experience in one of Lahore's fastest growing communities.",
      image: "/images/premio_homes_project_1777986545307.png",
      features: [
        "A+ Category Construction",
        "Modern Architecture & Design",
        "Smart Space Utilization",
        "Premium Finishing Materials",
        "Secure Gated Community"
      ],
      investment: {
        price: "PKR 15.9M",
        plan: "Attractive 3-Year Payment Plan"
      }
    }
  ];

  return (
    <div className="page-container">
      <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <span className="accent-text">Our Portfolio</span>
        <h1 className="title-reveal">{userName ? `${userName}'s Future Spaces` : 'Signature Projects'}</h1>
        <p className="subtitle" style={{ margin: '0 auto' }}>
          Delivering high-value residential and commercial spaces that redefine urban living standards.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
        {flagshipProjects.map((project, i) => (
          <div key={i} style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', 
            gap: '2.5rem',
            alignItems: 'center'
          }}>
            <div className="glass-card" style={{ padding: '0', overflow: 'hidden', height: 'clamp(280px, 50vw, 500px)', border: '1px solid var(--tan-glow)' }}>
              <img 
                src={project.image} 
                alt={project.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>

            <div style={{ padding: '0.5rem' }}>
              <span className="accent-text" style={{ fontSize: '0.7rem', color: 'var(--tan)' }}>Flagship Development</span>
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', margin: '0.5rem 0', fontWeight: '800' }}>{project.title}</h2>
              <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', fontSize: '0.85rem', letterSpacing: '0.1em' }}>
                {project.location.toUpperCase()} | {project.status.toUpperCase()}
              </p>
              
              <p className="subtitle" style={{ maxWidth: '100%', marginBottom: '1.5rem' }}>
                {project.description}
              </p>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', 
                gap: '1.5rem',
                marginBottom: '2rem'
              }}>
                <div>
                  <h4 style={{ color: 'var(--walnut)', marginBottom: '0.8rem', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em' }}>Key Features</h4>
                  <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                    {project.features.map((feat, idx) => (
                      <li key={idx} style={{ fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--tan)' }}>•</span> {feat}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 style={{ color: 'var(--walnut)', marginBottom: '0.8rem', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em' }}>Investment</h4>
                  <div style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', fontWeight: '800', color: 'var(--tan)' }}>{project.investment.price}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.3rem' }}>{project.investment.plan}</div>
                </div>
              </div>

              <button className="glass-btn primary-btn" style={{ padding: '0.9rem 2rem', fontSize: '0.85rem' }}>
                VIEW PROJECT DETAILS
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ marginTop: '6rem', textAlign: 'center', padding: 'clamp(2rem, 4vw, 4rem)' }}>
        <h3 style={{ fontSize: 'clamp(1.3rem, 3vw, 2rem)', marginBottom: '1rem' }}>Have a specialized project in mind?</h3>
        <p className="subtitle" style={{ margin: '0 auto' }}>
          Nexora specializes in turnkey execution for commercial ventures, fuel retail stations, and specialized residential projects.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
          <button className="glass-btn">CONSULTANCY SERVICES</button>
          <button className="glass-btn primary-btn">CONTACT ADVISORY</button>
        </div>
      </div>
    </div>
  );
}

export default Projects;
