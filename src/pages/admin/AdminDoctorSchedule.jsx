import React from 'react';
import { Calendar, Clock, Edit2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';

const schedulesData = [
  {
    doctorName: "Dr. Sarah Johnson",
    specialization: "Cardiology - Cardiology",
    schedules: [
      { day: "Monday", time: "09:00 - 17:00" },
      { day: "Wednesday", time: "09:00 - 17:00" },
      { day: "Friday", time: "09:00 - 17:00" }
    ]
  },
  {
    doctorName: "Dr. Michael Chen",
    specialization: "Neurology - Neurology",
    schedules: [
      { day: "Tuesday", time: "10:00 - 18:00" },
      { day: "Thursday", time: "10:00 - 18:00" }
    ]
  },
  {
    doctorName: "Dr. Emily Davis",
    specialization: "Pediatrics - Pediatrics",
    schedules: [
      { day: "Monday", time: "08:00 - 16:00" },
      { day: "Tuesday", time: "08:00 - 16:00" },
      { day: "Thursday", time: "08:00 - 16:00" }
    ]
  }
];

const AdminDoctorSchedule = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-layout">
      <AdminSidebar activeId="doctor-schedule" />

      {/* Main Content */}
      <main className="dashboard-content" style={{ backgroundColor: '#f8fafc', padding: '2rem' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <header className="dashboard-welcome">
            <h1 className="welcome-title text-slate-800 font-bold" style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Doctor Schedules</h1>
            <p className="welcome-subtitle text-slate-500" style={{ fontSize: '1rem' }}>View availability schedules for all doctors</p>
          </header>
          <button onClick={() => navigate('/admin/add-schedule')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <Plus size={18} /> Add Schedule
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {schedulesData.map((doc, idx) => (
            <div key={idx} style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem 2rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
              
              <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.25rem' }}>{doc.doctorName}</h2>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>{doc.specialization}</p>
                </div>
                <button onClick={() => navigate('/admin/edit-schedule')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: '1px solid #e2e8f0', color: '#334155', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
                  <Edit2 size={14} /> Edit
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {doc.schedules.map((schedule, sIdx) => (
                  <div key={sIdx} style={{ backgroundColor: '#f8fafc', borderRadius: '0.5rem', padding: '1rem', border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      <Calendar size={16} color="#3b82f6" /> {schedule.day}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem' }}>
                      <Clock size={16} color="#94a3b8" /> {schedule.time}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

      </main>
    </div>
  );
};

export default AdminDoctorSchedule;
