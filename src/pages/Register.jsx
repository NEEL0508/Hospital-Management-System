import React from 'react';
import { User, Mail, Phone, Calendar, Droplet, MapPin, Lock, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="register-page">
      <div className="container">
        <div className="register-card">
          <div className="register-header">
            <div className="register-icon-wrapper">
              <UserPlus size={28} color="white" />
            </div>
            <h1 className="register-title">Patient Registration</h1>
            <p className="register-subtitle">Create your account to book appointments</p>
          </div>
          
          <form className="register-form">
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input type="text" placeholder="John Doe" />
                </div>
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input type="email" placeholder="john@example.com" />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone Number *</label>
                <div className="input-with-icon">
                  <Phone size={18} className="input-icon" />
                  <input type="tel" placeholder="+1 (555) 123-4567" />
                </div>
              </div>
              <div className="form-group">
                <label>Age *</label>
                <div className="input-with-icon">
                  <Calendar size={18} className="input-icon" />
                  <input type="number" placeholder="25" />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Gender *</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <select defaultValue="">
                    <option value="" disabled>Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Blood Group *</label>
                <div className="input-with-icon">
                  <Droplet size={18} className="input-icon" />
                  <select defaultValue="">
                    <option value="" disabled>Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Address *</label>
              <div className="input-with-icon">
                <MapPin size={18} className="input-icon" />
                <input type="text" placeholder="123 Main St, New York, NY 10001" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Password *</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input type="password" placeholder="••••••••" />
                </div>
              </div>
              <div className="form-group">
                <label>Confirm Password *</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input type="password" placeholder="••••••••" />
                </div>
              </div>
            </div>

            <div className="form-checkbox">
              <input type="checkbox" id="terms" />
              <label htmlFor="terms">
                I agree to the <a href="#">Terms and Conditions</a> and <a href="#">Privacy Policy</a>
              </label>
            </div>

            <button type="submit" className="btn btn-primary form-submit-btn">Register</button>
            
            <p className="form-footer-text">
              Already have an account? <Link to="#" className="signin-link">Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
