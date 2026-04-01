import React from 'react';
import { SquarePlus, Home, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard') || location.pathname.includes('/find-doctors') || location.pathname.includes('/book-appointment') || location.pathname.includes('/my-appointments') || location.pathname.includes('/medical-records');

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
          {isDashboard ? (
            <>
              <Link to="/">Home</Link>
              <a href="#">About</a>
              <a href="#">Contact</a>
              <Link to="/dashboard" className="nav-link-icon text-primary"><Home size={16} className="mr-1"/> Dashboard</Link>
              <Link to="/login" className="nav-link-icon text-danger"><LogOut size={16} className="mr-1"/> Logout</Link>
            </>
          ) : (
            <>
              <Link to="/">Home</Link>
              <a href="#">About</a>
              <a href="#">Contact</a>
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
