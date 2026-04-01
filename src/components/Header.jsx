import React from 'react';
import { SquarePlus, Home, LogOut, UserCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard') || location.pathname.includes('/find-doctors') || location.pathname.includes('/book-appointment') || location.pathname.includes('/my-appointments') || location.pathname.includes('/medical-records');
  const isDoctorPanel = location.pathname.includes('/doctor');
  const isAdminPanel = location.pathname.includes('/admin');

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
          {isAdminPanel ? (
            <>
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/admin/dashboard" className="nav-link-icon text-primary"><Home size={16} className="mr-1"/> Dashboard</Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem' }}>
                <UserCircle size={20} color="#64748b" />
                <span style={{ fontWeight: 500, color: '#1e293b' }}>Admin User</span>
                <span style={{ backgroundColor: '#e0f2fe', color: '#3b82f6', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.1rem 0.4rem', borderRadius: '9999px', marginRight: '0.5rem' }}>ADMIN</span>
                <Link to="/login" className="nav-link-icon text-danger" style={{ display: 'flex', alignItems: 'center', color: '#ef4444' }}><LogOut size={16} className="mr-1"/> Logout</Link>
              </div>
            </>
          ) : isDoctorPanel ? (
            <>
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/doctor/dashboard" className="nav-link-icon text-primary"><Home size={16} className="mr-1"/> Dashboard</Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem' }}>
                <UserCircle size={20} color="#64748b" />
                <span style={{ fontWeight: 500, color: '#1e293b' }}>Dr. Sarah Johnson</span>
                <span style={{ backgroundColor: '#e0f2fe', color: '#3b82f6', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.1rem 0.4rem', borderRadius: '9999px', marginRight: '0.5rem' }}>DOCTOR</span>
                <Link to="/login" className="nav-link-icon text-danger" style={{ display: 'flex', alignItems: 'center', color: '#ef4444' }}><LogOut size={16} className="mr-1"/> Logout</Link>
              </div>
            </>
          ) : isDashboard ? (
            <>
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/dashboard" className="nav-link-icon text-primary"><Home size={16} className="mr-1"/> Dashboard</Link>
              <Link to="/login" className="nav-link-icon text-danger"><LogOut size={16} className="mr-1"/> Logout</Link>
            </>
          ) : (
            <>
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
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
