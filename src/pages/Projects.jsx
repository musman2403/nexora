import React, { useState, useEffect } from 'react';
import { X, CheckCircle, MapPin, TrendingUp, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';


const ProjectModal = ({ project, onClose }) => {
  if (!project) return null;
  return (
    <div className="modal-overlay" onClick={onClose} data-lenis-prevent>
      <div className="modal-content" style={{ maxWidth: '1000px' }} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X /></button>
        <div className="modal-body" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="modal-image">
            <img src={project.image} alt={project.title} style={{ height: '100%', objectFit: 'cover' }} />
          </div>
          <div className="modal-info">
            <span className="accent-text" style={{ marginBottom: '0.5rem' }}>{project.status}</span>
            <h2 style={{ fontSize: '2.5rem' }}>{project.title}</h2>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              <MapPin size={16} /> {project.location}
            </p>
            <p className="bio" style={{ fontSize: '1rem', marginBottom: '2rem' }}>{project.longDescription}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
              <div>
                <h4 style={{ color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>Key Features</h4>
                <ul className="modal-highlights">
                  {project.features.map((feat, i) => (
                    <li key={i} style={{ fontSize: '0.85rem' }}><CheckCircle size={14} /> {feat}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 style={{ color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>Investment</h4>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent)' }}>{project.investment.price}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{project.investment.plan}</div>
              </div>
            </div>

            <Link to="/contact" className="glass-btn primary-btn" style={{ width: '100%', padding: '1rem', justifyContent: 'center' }}>
              INQUIRE ABOUT THIS PROJECT
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

function Projects({ userName }) {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      const { data, error } = await supabase.from('projects').select('*');
      if (!error && data) setProjects(data);
      setLoading(false);
    }
    fetchProjects();
  }, []);
  
  useEffect(() => {
    if (selectedProject) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [selectedProject]);

  return (
    <div className="page-container">
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />

      <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <span className="accent-text">{userName ? `Curated for ${userName}` : 'Our Portfolio'}</span>
        <h1 className="title-reveal" style={{ fontFamily: 'var(--font-display)' }}>Signature Projects</h1>
        <p className="subtitle" style={{ margin: '0 auto' }}>
          Delivering high-value residential and commercial spaces that redefine urban living standards.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
        {projects.length > 0 ? projects.map((project, i) => (
          <div key={i}
            className="project-row"
            onClick={() => setSelectedProject(project)}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '2.5rem',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <div className="glass-card" style={{ padding: '0', overflow: 'hidden', height: 'clamp(280px, 50vw, 500px)', border: '1px solid var(--border-hover)' }}>
              <img
                src={project.image}
                alt={project.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
                className="project-img"
              />
            </div>

            <div style={{ padding: '0.5rem' }}>
              <span className="accent-text" style={{ fontSize: '0.7rem' }}>Flagship Development</span>
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', margin: '0.5rem 0', fontWeight: '800', fontFamily: 'var(--font-display)' }}>{project.title}</h2>
              <p style={{ color: 'var(--text-tertiary)', marginBottom: '1.5rem', fontSize: '0.85rem', letterSpacing: '0.1em' }}>
                {project.location?.toUpperCase()} | {project.status?.toUpperCase()}
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
                  <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.8rem', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em' }}>Key Features</h4>
                  <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                    {project.features?.slice(0, 3).map((feat, idx) => (
                      <li key={idx} style={{ fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--white)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--accent)' }}>•</span> {feat}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.8rem', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em' }}>Investment</h4>
                  <div style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', fontWeight: '800', color: 'var(--accent)' }}>{project.investment?.price}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>{project.investment?.plan}</div>
                </div>
              </div>

              <button className="glass-btn primary-btn" style={{ padding: '0.9rem 2rem', fontSize: '0.85rem' }}>
                VIEW PROJECT DETAILS
              </button>
            </div>
          </div>
        )) : (
          <div style={{ textAlign: 'center', padding: '10rem 0', color: 'var(--text-secondary)' }}>
            {loading ? 'Loading project portfolio...' : 'The project archive is currently being updated.'}
          </div>
        )}
      </div>

      <div className="glass-card" style={{ marginTop: '6rem', textAlign: 'center', padding: 'clamp(2rem, 4vw, 4rem)' }}>
        <h3 style={{ fontSize: 'clamp(1.3rem, 3vw, 2rem)', marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>Have a specialized project in mind?</h3>
        <p className="subtitle" style={{ margin: '0 auto' }}>
          Nexora Ventures specializes in turnkey execution for commercial ventures, fuel retail stations, and specialized residential projects.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
          <Link to="/services" className="glass-btn">CONSULTANCY SERVICES</Link>
          <Link to="/contact" className="glass-btn primary-btn">CONTACT ADVISORY</Link>
        </div>
      </div>
    </div>
  );
}

export default Projects;
