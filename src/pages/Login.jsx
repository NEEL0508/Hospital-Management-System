import React, { useState } from 'react';
import { User, Mail, Lock, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('Patient');

  const handleLogin = (e) => {
    e.preventDefault();
    if (role === 'Doctor') {
      navigate('/doctor/dashboard');
    } else if (role === 'Admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-wrapper">
          <div className="login-card">
            <div className="login-header">
              <div className="login-icon-wrapper">
                <User size={32} color="#2563eb" />
              </div>
              <h1 className="login-title">{role} Login</h1>
              <p className="login-subtitle">Access your health dashboard</p>
            </div>
            
            <form className="login-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input type="email" placeholder="Enter your email" />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input type="password" placeholder="••••••••" />
                  <EyeOff size={18} className="input-icon-right" />
                </div>
              </div>

              <div className="form-options">
                <div className="form-checkbox">
                  <input type="checkbox" id="remember" />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
              </div>

              <button type="submit" className="btn btn-primary form-submit-btn">Sign In</button>
              
              <div className="role-buttons">
                <button type="button" className={`btn-role ${role === 'Admin' ? 'active' : ''}`} onClick={() => setRole('Admin')}>Admin</button>
                <button type="button" className={`btn-role ${role === 'Doctor' ? 'active' : ''}`} onClick={() => setRole('Doctor')}>Doctor</button>
                <button type="button" className={`btn-role ${role === 'Patient' ? 'active' : ''}`} onClick={() => setRole('Patient')}>Patient</button>
              </div>

              <p className="form-footer-text">
                Don't have an account? <Link to="/register" className="register-link">Register here</Link>
              </p>
            </form>
          </div>
          <p className="secure-text">
            Secure 256-bit SSL encrypted connection. Your data privacy is our priority.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
