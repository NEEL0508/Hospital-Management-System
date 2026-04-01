import React from 'react';
import { Search, Mail, Phone, Eye } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';

const patientsData = [
  {
    name: "John Smith",
    age: "45",
    gender: "Male",
    bloodGroup: "O+",
    email: "john.smith@email.com",
    phone: "+1-555-1001",
    registrationDate: "2024-01-15"
  },
  {
    name: "Emma Wilson",
    age: "32",
    gender: "Female",
    bloodGroup: "A+",
    email: "emma.wilson@email.com",
    phone: "+1-555-1002",
    registrationDate: "2024-02-20"
  }
];

const ManagePatients = () => {
  return (
    <div className="dashboard-layout">
      <AdminSidebar activeId="patients" />

      {/* Main Content */}
      <main className="dashboard-content" style={{ backgroundColor: '#f8fafc', padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <header className="dashboard-welcome">
            <h1 className="welcome-title text-slate-800 font-bold" style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Manage Patients</h1>
            <p className="welcome-subtitle text-slate-500" style={{ fontSize: '1rem' }}>View and manage patient information</p>
          </header>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          {/* Search Bar */}
          <div style={{ padding: '1.25rem', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type="text" 
                placeholder="Search patients by name or email..." 
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none', color: '#1e293b' }}
              />
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '1.25rem' }}>Patient</th>
                  <th style={{ padding: '1.25rem' }}>Age/Gender</th>
                  <th style={{ padding: '1.25rem' }}>Blood Group</th>
                  <th style={{ padding: '1.25rem' }}>Contact</th>
                  <th style={{ padding: '1.25rem' }}>Registration Date</th>
                  <th style={{ padding: '1.25rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patientsData.map((pt, i) => (
                  <tr key={i} style={{ borderBottom: i === patientsData.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1.5rem 1.25rem' }}>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{pt.name}</div>
                    </td>
                    <td style={{ padding: '1.5rem 1.25rem', color: '#475569', fontSize: '0.875rem' }}>
                      {pt.age} / {pt.gender}
                    </td>
                    <td style={{ padding: '1.5rem 1.25rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: '9999px', backgroundColor: '#fee2e2', color: '#ef4444', display: 'inline-block' }}>
                        {pt.bloodGroup}
                      </span>
                    </td>
                    <td style={{ padding: '1.5rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.75rem', marginBottom: '0.375rem' }}>
                        <Mail size={12} color="#94a3b8" /> {pt.email}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.75rem' }}>
                        <Phone size={12} color="#94a3b8" /> {pt.phone}
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem 1.25rem', color: '#475569', fontSize: '0.875rem' }}>
                      {pt.registrationDate}
                    </td>
                    <td style={{ padding: '1.5rem 1.25rem', textAlign: 'right' }}>
                      <button style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', display: 'inline-flex', justifyContent: 'flex-end', width: '100%' }}>
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </main>
    </div>
  );
};

export default ManagePatients;
