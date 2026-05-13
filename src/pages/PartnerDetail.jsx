import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ArrowLeft, Loader } from 'lucide-react';

function PartnerDetail() {
  const { name } = useParams();
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPartner() {
      setLoading(true);
      const decodedName = decodeURIComponent(name);
      const { data, error } = await supabase.from('partners').select('*').eq('name', decodedName).single();
      if (!error && data) {
        setPartner(data);
      }
      setLoading(false);
      window.scrollTo(0, 0);
    }
    if (name) fetchPartner();
  }, [name]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader size={40} className="spin" color="var(--accent)" />
      </div>
    );
  }

  if (!partner) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <h2>Partner not found.</h2>
        <Link to="/" className="glass-btn primary-btn">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ paddingTop: '150px', paddingBottom: '100px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 5%' }}>
        <Link to="/" className="glass-btn" style={{ display: 'inline-flex', marginBottom: '3rem', fontSize: '0.8rem', padding: '0.8rem 1.5rem' }}>
          <ArrowLeft size={16} /> BACK TO HOME
        </Link>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 300px' }}>
            <div className="glass-card" style={{ padding: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)' }}>
              {partner.logo_url ? (
                <img src={partner.logo_url} alt={partner.name} style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }} />
              ) : (
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>{partner.name}</div>
              )}
            </div>
          </div>
          
          <div style={{ flex: '2 1 400px' }}>
            <span className="accent-text">TRUSTED PARTNER</span>
            <h1 className="title-reveal" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', marginBottom: '2rem', lineHeight: 1, fontFamily: 'var(--font-display)' }}>{partner.name}</h1>
            
            <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
              {partner.details || "Details for this partner are currently being updated."}
            </div>
            
            <div style={{ marginTop: '4rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Interested in our work with {partner.name}?</h3>
              <Link to="/contact" className="glass-btn primary-btn">
                CONTACT US
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PartnerDetail;
