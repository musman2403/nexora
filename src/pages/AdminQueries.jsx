import React, { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, CheckCircle, Trash2, X } from 'lucide-react';
import { supabase } from '../supabaseClient';

const AdminQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuery, setSelectedQuery] = useState(null);

  useEffect(() => {
    async function fetchQueries() {
      setLoading(true);
      const { data, error } = await supabase.from('queries').select('*').order('created_at', { ascending: false });
      if (!error && data) setQueries(data);
      setLoading(false);
    }
    fetchQueries();
  }, []);

  return (
    <div>
      <div className="admin-page-title">
        Contact Queries
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Sender</th>
              <th>Message Preview</th>
              <th>Received</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {queries.length > 0 ? queries.map(q => (
              <tr key={q.id} onClick={() => setSelectedQuery(q)} style={{ cursor: 'pointer' }}>
                <td>
                  <div style={{ fontWeight: 600 }}>{q.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{q.email}</div>
                </td>
                <td style={{ fontSize: '0.85rem', color: 'var(--cream)', maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {q.message}
                </td>
                <td style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Calendar size={12} /> {new Date(q.created_at).toLocaleDateString()}
                  </div>
                </td>
                <td>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    padding: '0.2rem 0.6rem', 
                    background: q.status === 'New' ? 'var(--accent-soft)' : 'rgba(74, 222, 128, 0.1)',
                    color: q.status === 'New' ? 'var(--accent)' : 'var(--success)',
                    borderRadius: '20px',
                    border: `1px solid ${q.status === 'New' ? 'var(--border-hover)' : 'rgba(74, 222, 128, 0.2)'}`
                  }}>
                    {q.status || 'New'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button className="action-btn" title="Mark as Read" onClick={(e) => { e.stopPropagation(); /* implement mark read logic */ }}><CheckCircle size={14} /></button>
                    <button className="action-btn" title="Email Sender" onClick={(e) => { e.stopPropagation(); window.location.href=`mailto:${q.email}`; }}><Mail size={14} /></button>
                    <button className="action-btn" style={{ borderColor: 'rgba(255,0,0,0.2)' }} onClick={(e) => { e.stopPropagation(); /* implement delete logic */ }}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
                  {loading ? 'Scanning for incoming signals...' : 'The inbox is currently silent.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedQuery && (
        <div className="modal-overlay" onClick={() => setSelectedQuery(null)} style={{ zIndex: 1000 }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', background: 'var(--bg)', border: '1px solid var(--tan-glow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--walnut-10)', paddingBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Query Details</h2>
              <button className="modal-close" onClick={() => setSelectedQuery(null)} style={{ position: 'relative', top: 0, right: 0 }}><X size={20}/></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', borderLeft: '3px solid var(--tan)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>SENDER</div>
                <div style={{ fontWeight: 600 }}>{selectedQuery.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{selectedQuery.email}</div>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', borderLeft: '3px solid var(--tan)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>STATUS & DATE</div>
                <div style={{ fontWeight: 600, color: selectedQuery.status === 'New' ? 'var(--tan)' : '#00ff66' }}>{selectedQuery.status || 'New'}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{new Date(selectedQuery.created_at).toLocaleString()}</div>
              </div>
            </div>

            <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>MESSAGE CONTENT</div>
              <div style={{ fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', color: '#FFFFFF' }}>
                {selectedQuery.message}
              </div>
            </div>
            
            {(() => {
              const phoneMatch = selectedQuery.message.match(/Phone:\s*(.+)/);
              const phone = phoneMatch ? phoneMatch[1].trim().replace(/\D/g, '') : null;
              
              return (
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  {phone && phone.length > 5 && (
                    <button className="glass-btn" onClick={() => window.open(`https://wa.me/${phone}`, '_blank')} style={{ padding: '0.6rem 1.2rem', fontSize: '0.8rem', borderColor: 'rgba(37, 211, 102, 0.5)', color: '#25D366' }}>
                      <Phone size={16} /> REPLY VIA WHATSAPP
                    </button>
                  )}
                  <button className="glass-btn primary-btn" onClick={() => window.location.href=`mailto:${selectedQuery.email}`} style={{ padding: '0.6rem 1.2rem', fontSize: '0.8rem' }}>
                    <Mail size={16} /> REPLY VIA EMAIL
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQueries;
