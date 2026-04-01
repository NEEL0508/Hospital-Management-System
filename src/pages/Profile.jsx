import React from 'react';
import { User, Mail, Phone, Droplet, MapPin, Lock, Save } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const Profile = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar activeId="profile" />

      <main className="dashboard-content">
        <header className="dashboard-welcome">
          <h1 className="welcome-title">Patient Profile</h1>
          <p className="welcome-subtitle">Manage your account settings and personal information</p>
        </header>

        <div className="dashboard-info-grid" style={{ alignItems: 'start' }}>
          
          {/* Profile Information Card */}
          <div className="book-appointment-card" style={{ maxWidth: '100%', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', color: '#0f172a' }}>Profile Information</h3>
            <form className="appointment-form" style={{ gap: '1.25rem' }}>
              
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Full Name</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input type="text" defaultValue="John Smith" />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Email</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input type="email" defaultValue="patient@hospital.com" />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Phone</label>
                <div className="input-with-icon">
                  <Phone size={18} className="input-icon" />
                  <input type="tel" defaultValue="+1-555-0003" />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Blood Group</label>
                <div className="input-with-icon">
                  <Droplet size={18} className="input-icon" />
                  <select defaultValue="O+">
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

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label>Address</label>
                <div className="textarea-wrapper">
                  <MapPin size={18} className="textarea-icon" />
                  <textarea 
                    className="form-textarea" 
                    defaultValue="123 Main St, New York, NY 10001"
                    style={{ minHeight: '80px', padding: '1rem 1rem 1rem 2.75rem' }}
                  ></textarea>
                </div>
              </div>

              <button type="button" className="btn btn-purple form-submit-btn" style={{ display: 'flex', gap: '8px', justifyContent: 'center', margin: '0' }}>
                <Save size={18} /> Update Profile
              </button>
            </form>
          </div>

          {/* Change Password Card */}
          <div className="book-appointment-card" style={{ maxWidth: '100%', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', color: '#0f172a' }}>Change Password</h3>
            <form className="appointment-form" style={{ gap: '1.25rem' }}>
              
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Current Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input type="password" defaultValue="••••••••" />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>New Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input type="password" defaultValue="••••••••" />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label>Confirm New Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input type="password" defaultValue="••••••••" />
                </div>
              </div>

              <button type="button" className="btn btn-purple form-submit-btn" style={{ display: 'flex', gap: '8px', justifyContent: 'center', margin: '0' }}>
                <Lock size={18} /> Change Password
              </button>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Profile;
