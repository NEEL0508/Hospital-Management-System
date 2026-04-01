import React from 'react';
import { Search, Plus, Edit2, Trash2, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';

const doctorsData = [
  {
    name: "Dr. Sarah Johnson",
    credentials: "MD, FACC",
    specialization: "Cardiology",
    specializationColor: "text-blue-600",
    specializationBg: "bg-blue-100",
    department: "Cardiology",
    experience: "15 years",
    email: "sarah.johnson@hospital.com",
    phone: "+1-555-0101"
  },
  {
    name: "Dr. Michael Chen",
    credentials: "MD, PhD",
    specialization: "Neurology",
    specializationColor: "text-purple-600",
    specializationBg: "bg-purple-100",
    department: "Neurology",
    experience: "12 years",
    email: "michael.chen@hospital.com",
    phone: "+1-555-0102"
  },
  {
    name: "Dr. Emily Davis",
    credentials: "MD, FAAP",
    specialization: "Pediatrics",
    specializationColor: "text-green-600",
    specializationBg: "bg-green-100",
    department: "Pediatrics",
    experience: "10 years",
    email: "emily.davis@hospital.com",
    phone: "+1-555-0103"
  }
];

const ManageDoctors = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-layout">
      <AdminSidebar activeId="manage-doctors" />

      {/* Main Content */}
      <main className="dashboard-content" style={{ backgroundColor: '#f8fafc', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <header className="dashboard-welcome">
            <h1 className="welcome-title text-slate-800 font-bold" style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Manage Doctors</h1>
            <p className="welcome-subtitle text-slate-500" style={{ fontSize: '1rem' }}>Add, edit, or remove doctors from the system</p>
          </header>
          <button onClick={() => navigate('/admin/add-doctor')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <Plus size={18} /> Add Doctor
          </button>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          {/* Search Bar */}
          <div style={{ padding: '1.25rem', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type="text" 
                placeholder="Search doctors by name, specialization, or department..." 
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none', color: '#1e293b' }}
              />
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '1.25rem' }}>Doctor</th>
                  <th style={{ padding: '1.25rem' }}>Specialization</th>
                  <th style={{ padding: '1.25rem' }}>Department</th>
                  <th style={{ padding: '1.25rem' }}>Experience</th>
                  <th style={{ padding: '1.25rem' }}>Contact</th>
                  <th style={{ padding: '1.25rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctorsData.map((doc, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1.25rem' }}>
                      <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '0.125rem' }}>{doc.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{doc.credentials}</div>
                    </td>
                    <td style={{ padding: '1.25rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.75rem', borderRadius: '9999px', display: 'inline-block' }} className={`${doc.specializationBg} ${doc.specializationColor}`}>
                        {doc.specialization}
                      </span>
                    </td>
                    <td style={{ padding: '1.25rem', color: '#475569', fontSize: '0.875rem' }}>{doc.department}</td>
                    <td style={{ padding: '1.25rem', color: '#475569', fontSize: '0.875rem' }}>{doc.experience}</td>
                    <td style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                        <Mail size={12} color="#94a3b8" /> {doc.email}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.75rem' }}>
                        <Phone size={12} color="#94a3b8" /> {doc.phone}
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}><Edit2 size={16} /></button>
                        <button style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Pagination */}
          <div style={{ padding: '1.25rem', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
              Showing 1 to 3 of 12 doctors
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button style={{ padding: '0.375rem 0.75rem', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '0.375rem', color: '#1e293b', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}>Previous</button>
              <button style={{ padding: '0.375rem 0.75rem', backgroundColor: '#2563eb', border: '1px solid #2563eb', borderRadius: '0.375rem', color: 'white', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>1</button>
              <button style={{ padding: '0.375rem 0.75rem', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '0.375rem', color: '#1e293b', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}>2</button>
              <button style={{ padding: '0.375rem 0.75rem', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '0.375rem', color: '#1e293b', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}>Next</button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default ManageDoctors;
