import React, { useState, useContext } from 'react';
import { Mail, Lock, User, ShieldPlus, Stethoscope } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await login(email, password);
    if (response.success) {
      toast.success('Welcome back!');
      if (response.role === 'Admin') navigate('/admin/dashboard');
      else if (response.role === 'Doctor') navigate('/doctor/dashboard');
      else navigate('/dashboard');
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-wrapper">
          <div className="login-card">
            <div className="login-header">
              <div className="login-icon-wrapper">
                <ShieldPlus size={32} color="#2563eb" />
              </div>
              <h1 className="login-title">Secure Login</h1>
              <p className="login-subtitle">Access your health dashboard</p>
            </div>
            
            <form className="login-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input type="email" required placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
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
