import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const AddDoctor = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', 
    specialization: '', experience: '', feesPerConsultation: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCancel = () => {
    navigate('/admin/manage-doctors');
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      // Step 1: Register User with Role Doctor
      const userRes = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: 'Doctor'
      });

      // Step 2: Create Doctor Profile linked to the User
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await api.post('/doctors', {
        userId: userRes.data._id,
        specialization: formData.specialization,
        experience: Number(formData.experience),
        feesPerConsultation: Number(formData.feesPerConsultation)
      }, config);

      toast.success('Doctor successfully added!');
      navigate('/admin/manage-doctors');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding doctor');
    }
  };

  return (
    <div style={{ backgroundColor: '#e2e8f0', minHeight: 'calc(100vh - 80px - 300px)', padding: '4rem 1rem', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2.5rem', width: '100%', maxWidth: '800px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '2rem' }}>Add New Doctor</h2>
        
        <form onSubmit={handleAddDoctor}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {/* Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#475569', marginBottom: '0.5rem' }}>Name *</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '0.625rem 1rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', outline: 'none', color: '#1e293b' }} />
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#475569', marginBottom: '0.5rem' }}>Email *</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '0.625rem 1rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', outline: 'none', color: '#1e293b' }} />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#475569', marginBottom: '0.5rem' }}>Initial Password *</label>
              <input type="password" name="password" required minLength="6" value={formData.password} onChange={handleChange} style={{ width: '100%', padding: '0.625rem 1rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', outline: 'none', color: '#1e293b' }} />
            </div>

            {/* Phone */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#475569', marginBottom: '0.5rem' }}>Phone *</label>
              <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '0.625rem 1rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', outline: 'none', color: '#1e293b' }} />
            </div>

            {/* Specialization */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#475569', marginBottom: '0.5rem' }}>Specialization *</label>
              <input type="text" name="specialization" required value={formData.specialization} onChange={handleChange} style={{ width: '100%', padding: '0.625rem 1rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', outline: 'none', color: '#1e293b' }} />
            </div>

            {/* Experience */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#475569', marginBottom: '0.5rem' }}>Experience (years) *</label>
              <input type="number" name="experience" required value={formData.experience} onChange={handleChange} style={{ width: '100%', padding: '0.625rem 1rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', outline: 'none', color: '#1e293b' }} />
            </div>

            {/* Fees */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#475569', marginBottom: '0.5rem' }}>Fees Per Consultation ($) *</label>
              <input type="number" name="feesPerConsultation" required value={formData.feesPerConsultation} onChange={handleChange} style={{ width: '100%', padding: '0.625rem 1rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', outline: 'none', color: '#1e293b' }} />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '3rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
            <button 
              type="button"
              onClick={handleCancel}
              style={{ padding: '0.625rem 1.5rem', backgroundColor: 'white', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '0.375rem', fontWeight: 500, cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button 
              type="submit"
              style={{ padding: '0.625rem 1.5rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '0.375rem', fontWeight: 500, cursor: 'pointer' }}
            >
              Add Doctor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctor;
