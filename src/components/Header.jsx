import React from 'react';
import { SquarePlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
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
          <a href="#">About</a>
          <a href="#">Contact</a>
          <Link to="/login">Login</Link>
          <Link to="/register" className="btn btn-primary">Register</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
