import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, X, Save, FileText, UploadCloud, Loader } from 'lucide-react';
import { supabase } from '../supabaseClient';

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ 
    id: null, title: '', author: '', excerpt: '', content: '', category: 'Tech', image: '' 
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function fetchBlogs() {
    setLoading(true);
    const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
    if (!error && data) setBlogs(data);
    setLoading(false);
  }

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
      const filePath = `blog_images/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('projects')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('projects')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image: publicUrl });
    } catch (error) {
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const openModal = (blog = null) => {
    if (blog) {
      setFormData(blog);
      setIsEditing(true);
    } else {
      setFormData({ id: null, title: '', author: '', excerpt: '', content: '', category: 'Tech', image: '' });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
  };

  const handleSave = async () => {
    const payload = {
      title: formData.title,
      author: formData.author,
      excerpt: formData.excerpt,
      content: formData.content,
      category: formData.category,
      image: formData.image
    };

    if (formData.id) {
      const { error } = await supabase.from('blogs').update(payload).eq('id', formData.id);
      if (error) alert(error.message);
    } else {
      const { error } = await supabase.from('blogs').insert([payload]);
      if (error) alert(error.message);
    }
    
    closeModal();
    fetchBlogs();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      const { error } = await supabase.from('blogs').delete().eq('id', id);
      if (error) alert(error.message);
      fetchBlogs();
    }
  };

  return (
    <div>
      <div className="admin-page-title">
        Insights & Blogs
        <button className="glass-btn primary-btn" style={{ padding: '0.6rem 1.2rem', fontSize: '0.8rem' }} onClick={() => openModal()}>
          <Plus size={16} /> NEW POST
        </button>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Published</th>
              <th>Engagement</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length > 0 ? blogs.map(blog => (
              <tr key={blog.id}>
                <td style={{ fontWeight: 600, maxWidth: '300px' }}>{blog.title}</td>
                <td style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{blog.author}</td>
                <td style={{ fontSize: '0.85rem' }}>{new Date(blog.created_at).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                    <Eye size={14} color="var(--tan)" /> {blog.views || 0}
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button className="action-btn" onClick={() => openModal(blog)}><Edit2 size={14} /></button>
                    <button className="action-btn" style={{ borderColor: 'rgba(255,0,0,0.2)' }} onClick={() => handleDelete(blog.id)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
                  {loading ? 'Retrieving neural data...' : 'No data insights found in the archive.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal} style={{ zIndex: 1000 }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', background: 'var(--bg)', border: '1px solid var(--tan-glow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--walnut-10)', paddingBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{formData.id ? 'Edit Blog Post' : 'Create New Blog Post'}</h2>
              <button className="modal-close" onClick={closeModal} style={{ position: 'relative', top: 0, right: 0 }}><X size={20}/></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block', marginBottom: '0.3rem' }}>Blog Title</label>
                  <input type="text" className="entry-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--walnut-10)', color: '#fff' }} />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block', marginBottom: '0.3rem' }}>Author</label>
                    <input type="text" className="entry-input" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--walnut-10)', color: '#fff' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block', marginBottom: '0.3rem' }}>Category</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--walnut-10)', color: '#fff' }}>
                      <option value="Tech">Technology</option>
                      <option value="Design">Architecture & Design</option>
                      <option value="Strategy">Strategy</option>
                      <option value="Insight">Insight</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block', marginBottom: '0.3rem' }}>Excerpt (Short Summary)</label>
                  <textarea rows="2" className="entry-input" value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--walnut-10)', color: '#fff' }}></textarea>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block', marginBottom: '0.3rem' }}>Header Image (URL or Browse)</label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input type="text" placeholder="/images/blog/hero.jpg" className="entry-input" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--walnut-10)', color: '#fff' }} />
                    <label className="glass-btn" style={{ padding: '0.8rem', cursor: 'pointer', margin: 0, opacity: uploading ? 0.5 : 1, pointerEvents: uploading ? 'none' : 'auto' }}>
                      {uploading ? <Loader size={16} className="spin" /> : <UploadCloud size={16} />} 
                      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                    </label>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block', marginBottom: '0.3rem' }}>Full Content (Markdown supported)</label>
                  <textarea rows="12" className="entry-input" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--walnut-10)', color: '#fff', fontFamily: 'monospace', fontSize: '0.85rem' }}></textarea>
                </div>

                <button className="glass-btn primary-btn" onClick={handleSave} style={{ marginTop: 'auto', justifyContent: 'center' }}>
                  <Save size={16} /> SAVE POST
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogs;

