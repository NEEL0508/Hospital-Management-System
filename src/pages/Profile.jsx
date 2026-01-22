import React, { useState, useContext, useEffect } from 'react';
import { User, Mail, Phone, Droplet, MapPin, Lock, Save } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    bloodGroup: 'O+',
    address: ''
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bloodGroup: user.bloodGroup || 'O+',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await api.put('/auth/profile', profileData, config);
      updateUser(data);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
       return toast.error('New passwords do not match!');
    }
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await api.put('/auth/profile', { 
         currentPassword: passwords.currentPassword,
         password: passwords.newPassword 
      }, config);
      updateUser(data);
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    }
  };

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
            <form className="appointment-form" style={{ gap: '1.25rem' }} onSubmit={handleProfileUpdate}>
              
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Full Name</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input type="text" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Email</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input type="email" value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Phone</label>
                <div className="input-with-icon">
                  <Phone size={18} className="input-icon" />
                  <input type="tel" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} placeholder="Enter phone number" />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Blood Group</label>
                <div className="input-with-icon">
                  <Droplet size={18} className="input-icon" />
                  <select value={profileData.bloodGroup} onChange={(e) => setProfileData({...profileData, bloodGroup: e.target.value})}>
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
                    value={profileData.address}
                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                    placeholder="Enter full address"
                    style={{ minHeight: '80px', padding: '1rem 1rem 1rem 2.75rem' }}
                  ></textarea>
                </div>
              </div>

              <button type="submit" className="btn btn-purple form-submit-btn" style={{ display: 'flex', gap: '8px', justifyContent: 'center', margin: '0' }}>
                <Save size={18} /> Update Profile
              </button>
            </form>
          </div>

          {/* Change Password Card */}
          <div className="book-appointment-card" style={{ maxWidth: '100%', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', color: '#0f172a' }}>Change Password</h3>
            <form className="appointment-form" style={{ gap: '1.25rem' }} onSubmit={handlePasswordUpdate}>
              
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Current Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input type="password" placeholder="Enter current password" value={passwords.currentPassword} onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})} required />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>New Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input type="password" placeholder="Enter new password" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} required minLength={6} />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label>Confirm New Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input type="password" placeholder="Confirm new password" value={passwords.confirmPassword} onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})} required minLength={6} />
                </div>
              </div>

              <button type="submit" className="btn btn-purple form-submit-btn" style={{ display: 'flex', gap: '8px', justifyContent: 'center', margin: '0' }}>
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
