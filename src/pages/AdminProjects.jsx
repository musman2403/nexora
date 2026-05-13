import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ExternalLink, X, Save } from 'lucide-react';
import { supabase } from '../supabaseClient';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [selectedProject, setSelectedProject] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setLoading(true);
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (!error && data) setProjects(data);
    setLoading(false);
  }

  const openModal = (project, editMode = false) => {
    setSelectedProject(project);
    setIsEditing(editMode);
    if (project) {
      setFormData({
        id: project.id,
        title: project.title || '',
        status: project.status || 'In Progress',
        price: project.investment?.price || '',
        priceType: project.investment?.plan || 'Once',
        duration: project.investment?.duration || '',
        description: project.description || '',
        image: project.image || '',
        features: project.features ? project.features.join(', ') : ''
      });
    } else {
      setFormData({
        title: '',
        status: 'In Progress',
        price: '',
        priceType: 'Once',
        duration: '',
        description: '',
        image: '',
        features: ''
      });
    }
  };

  const closeModal = () => {
    setSelectedProject(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    const payload = {
      title: formData.title,
      status: formData.status,
      description: formData.description,
      image: formData.image,
      features: formData.features.split(',').map(f => f.trim()).filter(f => f.length > 0),
      investment: {
        price: formData.price,
        plan: formData.priceType,
        duration: formData.duration
      }
    };

    if (formData.id) {
      await supabase.from('projects').update(payload).eq('id', formData.id);
    } else {
      await supabase.from('projects').insert([payload]);
    }
    closeModal();
    fetchProjects();
  };

  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit.');
        return;
      }

      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('projects')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('projects')
        .getPublicUrl(fileName);

      setFormData({ ...formData, image: publicUrl });
    } catch (error) {
      alert(`Upload failed: ${error.message}. Please ensure you have created a public storage bucket named 'projects'.`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if(window.confirm('Are you sure you want to delete this project?')) {
      await supabase.from('projects').delete().eq('id', id);
      fetchProjects();
    }
  };

  return (
    <div>
      <div className="admin-page-title">
        Project Assets
        <button className="glass-btn primary-btn" style={{ padding: '0.6rem 1.2rem', fontSize: '0.8rem' }} onClick={() => openModal(null, true)}>
          <Plus size={16} /> NEW ASSET
        </button>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Project Name</th>
              <th>Time / Duration</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length > 0 ? projects.map(project => (
              <tr key={project.id} onClick={() => openModal(project)} style={{ cursor: 'pointer' }}>
                <td style={{ fontFamily: 'monospace', color: 'var(--muted)' }}>#{project.id.toString().padStart(3, '0')}</td>
                <td style={{ fontWeight: 600 }}>{project.title}</td>
                <td style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{project.investment?.duration || '-'}</td>
                <td>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    color: project.status === 'Already Done' ? '#00ff66' : project.status === 'In Progress' ? 'var(--tan)' : '#ffcc00'
                  }}>
                    ● {project.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button className="action-btn" onClick={(e) => { e.stopPropagation(); openModal(project, true); }}><Edit2 size={14} /></button>
                    <button className="action-btn" onClick={(e) => handleDelete(e, project.id)} style={{ borderColor: 'rgba(255,0,0,0.2)' }}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
                  {loading ? 'Decrypting operational data...' : 'No assets found in the database.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {(selectedProject || isEditing) && (
        <div className="modal-overlay" onClick={closeModal} style={{ zIndex: 1000 }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', background: 'var(--bg)', border: '1px solid var(--tan-glow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--walnut-10)', paddingBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{formData.id ? (isEditing ? 'Edit Project' : 'Project Details') : 'Add New Project'}</h2>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {!isEditing && selectedProject && (
                  <button className="glass-btn" style={{ margin: 0, padding: '0.4rem 1rem', fontSize: '0.8rem' }} onClick={() => setIsEditing(true)}>
                    <Edit2 size={14} /> EDIT
                  </button>
                )}
                <button className="modal-close" onClick={closeModal} style={{ position: 'relative', top: 0, right: 0 }}><X size={20}/></button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {isEditing ? (
                <>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block', marginBottom: '0.3rem' }}>Project Name</label>
                    <input type="text" className="entry-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--walnut-10)', color: '#fff' }} />
                  </div>
                  
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block', marginBottom: '0.3rem' }}>Status</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--walnut-10)', color: '#fff' }}>
                      <option value="In Progress">In Progress</option>
                      <option value="Already Done">Already Done</option>
                      <option value="In Future">In Future</option>
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block', marginBottom: '0.3rem' }}>Price</label>
                      <input type="text" placeholder="e.g. $50,000" className="entry-input" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--walnut-10)', color: '#fff' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block', marginBottom: '0.3rem' }}>Payment Type</label>
                      <select value={formData.priceType} onChange={e => setFormData({...formData, priceType: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--walnut-10)', color: '#fff' }}>
                        <option value="Once">Once</option>
                        <option value="Per Month">Per Month</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block', marginBottom: '0.3rem' }}>Total Time / Duration</label>
                    <input type="text" placeholder="e.g. 6 Months" className="entry-input" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--walnut-10)', color: '#fff' }} />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block', marginBottom: '0.3rem' }}>Description</label>
                    <textarea rows="3" className="entry-input" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--walnut-10)', color: '#fff' }}></textarea>
                  </div>
                  
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block', marginBottom: '0.3rem' }}>Image (URL or Local Upload - Max 5MB)</label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input type="text" placeholder="/images/project.jpg" className="entry-input" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--walnut-10)', color: '#fff' }} />
                      <label className="glass-btn" style={{ padding: '0.8rem', cursor: 'pointer', margin: 0, opacity: uploading ? 0.5 : 1, pointerEvents: uploading ? 'none' : 'auto' }}>
                        {uploading ? 'UPLOADING...' : 'BROWSE'}
                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block', marginBottom: '0.3rem' }}>Key Features (Comma Separated)</label>
                    <input type="text" placeholder="Smart Grid, Security, 24/7 Power" className="entry-input" value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--walnut-10)', color: '#fff' }} />
                  </div>

                  <button className="glass-btn primary-btn" onClick={handleSave} style={{ marginTop: '1rem', justifyContent: 'center' }}>
                    <Save size={16} /> SAVE PROJECT
                  </button>
                </>
              ) : (
                <>
                  {formData.image && (
                    <div style={{ width: '100%', height: '200px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem', border: '1px solid var(--walnut-10)' }}>
                      <img src={formData.image} alt="Project" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', borderLeft: '3px solid var(--tan)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>STATUS</div>
                      <div style={{ fontWeight: 600, color: formData.status === 'Already Done' ? '#00ff66' : formData.status === 'In Progress' ? 'var(--tan)' : '#ffcc00' }}>{formData.status}</div>
                    </div>
                    <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', borderLeft: '3px solid var(--tan)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>TOTAL TIME</div>
                      <div style={{ fontWeight: 600 }}>{formData.duration || '-'}</div>
                    </div>
                    <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', borderLeft: '3px solid var(--tan)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>PRICE</div>
                      <div style={{ fontWeight: 600 }}>{formData.price || '-'}</div>
                    </div>
                    <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', borderLeft: '3px solid var(--tan)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>PAYMENT TYPE</div>
                      <div style={{ fontWeight: 600 }}>{formData.priceType || '-'}</div>
                    </div>
                  </div>
                  {formData.description && (
                    <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>DESCRIPTION</div>
                      <div style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{formData.description}</div>
                    </div>
                  )}
                  {formData.features && (
                    <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', marginTop: '1rem' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>KEY FEATURES</div>
                      <div style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{formData.features.split(',').map(f => `• ${f.trim()}`).join('  ')}</div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;
