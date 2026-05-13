import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Activity, Users, Database, Server, FileText } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ projects: 0, blogs: 0, queries: 0, sessions: 0 });

  useEffect(() => {
    async function fetchStats() {
      try {
        const { count: projectCount } = await supabase.from('projects').select('*', { count: 'exact', head: true });
        const { count: blogCount } = await supabase.from('blogs').select('*', { count: 'exact', head: true });
        const { count: queryCount } = await supabase.from('queries').select('*', { count: 'exact', head: true });
        const { count: sessionCount } = await supabase.from('sessions').select('*', { count: 'exact', head: true });

        setStats({ 
          projects: projectCount ?? 0, 
          blogs: blogCount ?? 0,
          queries: queryCount ?? 0,
          sessions: sessionCount ?? 0
        });
      } catch (e) {
        console.error("Stats fetch failed", e);
      }
    }
    fetchStats();
  }, []);

  return (
    <div>
      <div className="admin-page-title">
        Command Center
        <div style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 400, letterSpacing: '0.1em' }}>NEXUS PROTOCOL v4.2</div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="admin-card" style={{ borderLeft: '4px solid var(--accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Projects</h3>
            <Database color="var(--accent)" size={20} />
          </div>
          <div style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--white)', letterSpacing: '-0.02em' }}>{stats.projects}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--success)', marginTop: '1rem' }}>
            <Activity size={14} /> All systems operational
          </div>
        </div>
        
        <div className="admin-card" style={{ borderLeft: '4px solid var(--accent-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Published Blogs</h3>
            <FileText color="var(--accent-light)" size={20} />
          </div>
          <div style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--white)', letterSpacing: '-0.02em' }}>{stats.blogs}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
            Content synchronized
          </div>
        </div>

        <div className="admin-card" style={{ borderLeft: '4px solid var(--error)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inquiries</h3>
            <Activity color="var(--error)" size={20} />
          </div>
          <div style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--white)', letterSpacing: '-0.02em' }}>{stats.queries}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
            Total Contact Queries
          </div>
        </div>

        <div className="admin-card" style={{ borderLeft: '4px solid var(--success)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Website Sessions</h3>
            <Users color="var(--success)" size={20} />
          </div>
          <div style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--white)', letterSpacing: '-0.02em' }}>
            {stats.sessions.toLocaleString()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--success)', marginTop: '1rem' }}>
            <div className="admin-status-dot"></div> Live Tracking Active
          </div>
        </div>
      </div>


    </div>
  );
};

export default AdminDashboard;
