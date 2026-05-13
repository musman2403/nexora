import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Loader, Tag, Share2, Clock } from 'lucide-react';
import { supabase } from '../supabaseClient';

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [otherPosts, setOtherPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setPost(data);
        
        // Fetch other blogs
        const { data: others } = await supabase
          .from('blogs')
          .select('*')
          .neq('id', id)
          .limit(3);
        setOtherPosts(others || []);
        
        // Update view count
        await supabase.from('blogs').update({ views: (data.views || 0) + 1 }).eq('id', id);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Article not found or failed to load.');
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader size={40} color="var(--accent)" className="spin" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <h2 style={{ color: 'var(--text-secondary)' }}>{error || 'Article Not Found'}</h2>
        <Link to="/blog" className="glass-btn" style={{ marginTop: '2rem' }}>
          <ArrowLeft size={16} /> BACK TO JOURNAL
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Link to="/blog" className="glass-btn" style={{ marginBottom: '3rem', width: 'fit-content' }}>
        <ArrowLeft size={16} /> BACK TO JOURNAL
      </Link>

      <article className="blog-detail-content">
        <header style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--accent)' }}>
            <span className="accent-text" style={{ padding: '0.2rem 0.8rem', background: 'var(--accent-soft)', borderRadius: '20px' }}>
              {post.category || 'INSIGHTS'}
            </span>
          </div>
          <h1 className="title-reveal" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1.5rem', fontFamily: 'var(--font-display)' }}>{post.title}</h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', color: 'var(--text-tertiary)', fontSize: '0.9rem', padding: '1.5rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} /> {new Date(post.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} /> {post.author || 'Nexora Team'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} /> {Math.ceil((post.content?.length || 0) / 1000) + 2} min read
            </span>
          </div>
        </header>

        <div className="blog-featured-image" style={{ width: '100%', height: '500px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', marginBottom: '4rem', border: '1px solid var(--border)' }}>
          {post.image ? (
            <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Tag size={60} color="var(--accent)" opacity={0.2} />
            </div>
          )}
        </div>

        <div className="blog-body" style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.9)' }}>
          <p className="excerpt" style={{ fontSize: '1.4rem', color: 'var(--accent)', fontWeight: 300, marginBottom: '3rem', fontStyle: 'italic', borderLeft: '4px solid var(--accent)', paddingLeft: '2rem' }}>
            {post.excerpt}
          </p>
          <div className="blog-markdown-content" style={{ whiteSpace: 'pre-wrap' }}>
            {post.content}
          </div>
        </div>

        <footer style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="action-btn" style={{ borderRadius: '50%', width: '45px', height: '45px' }}><Share2 size={18} /></button>
          </div>
          <Link to="/blog" className="glass-btn">
            MORE ARTICLES <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
          </Link>
        </footer>
      </article>

      {otherPosts.length > 0 && (
        <section style={{ marginTop: '8rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
            <div>
              <span className="accent-text">READ NEXT</span>
              <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)' }}>Recommended Reading</h2>
            </div>
            <Link to="/blog" style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none', marginBottom: '0.5rem' }}>VIEW ALL JOURNAL</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {otherPosts.map((other) => (
              <Link to={`/blog/${other.id}`} key={other.id} className="content-box" style={{ padding: 0, textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '180px', overflow: 'hidden' }}>
                  <img src={other.image} alt={other.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.8rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Calendar size={12} /> {new Date(other.created_at).toLocaleDateString()}</span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.8rem', lineHeight: 1.4, color: 'var(--white)' }}>{other.title}</h3>
                  <div style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 700 }}>READ ARTICLE</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section style={{ marginTop: '8rem', padding: '5rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-display)' }}>Ready to explore the future?</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>Join Nexora Ventures in shaping the next generation of architectural marvels and strategic investments.</p>
        <Link to="/contact" className="glass-btn primary-btn">WORK WITH US</Link>
      </section>
    </div>
  );
};

export default BlogDetail;
