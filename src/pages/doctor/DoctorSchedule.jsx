import React from 'react';
import { Calendar, Clock, Info } from 'lucide-react';
import DoctorSidebar from '../../components/DoctorSidebar';

const scheduleData = [
  { day: 'Monday', time: '09:00 - 17:00' },
  { day: 'Wednesday', time: '09:00 - 17:00' },
  { day: 'Friday', time: '09:00 - 17:00' }
];

const DoctorSchedule = () => {
  return (
    <div className="dashboard-layout">
      <DoctorSidebar activeId="schedule" />

      {/* Main Content */}
      <main className="dashboard-content">
        <header className="dashboard-welcome" style={{ marginBottom: '1.5rem' }}>
          <h1 className="welcome-title text-slate-800 font-bold" style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>My Schedule</h1>
          <p className="welcome-subtitle text-slate-500" style={{ fontSize: '1rem' }}>Your weekly availability schedule</p>
        </header>

        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '2rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {scheduleData.map((item, index) => (
              <div key={index} style={{ backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '0.5rem', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Calendar size={20} color="#16a34a" />
                  <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '1.125rem' }}>{item.day}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                  <Clock size={16} />
                  <span style={{ fontSize: '0.875rem' }}>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.5rem', padding: '1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <Info size={20} color="#3b82f6" style={{ marginTop: '0.125rem', flexShrink: 0 }} />
          <p style={{ color: '#1d4ed8', fontSize: '0.875rem', fontWeight: 500, margin: 0, lineHeight: 1.5 }}>
            Note: Your schedule is managed by the admin. To update your availability, please contact the hospital administration.
          </p>
        </div>

      </main>
    </div>
  );
};

export default DoctorSchedule;
