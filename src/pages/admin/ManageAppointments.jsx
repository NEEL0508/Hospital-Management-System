import React, { useState, useEffect, useContext } from 'react';
import { Search, ChevronDown, CheckCircle, XCircle } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const ManageAppointments = () => {
  const { user } = useContext(AuthContext);
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await api.get('/appointments', config);
      setAppointmentsData(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load appointments');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchAppointments();
  }, [user]);

  const handleStatusUpdate = async (id, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await api.put(`/appointments/${id}/status`, { status }, config);
      toast.success(`Appointment ${status.toLowerCase()} successfully`);
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="dashboard-layout">
      <AdminSidebar activeId="appointments" />

      {/* Main Content */}
      <main className="dashboard-content" style={{ backgroundColor: '#f8fafc', padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <header className="dashboard-welcome">
            <h1 className="welcome-title text-slate-800 font-bold" style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Manage Appointments</h1>
            <p className="welcome-subtitle text-slate-500" style={{ fontSize: '1rem' }}>Approve or cancel appointment requests</p>
          </header>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          {/* Search Bar & Filter */}
          <div style={{ padding: '1.25rem', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '1rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type="text" 
                placeholder="Search by patient or doctor name..." 
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', outline: 'none', color: '#1e293b' }}
              />
            </div>
            <div style={{ position: 'relative', width: '200px' }}>
              <select 
                style={{ width: '100%', padding: '0.75rem 2.5rem 0.75rem 1rem', borderRadius: '0.5rem', border: 'none', backgroundColor: '#f8fafc', outline: 'none', color: '#1e293b', appearance: 'none', cursor: 'pointer' }}
                defaultValue="all"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <ChevronDown size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '1.25rem' }}>Patient</th>
                  <th style={{ padding: '1.25rem' }}>Doctor</th>
                  <th style={{ padding: '1.25rem' }}>Department</th>
                  <th style={{ padding: '1.25rem' }}>Date & Time</th>
                  <th style={{ padding: '1.25rem' }}>Status</th>
                  <th style={{ padding: '1.25rem', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading appointments...</td></tr>
                ) : appointmentsData.length === 0 ? (
                  <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No appointments found.</td></tr>
                ) : appointmentsData.map((apt, i) => (
                  <tr key={apt._id} style={{ borderBottom: i === appointmentsData.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1.5rem 1.25rem' }}>
                      <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '0.125rem' }}>{apt.patient?.name || 'Unknown'}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{apt.reasonForVisit}</div>
                    </td>
                    <td style={{ padding: '1.5rem 1.25rem', color: '#475569', fontSize: '0.875rem' }}>
                      Dr. {apt.doctor?.user?.name || 'Unknown'}
                    </td>
                    <td style={{ padding: '1.5rem 1.25rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.75rem', borderRadius: '9999px', backgroundColor: '#eff6ff', color: '#3b82f6', display: 'inline-block' }}>
                        {apt.department}
                      </span>
                    </td>
                    <td style={{ padding: '1.5rem 1.25rem' }}>
                      <div style={{ color: '#475569', fontSize: '0.875rem' }}>
                        {new Date(apt.appointmentDate).toLocaleDateString()}<br/>
                        {apt.appointmentTime}
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem 1.25rem' }}>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: 600, 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '9999px', 
                        backgroundColor: apt.status === 'Approved' ? '#dcfce7' : apt.status === 'Cancelled' ? '#fee2e2' : '#fef9c3', 
                        color: apt.status === 'Approved' ? '#16a34a' : apt.status === 'Cancelled' ? '#991b1b' : '#ca8a04', 
                        display: 'inline-block',
                        textTransform: 'capitalize'
                      }}>
                        {apt.status}
                      </span>
                    </td>
                    <td style={{ padding: '1.5rem 1.25rem' }}>
                      {apt.status === 'Pending' && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                          <button onClick={() => handleStatusUpdate(apt._id, 'Approved')} style={{ background: 'none', border: '1px solid #bbf7d0', borderRadius: '50%', padding: '0.25rem', color: '#22c55e', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CheckCircle size={16} />
                          </button>
                          <button onClick={() => handleStatusUpdate(apt._id, 'Cancelled')} style={{ background: 'none', border: '1px solid #fecaca', borderRadius: '50%', padding: '0.25rem', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <XCircle size={16} />
                          </button>
                        </div>
                      )}
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

export default ManageAppointments;
