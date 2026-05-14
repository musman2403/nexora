import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, ArrowRight, User } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Admin check for testing
    if (email === 'admin@nexora.com' && password === 'admin123') {
      sessionStorage.setItem('nexora_admin_auth', 'true');
      navigate('/admin');
      return;
    }
    
    // Simulated general login
    alert('Invalid credentials');
  };

  return (
    <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div className="content-box" style={{ maxWidth: '450px', width: '100%', padding: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            background: 'var(--accent-soft)', 
            borderRadius: 'var(--radius-md)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 1.5rem',
            color: 'var(--accent)'
          }}>
            <LogIn size={30} />
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Enter your credentials to access your account</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', color: 'var(--text-tertiary)' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                style={{ 
                  width: '100%', 
                  background: 'var(--bg-surface)', 
                  border: '1px solid var(--border)', 
                  padding: '0.8rem 1rem 0.8rem 3rem', 
                  borderRadius: 'var(--radius-sm)', 
                  color: 'var(--white)',
                  outline: 'none',
                  transition: 'border-color 0.3s'
                }}
                required
              />
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-tertiary)' }}>Password</label>
              <a href="#" style={{ fontSize: '0.7rem', color: 'var(--accent)', textDecoration: 'none' }}>Forgot password?</a>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ 
                  width: '100%', 
                  background: 'var(--bg-surface)', 
                  border: '1px solid var(--border)', 
                  padding: '0.8rem 1rem 0.8rem 3rem', 
                  borderRadius: 'var(--radius-sm)', 
                  color: 'var(--white)',
                  outline: 'none',
                  transition: 'border-color 0.3s'
                }}
                required
              />
            </div>
          </div>

          <button type="submit" className="glass-btn primary-btn" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}>
            SIGN IN <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>OR CONTINUE WITH</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
          </div>

          <button className="glass-btn" style={{ width: '100%', justifyContent: 'center', margin: 0 }}>
            <User size={18} /> GITHUB
          </button>

          <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Don't have an account? <Link to="/contact" style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>Get in touch</Link>
          </p>
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--accent-soft)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--accent)', border: '1px solid var(--border-hover)' }}>
            <strong>TEST ADMIN:</strong> admin@nexora.com / admin123
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
