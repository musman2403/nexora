import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, FileText, LogOut, MessageSquare, Users, Settings } from 'lucide-react';
import { supabase } from '../supabaseClient';
import './AdminLayout.css';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          DASHBOARD
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin" end className={({isActive}) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink to="/admin/projects" className={({isActive}) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            <FolderKanban size={20} /> Projects
          </NavLink>
          <NavLink to="/admin/blogs" className={({isActive}) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            <FileText size={20} /> Blogs
          </NavLink>
          <NavLink to="/admin/partners" className={({isActive}) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            <Users size={20} /> Partners
          </NavLink>
          <NavLink to="/admin/queries" className={({isActive}) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            <MessageSquare size={20} /> Queries
          </NavLink>
          <NavLink to="/admin/settings" className={({isActive}) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            <Settings size={20} /> Settings
          </NavLink>
        </nav>
        <button onClick={handleLogout} className="admin-logout-btn">
          <LogOut size={20} /> Logout
        </button>
      </aside>
      <main className="admin-main" data-lenis-prevent="true">
        <header className="admin-header">
          <div className="admin-header-title">System Overview</div>
          <div className="admin-user-info">
            <span className="admin-status-dot"></span> Online
          </div>
        </header>
        <div className="admin-content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
