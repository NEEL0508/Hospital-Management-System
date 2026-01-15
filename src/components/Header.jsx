import React, { useContext } from 'react';
import { SquarePlus, Home, LogOut, UserCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/dashboard';
    if (user.role === 'Admin') return '/admin/dashboard';
    if (user.role === 'Doctor') return '/doctor/dashboard';
    return '/dashboard';
  };

  const getRoleBadge = () => {
    if (user?.role === 'Admin') return { label: 'ADMIN', bg: '#e0f2fe', color: '#3b82f6' };
    if (user?.role === 'Doctor') return { label: 'DOCTOR', bg: '#dcfce7', color: '#16a34a' };
    return { label: 'PATIENT', bg: '#f3e8ff', color: '#9333ea' };
  };

  const badge = getRoleBadge();

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">
          <div className="logo-icon">
            <SquarePlus size={20} color="white" strokeWidth={2.5} />
          </div>
          <span className="logo-text">Hospital Management</span>
        </Link>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>

          {user ? (
            <>
              <Link to={getDashboardLink()} className="nav-link-icon text-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Home size={16} /> Dashboard
              </Link>
              <NotificationBell />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }}>
                <UserCircle size={20} color="#64748b" />
                <span style={{ fontWeight: 500, color: '#1e293b' }}>{user.name}</span>
                <span style={{ backgroundColor: badge.bg, color: badge.color, fontSize: '0.7rem', fontWeight: 'bold', padding: '0.1rem 0.4rem', borderRadius: '9999px' }}>
                  {badge.label}
                </span>
                <button
                  onClick={handleLogout}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'none', border: 'none', color: '#ef4444', fontWeight: 500, cursor: 'pointer', fontSize: '0.95rem' }}>
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
