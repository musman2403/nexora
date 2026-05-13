import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Plus, Edit2, Trash2, X, UploadCloud, Loader } from 'lucide-react';

const AdminPartners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({ id: null, name: '', logo_url: '', details: '' });

  useEffect(() => {
    fetchPartners();
  }, []);

  async function fetchPartners() {
    setLoading(true);
    const { data, error } = await supabase.from('partners').select('*').order('created_at', { ascending: false });
    if (!error && data) setPartners(data);
    setLoading(false);
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Maximum size is 5MB.");
      return;
    }

    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `partner_logos/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('projects').upload(filePath, file);

    if (uploadError) {
      console.error("Upload error: ", uploadError);
      alert(`Upload failed: ${uploadError.message}`);
      setIsUploading(false);
      return;
    }

    const { data } = supabase.storage.from('projects').getPublicUrl(filePath);
    setFormData(prev => ({ ...prev, logo_url: data.publicUrl }));
    setIsUploading(false);
  };

  const handleSave = async () => {
    const payload = {
      name: formData.name,
      logo_url: formData.logo_url,
      details: formData.details
    };

    if (formData.id) {
      await supabase.from('partners').update(payload).eq('id', formData.id);
    } else {
      await supabase.from('partners').insert([payload]);
    }
    
    setIsModalOpen(false);
    fetchPartners();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this partner?')) {
      await supabase.from('partners').delete().eq('id', id);
      fetchPartners();
    }
  };

  const openModal = (partner = null) => {
    if (partner) {
      setFormData(partner);
    } else {
      setFormData({ id: null, name: '', logo_url: '', details: '' });
    }
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="admin-page-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Partners (Logos)
        <button className="glass-btn primary-btn" onClick={() => openModal()} style={{ fontSize: '0.8rem', padding: '0.6rem 1.2rem' }}>
          <Plus size={16} /> ADD PARTNER
        </button>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Logo</th>
              <th>Partner Name</th>
              <th>Details Preview</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {partners.length > 0 ? partners.map(p => (
              <tr key={p.id}>
                <td>
                  <div style={{ width: '50px', height: '50px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {p.logo_url ? <img src={p.logo_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} loading="lazy" /> : <span style={{fontSize: '0.6rem', color: 'var(--muted)'}}>NO LOGO</span>}
                  </div>
                </td>
                <td style={{ fontWeight: 600 }}>{p.name}</td>
                <td style={{ fontSize: '0.85rem', color: 'var(--muted)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {p.details}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button className="action-btn" onClick={() => openModal(p)}><Edit2 size={14} /></button>
                    <button className="action-btn" style={{ borderColor: 'rgba(255,0,0,0.2)' }} onClick={() => handleDelete(p.id)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
                  {loading ? 'Loading partners...' : 'No partners created yet.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{formData.id ? 'Edit Partner' : 'New Partner'}</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}><X size={20}/></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="float-field" style={{ margin: 0 }}>
                <input type="text" placeholder=" " value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <label>Partner / Brand Name</label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div className="float-field" style={{ margin: 0, flex: 1 }}>
                  <input type="text" placeholder=" " value={formData.logo_url} onChange={e => setFormData({...formData, logo_url: e.target.value})} />
                  <label>Logo URL</label>
                </div>
                <div style={{ position: 'relative' }}>
                  <input type="file" id="partner-logo-upload" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  <label htmlFor="partner-logo-upload" className="glass-btn" style={{ padding: '0.8rem 1rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    {isUploading ? <Loader size={16} className="spin" /> : <UploadCloud size={16} />} 
                    {isUploading ? ' UPLOADING...' : ' BROWSE'}
                  </label>
                </div>
              </div>

              <div className="float-field" style={{ margin: 0 }}>
                <textarea placeholder=" " rows="6" value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})}></textarea>
                <label>Project / Partner Details</label>
              </div>

              <button className="glass-btn primary-btn" onClick={handleSave} style={{ marginTop: '1rem', justifyContent: 'center' }}>
                SAVE PARTNER
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPartners;
