import React, { useState, useEffect, useContext } from 'react';
import { Search, Plus, Trash2, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { toast } from 'react-toastify';
import AdminSidebar from '../../components/AdminSidebar';
import { AuthContext } from '../../context/AuthContext';

const ManageDoctors = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [doctorsData, setDoctorsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchDoctors = async () => {
    try {
      const { data } = await api.get('/doctors');
      setDoctorsData(data);
    } catch {
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDoctors(); }, []);

  const handleDelete = async (doc) => {
    if (!window.confirm(`Delete Dr. ${doc.user?.name}? This cannot be undone.`)) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await api.delete(`/doctors/${doc._id}`, config);
      toast.success('Doctor removed successfully');
      fetchDoctors();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete doctor');
    }
  };

  const filtered = doctorsData.filter(doc =>
    doc.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    doc.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <AdminSidebar activeId="manage-doctors" />
      <main className="dashboard-content" style={{ backgroundColor: '#f8fafc', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <header className="dashboard-welcome">
            <h1 className="welcome-title text-slate-800 font-bold" style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Manage Doctors</h1>
            <p className="welcome-subtitle text-slate-500">Add or remove doctors from the system</p>
          </header>
          <button onClick={() => navigate('/admin/add-doctor')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={18} /> Add Doctor
          </button>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input type="text" placeholder="Search by name or specialization..."
                value={search} onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none', color: '#1e293b' }} />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  {['Doctor', 'Specialization', 'Experience', 'Contact', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '1.25rem' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No doctors found.</td></tr>
                ) : filtered.map((doc) => (
                  <tr key={doc._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1.25rem' }}>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{doc.user?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{doc.user?.email}</div>
                    </td>
                    <td style={{ padding: '1.25rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.75rem', borderRadius: '9999px', backgroundColor: '#eff6ff', color: '#2563eb' }}>
                        {doc.specialization}
                      </span>
                    </td>
                    <td style={{ padding: '1.25rem', color: '#475569', fontSize: '0.875rem' }}>{doc.experience} yrs</td>
                    <td style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                        <Mail size={12} color="#94a3b8" /> {doc.user?.email}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569', fontSize: '0.75rem' }}>
                        <Phone size={12} color="#94a3b8" /> {doc.user?.phone || 'N/A'}
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem', textAlign: 'right' }}>
                      <button onClick={() => handleDelete(doc)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.875rem' }}>
            Total: {filtered.length} doctor{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManageDoctors;
