import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, User, BarChart2, Settings, Clock, HelpCircle, ArrowRight } from 'lucide-react';

const EditDepartment = () => {
  const navigate = useNavigate();

  const handleDiscard = () => {
    navigate('/admin/departments');
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    navigate('/admin/departments');
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 80px)', padding: '2rem', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '1200px' }}>
        
        {/* Breadcrumbs */}
        <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/departments')}>Departments</span>
          <span>&rsaquo;</span>
          <span style={{ color: '#1e293b', fontWeight: 600 }}>Edit Department</span>
        </div>

        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>Edit Department</h1>
            <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '600px', lineHeight: 1.5 }}>
              Modify the existing administrative and clinical details for the medical unit. Changes take effect immediately across the hospital directory.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={handleDiscard}
              style={{ padding: '0.75rem 1.5rem', backgroundColor: '#e2e8f0', color: '#334155', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Discard<br/>Changes
            </button>
            <button 
              onClick={handleUpdate}
              style={{ padding: '0.75rem 1.5rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Update<br/>Department
            </button>
          </div>
        </div>

        {/* Main Form Layout */}
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* General Information */}
            <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <Info size={24} color="#2563eb" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>General Information</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Department Name</label>
                  <input 
                    type="text" 
                    defaultValue="Cardiology"
                    style={{ width: '100%', padding: '1rem', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '0.5rem', color: '#1e293b', fontSize: '1rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Head of Department</label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input 
                      type="text" 
                      defaultValue="Dr. Sarah Johnson"
                      style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '0.5rem', color: '#1e293b', fontSize: '1rem', outline: 'none' }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Description & Specialization</label>
                <textarea 
                  defaultValue="Specialized in heart and cardiovascular system. Focus on preventive diagnostics, interventional procedures, and chronic disease management."
                  rows="4"
                  style={{ width: '100%', padding: '1rem', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '0.5rem', color: '#334155', fontSize: '1rem', outline: 'none', resize: 'vertical', lineHeight: 1.5 }}
                />
              </div>
            </div>

            {/* Resources & Staffing */}
            <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <BarChart2 size={24} color="#2563eb" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Resources & Staffing</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr 1fr', gap: '1.5rem', alignItems: 'end' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Total Doctors</label>
                  <input 
                    type="number" 
                    defaultValue="8"
                    style={{ width: '100%', padding: '1rem', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '0.5rem', color: '#1e293b', fontSize: '1.125rem', outline: 'none' }}
                  />
                </div>
                <div style={{ paddingBottom: '1rem', color: '#94a3b8', fontSize: '0.875rem', fontWeight: 500 }}>
                  Assigned
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Bed Capacity</label>
                  <input 
                    type="number" 
                    defaultValue="45"
                    style={{ width: '100%', padding: '1rem', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '0.5rem', color: '#1e293b', fontSize: '1.125rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Operating Theaters</label>
                  <input 
                    type="number" 
                    defaultValue="3"
                    style={{ width: '100%', padding: '1rem', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '0.5rem', color: '#1e293b', fontSize: '1.125rem', outline: 'none' }}
                  />
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default EditDepartment;
