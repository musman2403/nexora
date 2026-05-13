import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { supabase } from '../supabaseClient';

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true);
      const { data, error } = await supabase.from('blogs').select('*');
      if (!error && data) setBlogs(data);
      setLoading(false);
    }
    fetchBlogs();
  }, []);

  return (
    <div>
      <div className="admin-page-title">
        Insights & Blogs
        <button className="glass-btn primary-btn" style={{ padding: '0.6rem 1.2rem', fontSize: '0.8rem' }}>
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
                    <button className="action-btn"><Edit2 size={14} /></button>
                    <button className="action-btn" style={{ borderColor: 'rgba(255,0,0,0.2)' }}><Trash2 size={14} /></button>
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
    </div>
  );
};

export default AdminBlogs;
