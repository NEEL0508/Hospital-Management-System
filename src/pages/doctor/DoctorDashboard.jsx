import React from 'react';
import { Calendar, Clock, Users, CheckCircle } from 'lucide-react';
import DoctorSidebar from '../../components/DoctorSidebar';

const stats = [
  { label: "TOTAL APPOINTMENTS", value: "1", icon: <Calendar size={20} className="text-blue-500" />, iconBg: "bg-blue-100" },
  { label: "TODAY'S APPOINTMENTS", value: "0", icon: <Clock size={20} className="text-green-500" />, iconBg: "bg-green-100" },
  { label: "PENDING", value: "0", icon: <Users size={20} className="text-orange-500" />, iconBg: "bg-orange-100" },
  { label: "COMPLETED", value: "0", icon: <CheckCircle size={20} className="text-slate-600" />, iconBg: "bg-slate-200" }
];

const DoctorDashboard = () => {
  return (
    <div className="dashboard-layout">
      <DoctorSidebar activeId="dashboard" />

      {/* Main Content */}
      <main className="dashboard-content">
        <header className="dashboard-welcome">
          <h1 className="welcome-title text-slate-800 font-bold" style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Welcome, Dr. Sarah Johnson</h1>
          <p className="welcome-subtitle text-slate-500" style={{ fontSize: '1rem' }}>Cardiology - Cardiology</p>
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
              <a href="#" className="view-all-link" style={{ fontSize: '0.875rem', color: '#3b82f6', fontWeight: '500' }}>View All &rarr;</a>
            </div>
            <div className="info-card-empty" style={{ padding: '3rem 0', textAlign: 'center', color: '#94a3b8' }}>
              <p style={{ fontSize: '1rem' }}>No upcoming appointments</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
