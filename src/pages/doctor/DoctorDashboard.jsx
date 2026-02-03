import React, { useState, useEffect, useContext } from 'react';
import { Calendar, Clock, Users, CheckCircle } from 'lucide-react';
import DoctorSidebar from '../../components/DoctorSidebar';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api';
import { toast } from 'react-toastify';

const DoctorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await api.get('/appointments', config);
        setAppointments(data);
      } catch (error) {
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // Calculate Stats
  const todayDate = new Date().toISOString().split('T')[0];
  
  const totalAppointments = appointments.length;
  const todaysAppointments = appointments.filter(a => a.appointmentDate.split('T')[0] === todayDate).length;
  const pendingAppointments = appointments.filter(a => a.status === 'Pending').length;
  const completedAppointments = appointments.filter(a => a.status === 'Completed').length;

  const stats = [
    { label: "TOTAL APPOINTMENTS", value: totalAppointments, icon: <Calendar size={20} className="text-blue-500" />, iconBg: "bg-blue-100" },
    { label: "TODAY'S APPOINTMENTS", value: todaysAppointments, icon: <Clock size={20} className="text-green-500" />, iconBg: "bg-green-100" },
    { label: "PENDING", value: pendingAppointments, icon: <Users size={20} className="text-orange-500" />, iconBg: "bg-orange-100" },
    { label: "COMPLETED", value: completedAppointments, icon: <CheckCircle size={20} className="text-slate-600" />, iconBg: "bg-slate-200" }
  ];

  const upcomingAppointments = appointments
    .filter(a => a.appointmentDate >= todayDate && (a.status === 'Approved' || a.status === 'Pending'))
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
    .slice(0, 5);

  return (
    <div className="dashboard-layout">
      <DoctorSidebar activeId="dashboard" />

      {/* Main Content */}
      <main className="dashboard-content">
        <header className="dashboard-welcome">
          <h1 className="welcome-title text-slate-800 font-bold" style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Welcome, {user?.name}</h1>
          <p className="welcome-subtitle text-slate-500" style={{ fontSize: '1rem' }}>{user?.specialization || 'General'} Specialist</p>
        </header>

        {/* Stats Grid */}
        <div className="dashboard-stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginTop: '1.5rem' }}>
          {stats.map((stat, i) => (
             <div key={i} className="dashboard-stat-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
               <div className="stat-info">
                 <p className="stat-label-small" style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>{stat.label}</p>
                 <h3 className="stat-value-large" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b' }}>{stat.value}</h3>
               </div>
               <div className={`stat-icon-wrapper ${stat.iconBg}`} style={{ width: '3rem', height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.5rem' }}>
                 {stat.icon}
               </div>
             </div>
          ))}
        </div>

        {/* Info Layout */}
        <div className="dashboard-info-grid" style={{ gridTemplateColumns: 'minmax(0, 1fr)', marginTop: '2rem' }}>
          <div className="info-card" style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div className="info-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1e293b' }}>Upcoming Appointments</h3>
              <a href="/doctor/appointments" className="view-all-link" style={{ fontSize: '0.875rem', color: '#3b82f6', fontWeight: '500' }}>View All &rarr;</a>
            </div>
            
            {loading ? (
              <div className="info-card-empty" style={{ padding: '3rem 0', textAlign: 'center', color: '#94a3b8' }}>
                <p style={{ fontSize: '1rem' }}>Loading appointments...</p>
              </div>
            ) : upcomingAppointments.length > 0 ? (
              <div className="appointments-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {upcomingAppointments.map((app) => (
                  <div key={app._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
                    <div>
                      <h4 style={{ fontWeight: '600', color: '#0f172a', marginBottom: '0.25rem' }}>{app.patient?.name}</h4>
                      <p style={{ fontSize: '0.875rem', color: '#64748b' }}>{app.appointmentDate?.split('T')[0]} at {app.appointmentTime}</p>
                    </div>
                    <div>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '9999px', 
                        fontSize: '0.75rem', 
                        fontWeight: '600',
                        backgroundColor: app.status === 'Approved' ? '#dcfce7' : '#fef3c7',
                        color: app.status === 'Approved' ? '#166534' : '#92400e'
                      }}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="info-card-empty" style={{ padding: '3rem 0', textAlign: 'center', color: '#94a3b8' }}>
                <p style={{ fontSize: '1rem' }}>No upcoming appointments</p>
              </div>
            )}
            
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
