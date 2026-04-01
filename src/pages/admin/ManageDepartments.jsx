import React from 'react';
import { Plus, Edit2, Trash2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';

const departmentsData = [
  {
    name: "Cardiology",
    description: "Specialized in heart and cardiovascular system",
    headDoctor: "Dr. Sarah Johnson",
    totalDoctors: 8
  },
  {
    name: "Neurology",
    description: "Specialized in nervous system disorders",
    headDoctor: "Dr. Michael Chen",
    totalDoctors: 6
  },
  {
    name: "Pediatrics",
    description: "Specialized in child healthcare",
    headDoctor: "Dr. Emily Davis",
    totalDoctors: 10
  },
  {
    name: "Orthopedics",
    description: "Specialized in bone and joint care",
    headDoctor: "Dr. Robert Brown",
    totalDoctors: 7
  }
];

const ManageDepartments = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-layout">
      <AdminSidebar activeId="departments" />

      {/* Main Content */}
      <main className="dashboard-content" style={{ backgroundColor: '#f8fafc', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <header className="dashboard-welcome">
            <h1 className="welcome-title text-slate-800 font-bold" style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Manage Departments</h1>
            <p className="welcome-subtitle text-slate-500" style={{ fontSize: '1rem' }}>Organize hospital departments and their information</p>
          </header>
          <button onClick={() => navigate('/admin/add-department')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <Plus size={18} /> Add Department
          </button>
        </div>

        {/* Departments Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {departmentsData.map((dept, index) => (
            <div key={index} style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b' }}>{dept.name}</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => navigate('/admin/edit-department')} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: 0 }}><Edit2 size={16} /></button>
                  <button style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }}><Trash2 size={16} /></button>
                </div>
              </div>
              
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem', flexGrow: 1 }}>{dept.description}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Head Doctor:</span>
                <span style={{ color: '#1e293b', fontSize: '0.875rem', fontWeight: 600 }}>{dept.headDoctor}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                  <Users size={16} /> Total Doctors:
                </div>
                <span style={{ color: '#1e293b', fontSize: '0.875rem', fontWeight: 600 }}>{dept.totalDoctors}</span>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
};

export default ManageDepartments;
