import React, { useState, useEffect, useContext } from 'react';
import { UserPlus, Users, Calendar, Building, Clock, CalendarX, SquarePlus } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchAppointments();
  }, [user]);

  const fetchAppointments = async () => {
     try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await api.get('/admin/stats', config);
        setStats(data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load dashboard metrics');
        setLoading(false);
      }
  }

  useEffect(() => {
     if (user) fetchAppointments();
  }, [user])

  return (
    <div className="dashboard-layout">
      <AdminSidebar activeId="dashboard" />

      {/* Main Content */}
      <main className="dashboard-content" style={{ backgroundColor: '#f8fafc', padding: '2rem' }}>
        <header className="dashboard-welcome" style={{ marginBottom: '2rem' }}>
          <h1 className="welcome-title text-slate-800 font-bold" style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Admin Dashboard</h1>
          <p className="welcome-subtitle text-slate-500" style={{ fontSize: '1rem' }}>Welcome back! Here's what's happening today.</p>
        </header>

        {/* Stats Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading dashboard data...</div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
               
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                 <div>
                   <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Total Doctors</p>
                   <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1e293b' }}>{stats.totalDoctors}</h3>
                 </div>
                 <div className="bg-blue-100" style={{ width: '3rem', height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.5rem' }}>
                   <UserPlus size={20} className="text-blue-500" />
                 </div>
               </div>

               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                 <div>
                   <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Total Patients</p>
                   <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1e293b' }}>{stats.totalPatients}</h3>
                 </div>
                 <div className="bg-green-100" style={{ width: '3rem', height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.5rem' }}>
                   <Users size={20} className="text-green-500" />
                 </div>
               </div>

               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                 <div>
                   <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Appointments</p>
                   <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1e293b' }}>{stats.totalAppointments}</h3>
                 </div>
                 <div className="bg-purple-100" style={{ width: '3rem', height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.5rem' }}>
                   <Calendar size={20} className="text-purple-500" />
                 </div>
               </div>

               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                 <div>
                   <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Departments</p>
                   <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1e293b' }}>{Object.keys(stats.departments).length}</h3>
                 </div>
                 <div className="bg-orange-100" style={{ width: '3rem', height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.5rem' }}>
                   <Building size={20} className="text-orange-500" />
                 </div>
               </div>

            </div>

        {/* Approvals & Appointments Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Pending Approvals */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={20} color="#f59e0b" />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1e293b' }}>Pending Approvals</h3>
              </div>
              <span style={{ backgroundColor: '#fef3c7', color: '#d97706', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.25rem 0.5rem', borderRadius: '9999px' }}>{stats.pendingAppointments.length}</span>
            </div>

            {stats.pendingAppointments.length === 0 ? (
               <p style={{ color: '#94a3b8', fontSize: '0.875rem', textAlign: 'center', padding: '2rem 0' }}>No pending approvals!</p>
            ) : (
              stats.pendingAppointments.map(apt => (
                <div key={apt._id} style={{ backgroundColor: '#f8fafc', borderRadius: '0.5rem', padding: '1.25rem', border: '1px solid #f1f5f9', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontWeight: 600, color: '#1e293b', marginBottom: '0.25rem' }}>{apt.patient?.name || 'Unknown'}</h4>
                      <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Dr. {apt.doctor?.user?.name} - {apt.department}</p>
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{new Date(apt.appointmentDate).toISOString().split('T')[0]} at {apt.appointmentTime}</p>
                    </div>
                    <span style={{ backgroundColor: '#fef3c7', color: '#d97706', fontSize: '0.65rem', fontWeight: 'bold', padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>PENDING</span>
                  </div>
                </div>
              ))
            )}

            <div style={{ textAlign: 'center' }}>
               <Link to="/admin/appointments" style={{ fontSize: '0.875rem', color: '#3b82f6', fontWeight: 500, textDecoration: 'none' }}>View All Pending &rarr;</Link>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
              <Calendar size={20} color="#3b82f6" />
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1e293b' }}>Upcoming Appointments</h3>
            </div>
            
            {stats.upcomingAppointments.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 0', color: '#cbd5e1' }}>
                <CalendarX size={48} style={{ marginBottom: '1rem', color: '#e2e8f0' }} />
                <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>No upcoming appointments</p>
              </div>
            ) : (
              stats.upcomingAppointments.map(apt => (
                <div key={apt._id} style={{ backgroundColor: '#f8fafc', borderRadius: '0.5rem', padding: '1.25rem', border: '1px solid #f1f5f9', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontWeight: 600, color: '#1e293b', marginBottom: '0.25rem' }}>{apt.patient?.name || 'Unknown'}</h4>
                      <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Dr. {apt.doctor?.user?.name}</p>
                      <p style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 500 }}>{new Date(apt.appointmentDate).toISOString().split('T')[0]} - {apt.appointmentTime}</p>
                    </div>
                    <span style={{ backgroundColor: '#dcfce7', color: '#16a34a', fontSize: '0.65rem', fontWeight: 'bold', padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>UPCOMING</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Departments Overview */}
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
            <SquarePlus size={20} color="#3b82f6" />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1e293b' }}>Departments Overview</h3>
          </div>
          
          {Object.keys(stats.departments).length === 0 ? (
             <p style={{ color: '#64748b', fontSize: '0.875rem', padding: '1rem' }}>No doctors added to any department yet.</p>
          ) : (
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                {Object.keys(stats.departments).map((dept, idx) => (
                  <div key={idx} style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid #f1f5f9' }}>
                     <h4 style={{ fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem', textTransform: 'capitalize' }}>{dept}</h4>
                     
                     {/* Show up to 2 doctors named explicitly */}
                     {stats.departments[dept].slice(0, 2).map(doc => (
                        <p key={doc._id} style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Dr. {doc.user?.name}</p>
                     ))}
                     {stats.departments[dept].length > 2 && (
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic', marginBottom: '0.25rem' }}>+{stats.departments[dept].length - 2} more</p>
                     )}

                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#475569', fontWeight: 500, marginTop: '1rem' }}>
                       <Users size={14} /> {stats.departments[dept].length} Doctor{stats.departments[dept].length > 1 ? 's' : ''}
                     </div>
                  </div>
                ))}
             </div>
          )}
        </div>
        </>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
