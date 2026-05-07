import React from 'react';
import { Briefcase, Hammer, Layout, Building2, CheckCircle, ChevronRight, Ruler, PenTool, BarChart3, Users2 } from 'lucide-react';

function Services({ userName }) {
  const allServices = [
    {
      title: "Real Estate Consultancy",
      icon: <Briefcase className="service-icon" />,
      description: "Expert advisory for strategic property investments and portfolio management.",
      features: ["Investment Advisory", "Property Buying & Selling", "Market Intelligence", "Portfolio Planning"]
    },
    {
      title: "Development & Construction",
      icon: <Hammer className="service-icon" />,
      description: "High-quality execution for residential and commercial structures built to last.",
      features: ["Residential Projects", "Commercial Buildings", "Mixed-Use Developments", "A+ Construction Standards"]
    },
    {
      title: "Architecture & Design",
      icon: <Layout className="service-icon" />,
      description: "Innovative planning and aesthetics that maximize space and value.",
      features: ["Architectural Planning", "Interior Design", "Space Optimization", "3D Visualization"]
    },
    {
      title: "Renovation & Transformation",
      icon: <Building2 className="service-icon" />,
      description: "Specialized property upgrades and turnkey solutions for modernization.",
      features: ["Property Upgrades", "Turnkey Solutions", "Specialized Execution", "Modernization"]
    },
    {
      title: "Project Marketing",
      icon: <BarChart3 className="service-icon" />,
      description: "Strategic sales and marketing solutions to drive project absorption.",
      features: ["Exclusive Marketing", "Lead Generation", "Brand Positioning", "Sales Strategy"]
    },
    {
      title: "Strategic Planning",
      icon: <PenTool className="service-icon" />,
      description: "Comprehensive blueprints for long-term real estate success.",
      features: ["Feasibility Studies", "Concept Development", "Risk Assessment", "Financial Modeling"]
    }
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <span className="accent-text">Our Expertise</span>
        <h1 className="title-reveal">{userName ? `Tailored Solutions for ${userName}` : 'Comprehensive Solutions'}</h1>
        <p className="subtitle" style={{ margin: '0 auto' }}>
          Delivering end-to-end real estate expertise for {userName || 'you'} from concept to completion.
        </p>
      </div>

      {/* Services Grid */}
      <div className="services-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '2rem' }}>
        {allServices.map((service, i) => (
          <div key={i} className="service-card" style={{ padding: 'clamp(1.5rem, 3vw, 3.5rem) clamp(1.2rem, 3vw, 3rem)' }}>
            <div style={{ color: 'var(--tan)', marginBottom: '1.5rem' }}>
              {React.cloneElement(service.icon, { size: 36 })}
            </div>
            <h3 style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)', color: 'var(--ink)', marginBottom: '1rem' }}>{service.title}</h3>
            <p style={{ color: 'var(--muted)', lineHeight: '1.7', marginBottom: '1.5rem' }}>{service.description}</p>
            
            <ul className="feature-list" style={{ marginTop: '1.5rem', borderTop: '1px solid var(--walnut-10)', paddingTop: '1.5rem' }}>
              {service.features.map((feat, idx) => (
                <li key={idx} style={{ fontSize: '0.85rem', color: 'var(--ink)', opacity: 0.8, marginBottom: '0.8rem' }}>
                  <CheckCircle size={16} color="var(--tan)" /> {feat}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="glass-card" style={{ marginTop: '6rem', textAlign: 'center', padding: 'clamp(2rem, 5vw, 5rem)', background: 'linear-gradient(135deg, var(--parchment) 0%, #120D08 100%)' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', marginBottom: '1.5rem', fontWeight: '800' }}>Ready to start your next project?</h2>
        <p className="subtitle" style={{ margin: '0 auto', marginBottom: '2.5rem' }}>
          Partner with Nexora for integrated solutions that transform your architectural vision into a high-value reality.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="glass-btn primary-btn" style={{ padding: '1rem 2.5rem' }}>GET A CONSULTATION</button>
          <button className="glass-btn" style={{ padding: '1rem 2.5rem' }}>VIEW OUR WORK</button>
        </div>
      </div>
    </div>
  );
}

export default Services;
