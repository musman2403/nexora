import React, { useState, useEffect } from 'react';
import { Save, RefreshCcw, Layout } from 'lucide-react';
import { supabase } from '../supabaseClient';

const AdminSettings = () => {
  const [headline, setHeadline] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_config')
        .select('value')
        .eq('id', 'hero_headline')
        .single();

      if (data) {
        setHeadline(data.value);
      }
    } catch (e) {
      console.error("Error fetching settings:", e);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_config')
        .upsert({ id: 'hero_headline', value: headline });

      if (error) {
        if (error.code === '42P01') {
          alert("Database table 'site_config' is missing. Please run the required SQL in your Supabase dashboard.");
        } else {
          alert(error.message);
        }
      } else {
        alert("Headline updated successfully!");
      }
    } catch (e) {
      alert("An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-settings">
      <div className="admin-page-title">
        Global Site Settings
      </div>

      <div className="admin-card" style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--walnut-10)' }}>
          <Layout size={24} color="var(--accent)" />
          <h3 style={{ margin: 0 }}>Hero Section Configuration</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--muted)', display: 'block', marginBottom: '0.8rem' }}>
              Hero Sub-Headline (Floating beneath title)
            </label>
            <textarea
              rows="4"
              className="entry-input"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Enter the main headline for the homepage hero section..."
              style={{
                width: '100%',
                padding: '1.2rem',
                borderRadius: '12px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--walnut-10)',
                color: '#fff',
                fontSize: '1rem',
                lineHeight: '1.6',
                resize: 'vertical'
              }}
              disabled={loading}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.6rem' }}>
              This text appears prominently on the homepage hero section. Keep it concise but impactful.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button 
              className="glass-btn primary-btn" 
              onClick={handleSave}
              disabled={saving || loading}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              {saving ? <RefreshCcw size={18} className="spin" /> : <Save size={18} />}
              {saving ? ' SAVING CHANGES...' : ' UPDATE HEADLINE'}
            </button>
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed var(--walnut-10)', maxWidth: '800px' }}>
        <h4 style={{ fontSize: '0.8rem', color: 'var(--accent)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Developer Note</h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: 0 }}>
          The 'site_config' table stores global key-value pairs for dynamic content across Nexora Ventures. 
          Changes here reflect instantly on the public website.
        </p>
      </div>
    </div>
  );
};

export default AdminSettings;
