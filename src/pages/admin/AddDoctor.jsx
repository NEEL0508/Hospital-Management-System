import React from 'react';
import { useNavigate } from 'react-router-dom';

const AddDoctor = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/admin/manage-doctors');
  };

  const handleAddDoctor = (e) => {
    e.preventDefault();
    // Simulate adding doctor
    navigate('/admin/manage-doctors');
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
              <input 
                type="text" 
                required
                style={{ width: '100%', padding: '0.625rem 1rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', outline: 'none', color: '#1e293b' }}
              />
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#475569', marginBottom: '0.5rem' }}>Email *</label>
              <input 
                type="email" 
                required
                style={{ width: '100%', padding: '0.625rem 1rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', outline: 'none', color: '#1e293b' }}
              />
            </div>

            {/* Phone */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#475569', marginBottom: '0.5rem' }}>Phone *</label>
              <input 
                type="tel" 
                required
                style={{ width: '100%', padding: '0.625rem 1rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', outline: 'none', color: '#1e293b' }}
              />
            </div>

            {/* Specialization */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#475569', marginBottom: '0.5rem' }}>Specialization *</label>
              <input 
                type="text" 
                required
                style={{ width: '100%', padding: '0.625rem 1rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', outline: 'none', color: '#1e293b' }}
              />
            </div>

            {/* Department */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#475569', marginBottom: '0.5rem' }}>Department *</label>
              <input 
                type="text" 
                required
                style={{ width: '100%', padding: '0.625rem 1rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', outline: 'none', color: '#1e293b' }}
              />
            </div>

            {/* Experience */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#475569', marginBottom: '0.5rem' }}>Experience (years) *</label>
              <input 
                type="number" 
                required
                style={{ width: '100%', padding: '0.625rem 1rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', outline: 'none', color: '#1e293b' }}
              />
            </div>

            {/* Qualification - Full width */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#475569', marginBottom: '0.5rem' }}>Qualification *</label>
              <input 
                type="text" 
                required
                style={{ width: '100%', padding: '0.625rem 1rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', outline: 'none', color: '#1e293b' }}
              />
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
