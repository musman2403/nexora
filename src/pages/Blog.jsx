import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Search, Tag, Loader } from 'lucide-react';
import { supabase } from '../supabaseClient';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true);
      const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        setPosts(data);
      }
      setLoading(false);
    }
    fetchBlogs();
  }, []);

  return (
    <div className="page-container">
      <div style={{ marginBottom: '4rem' }}>
        <span className="accent-text">INSIGHTS & PERSPECTIVES</span>
        <h1 className="title-reveal" style={{ fontFamily: 'var(--font-display)' }}>Our Journal</h1>
        <p className="subtitle">Expert analysis and thought leadership on the future of real estate and architecture.</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
          <Loader size={40} color="var(--accent)" className="spin" />
        </div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-secondary)' }}>
          No articles found at the moment. Please check back later.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem' }}>
          {posts.map((post) => (
            <article key={post.id} className="content-box" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '240px', overflow: 'hidden' }}>
                {post.image ? (
                  <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Tag size={40} color="var(--accent)" opacity={0.3} />
                  </div>
                )}
              </div>
              <div style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={14} /> {new Date(post.created_at || post.date).toLocaleDateString()}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <User size={14} /> {post.author || 'Nexora Team'}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', lineHeight: 1.3 }}>{post.title}</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>{post.excerpt || (post.content && post.content.substring(0, 100) + '...')}</p>
                <Link to={`/blog/${post.id}`} className="glass-btn" style={{ margin: 0, padding: '0.6rem 1.5rem' }}>
                  READ ARTICLE <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      <div style={{ marginTop: '5rem', padding: '4rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-xl)', textAlign: 'center', border: '1px solid var(--border)' }}>
        <h3 style={{ fontFamily: 'var(--font-display)' }}>Subscribe to our Newsletter</h3>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem auto 2.5rem', maxWidth: '500px' }}>Get the latest insights and project updates delivered directly to your inbox.</p>
        <div style={{ display: 'flex', gap: '1rem', maxWidth: '500px', margin: '0 auto', flexWrap: 'wrap' }}>
          <input
            type="email"
            placeholder="Your email address"
            style={{
              flex: 1,
              minWidth: '250px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              padding: '1rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              outline: 'none'
            }}
          />
          <button className="glass-btn primary-btn" style={{ margin: 0, borderRadius: 'var(--radius-md)' }}>SUBSCRIBE</button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
