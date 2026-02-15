import React, { useState, useEffect, useContext } from 'react';
import { Plus, Edit2, Trash2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const ManageDepartments = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data } = await api.get('/doctors');
        // Group doctors by specialization
        const deptMap = {};
        data.forEach(doc => {
          const dept = doc.specialization;
          if (!dept) return;
          if (!deptMap[dept]) {
            deptMap[dept] = { name: dept, doctors: [] };
          }
          deptMap[dept].doctors.push(doc);
        });
        setDepartments(Object.values(deptMap));
      } catch (error) {
        toast.error('Failed to load departments');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchDepartments();
  }, [user]);

  return (
    <div className="dashboard-layout">
      <AdminSidebar activeId="departments" />

      <main className="dashboard-content" style={{ backgroundColor: '#f8fafc', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <header className="dashboard-welcome">
            <h1 className="welcome-title text-slate-800 font-bold" style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Manage Departments</h1>
            <p className="welcome-subtitle text-slate-500" style={{ fontSize: '1rem' }}>Organize hospital departments and their information</p>
          </header>
          <button onClick={() => navigate('/admin/add-department')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={18} /> Add Department
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading departments...</div>
        ) : departments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            No departments found. Add doctors with specializations to see departments here.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {departments.map((dept, index) => (
              <div key={index} style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b' }}>{dept.name}</h3>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => toast.info('To edit this department, update the doctor\'s specialization from Manage Doctors.')}
                      style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: 0 }}><Edit2 size={16} /></button>
                  </div>
                </div>

                <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem', flexGrow: 1 }}>
                  Specialized in {dept.name.toLowerCase()} care
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Head Doctor:</span>
                  <span style={{ color: '#1e293b', fontSize: '0.875rem', fontWeight: 600 }}>
                    {dept.doctors[0]?.user?.name ? `Dr. ${dept.doctors[0].user.name}` : 'N/A'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                    <Users size={16} /> Total Doctors:
                  </div>
                  <span style={{ color: '#1e293b', fontSize: '0.875rem', fontWeight: 600 }}>{dept.doctors.length}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageDepartments;
