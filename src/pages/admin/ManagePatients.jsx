import React, { useState, useEffect, useContext } from 'react';
import { Search, Mail, Phone, Eye } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const ManagePatients = () => {
  const { user } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await api.get('/admin/patients', config);
        setPatients(data);
      } catch (error) {
        toast.error('Failed to load patients');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchPatients();
  }, [user]);

  const filtered = patients.filter(pt =>
    pt.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pt.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <AdminSidebar activeId="patients" />

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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                  <th style={{ padding: '1.25rem' }}>Blood Group</th>
                  <th style={{ padding: '1.25rem' }}>Contact</th>
                  <th style={{ padding: '1.25rem' }}>Registration Date</th>
                  <th style={{ padding: '1.25rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading patients...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No patients found.</td></tr>
                ) : filtered.map((pt, i) => (
                  <tr key={pt._id} style={{ borderBottom: i === filtered.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1.5rem 1.25rem' }}>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{pt.name}</div>
                    </td>
                    <td style={{ padding: '1.5rem 1.25rem' }}>
                      {pt.bloodGroup ? (
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: '9999px', backgroundColor: '#fee2e2', color: '#ef4444', display: 'inline-block' }}>
                          {pt.bloodGroup}
                        </span>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>N/A</span>
                      )}
                    </td>
                    <td style={{ padding: '1.5rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.75rem', marginBottom: '0.375rem' }}>
                        <Mail size={12} color="#94a3b8" /> {pt.email}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.75rem' }}>
                        <Phone size={12} color="#94a3b8" /> {pt.phone || 'N/A'}
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem 1.25rem', color: '#475569', fontSize: '0.875rem' }}>
                      {new Date(pt.createdAt).toISOString().split('T')[0]}
                    </td>
                    <td style={{ padding: '1.5rem 1.25rem', textAlign: 'right' }}>
                      <button style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}>
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
