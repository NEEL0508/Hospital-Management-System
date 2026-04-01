import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Plus, Trash2, User } from 'lucide-react';

const AddDoctorSchedule = () => {
  const navigate = useNavigate();

  const handleDiscard = () => {
    navigate('/admin/doctor-schedule');
  };

  const handleAdd = (e) => {
    e.preventDefault();
    navigate('/admin/doctor-schedule');
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 80px)', padding: '2rem', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '1000px' }}>
        
        {/* Breadcrumbs */}
        <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/doctor-schedule')}>Doctor Schedules</span>
          <span>&rsaquo;</span>
          <span style={{ color: '#1e293b', fontWeight: 600 }}>Add Schedule</span>
        </div>

        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>Add Doctor Schedule</h1>
            <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '600px', lineHeight: 1.5 }}>
              Assign availability blocks and working hours for a newly onboarded doctor.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={handleDiscard}
              type="button"
              style={{ padding: '0.75rem 1.5rem', backgroundColor: '#e2e8f0', color: '#334155', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Discard
            </button>
            <button 
              onClick={handleAdd}
              type="submit"
              form="add-schedule-form"
              style={{ padding: '0.75rem 1.5rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              Add Schedule
            </button>
          </div>
        </div>

        {/* Main Form Layout */}
        <form id="add-schedule-form" onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Doctor Selection */}
          <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <User size={24} color="#2563eb" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Select Doctor</h2>
            </div>
            
            <div style={{ maxWidth: '500px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Doctor Name *</label>
              <select 
                required
                style={{ width: '100%', padding: '1rem', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '0.5rem', color: '#1e293b', fontSize: '1rem', outline: 'none' }}
                defaultValue=""
              >
                <option value="" disabled>Select a doctor</option>
                <option value="1">Dr. Sarah Johnson - Cardiology</option>
                <option value="2">Dr. Michael Chen - Neurology</option>
                <option value="3">Dr. Emily Davis - Pediatrics</option>
                <option value="4">Dr. Robert Brown - Orthopedics</option>
              </select>
            </div>
          </div>

          {/* Schedule Blocks Editor */}
          <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Calendar size={24} color="#2563eb" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Availability Blocks</h2>
              </div>
              <button type="button" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#eff6ff', color: '#2563eb', border: 'none', padding: '0.625rem 1rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}>
                <Plus size={16} /> Add Time Slot
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Header Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '1rem', padding: '0 1rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <div>Day of Week</div>
                <div>Start Time</div>
                <div>End Time</div>
                <div style={{ width: '40px' }}></div>
              </div>

              {/* Block 1 (Empty) */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '1rem', alignItems: 'center', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                <select style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', color: '#1e293b', fontSize: '0.875rem' }} defaultValue="Monday">
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
                <div style={{ position: 'relative' }}>
                  <Clock size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input type="time" defaultValue="09:00" style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', color: '#1e293b', fontSize: '0.875rem' }} />
                </div>
                <div style={{ position: 'relative' }}>
                  <Clock size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input type="time" defaultValue="17:00" style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', color: '#1e293b', fontSize: '0.875rem' }} />
                </div>
                <button type="button" style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Trash2 size={20} />
                </button>
              </div>

            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

export default AddDoctorSchedule;
