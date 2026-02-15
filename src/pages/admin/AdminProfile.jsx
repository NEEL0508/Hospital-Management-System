import React, { useState, useEffect, useContext } from 'react';
import { User, Mail, Phone, Lock, Save, Key } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api';
import { toast } from 'react-toastify';

const AdminProfile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [profileData, setProfileData] = useState({ name: '', email: '', phone: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await api.put('/auth/profile', profileData, config);
      updateUser(data);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) return toast.error('Passwords do not match');
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await api.put('/auth/profile', { currentPassword: passwords.currentPassword, password: passwords.newPassword }, config);
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
  };

  const inputStyle = { width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none', color: '#1e293b' };
  const iconStyle = { position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' };

  return (
    <div className="dashboard-layout">
      <AdminSidebar activeId="profile" />
      <main className="dashboard-content" style={{ backgroundColor: '#f8fafc', padding: '2rem' }}>
        <header className="dashboard-welcome" style={{ marginBottom: '2rem' }}>
          <h1 className="welcome-title" style={{ fontSize: '1.75rem' }}>Admin Profile</h1>
          <p className="welcome-subtitle">Manage your account settings and password</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>

          {/* Profile Information */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1.5rem' }}>Profile Information</h2>
            <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} color="#94a3b8" style={iconStyle} />
                  <input type="text" value={profileData.name} onChange={e => setProfileData({ ...profileData, name: e.target.value })} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="#94a3b8" style={iconStyle} />
                  <input type="email" value={profileData.email} onChange={e => setProfileData({ ...profileData, email: e.target.value })} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Phone</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} color="#94a3b8" style={iconStyle} />
                  <input type="tel" value={profileData.phone} onChange={e => setProfileData({ ...profileData, phone: e.target.value })} style={inputStyle} />
                </div>
              </div>
              <button type="submit" style={{ width: '100%', padding: '0.875rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <Save size={18} /> Update Profile
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1.5rem' }}>Change Password</h2>
            <form onSubmit={handlePasswordUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {['currentPassword', 'newPassword', 'confirmPassword'].map((field, i) => (
                <div key={field}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>
                    {['Current Password', 'New Password', 'Confirm New Password'][i]}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} color="#94a3b8" style={iconStyle} />
                    <input type="password" required minLength={6} placeholder="••••••••"
                      value={passwords[field]} onChange={e => setPasswords({ ...passwords, [field]: e.target.value })}
                      style={inputStyle} />
                  </div>
                </div>
              ))}
              <button type="submit" style={{ width: '100%', padding: '0.875rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <Key size={18} /> Change Password
              </button>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AdminProfile;
