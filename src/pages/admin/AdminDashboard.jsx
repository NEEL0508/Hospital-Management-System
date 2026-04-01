import React from 'react';
import { UserPlus, Users, Calendar, Building, Clock, CalendarX, SquarePlus } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';

const stats = [
  { label: "Total Doctors", value: "3", icon: <UserPlus size={20} className="text-blue-500" />, iconBg: "bg-blue-100" },
  { label: "Total Patients", value: "2", icon: <Users size={20} className="text-green-500" />, iconBg: "bg-green-100" },
  { label: "Appointments", value: "2", icon: <Calendar size={20} className="text-purple-500" />, iconBg: "bg-purple-100" },
  { label: "Departments", value: "4", icon: <Building size={20} className="text-orange-500" />, iconBg: "bg-orange-100" }
];

const AdminDashboard = () => {
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {stats.map((stat, i) => (
             <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
               <div>
                 <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>{stat.label}</p>
                 <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1e293b' }}>{stat.value}</h3>
               </div>
               <div className={stat.iconBg} style={{ width: '3rem', height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.5rem' }}>
                 {stat.icon}
               </div>
             </div>
          ))}
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
              <span style={{ backgroundColor: '#fef3c7', color: '#d97706', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.25rem 0.5rem', borderRadius: '9999px' }}>1</span>
            </div>

            <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.5rem', padding: '1.25rem', border: '1px solid #f1f5f9', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ fontWeight: 600, color: '#1e293b', marginBottom: '0.25rem' }}>Emma Wilson</h4>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Dr. Emily Davis - Pediatrics</p>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>2026-02-06 at 14:00</p>
                </div>
                <span style={{ backgroundColor: '#fef3c7', color: '#d97706', fontSize: '0.65rem', fontWeight: 'bold', padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>PENDING</span>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
               <a href="#" style={{ fontSize: '0.875rem', color: '#3b82f6', fontWeight: 500, textDecoration: 'none' }}>View All Pending &rarr;</a>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
              <Calendar size={20} color="#3b82f6" />
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1e293b' }}>Upcoming Appointments</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 0', color: '#cbd5e1' }}>
              <CalendarX size={48} style={{ marginBottom: '1rem', color: '#e2e8f0' }} />
              <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>No upcoming appointments</p>
            </div>
          </div>
        </div>

        {/* Departments Overview */}
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
            <SquarePlus size={20} color="#3b82f6" />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1e293b' }}>Departments Overview</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
            {/* Dept 1 */}
            <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid #f1f5f9' }}>
               <h4 style={{ fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>Cardiology</h4>
               <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>Dr. Sarah Johnson</p>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#475569', fontWeight: 500 }}>
                 <Users size={14} /> 8 Doctors
               </div>
            </div>
            {/* Dept 2 */}
            <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid #f1f5f9' }}>
               <h4 style={{ fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>Neurology</h4>
               <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>Dr. Michael Chen</p>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#475569', fontWeight: 500 }}>
                 <Users size={14} /> 6 Doctors
               </div>
            </div>
            {/* Dept 3 */}
            <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid #f1f5f9' }}>
               <h4 style={{ fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>Pediatrics</h4>
               <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>Dr. Emily Davis</p>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#475569', fontWeight: 500 }}>
                 <Users size={14} /> 10 Doctors
               </div>
            </div>
            {/* Dept 4 */}
            <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid #f1f5f9' }}>
               <h4 style={{ fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>Orthopedics</h4>
               <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>Dr. Robert Brown</p>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#475569', fontWeight: 500 }}>
                 <Users size={14} /> 7 Doctors
               </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;
