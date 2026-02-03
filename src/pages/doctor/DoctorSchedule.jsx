import React, { useState, useEffect, useContext } from 'react';
import { Calendar, Clock, Plus, Trash2, Save, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import api from '../../api';
import { AuthContext } from '../../context/AuthContext';
import DoctorSidebar from '../../components/DoctorSidebar';
import { toast } from 'react-toastify';

const DoctorSchedule = () => {
  const { user } = useContext(AuthContext);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form State for new slot
  const [newSlot, setNewSlot] = useState({
    day: 'Monday',
    startTime: '09:00',
    endTime: '17:00'
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await api.get('/doctors/me', config);
        setAvailability(data.availability || []);
      } catch (error) {
        toast.error('Failed to load schedule');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProfile();
  }, [user]);

  const handleAddSlot = () => {
    // Basic validation
    if (newSlot.startTime >= newSlot.endTime) {
      toast.error('End time must be after start time');
      return;
    }
    
    // Check for duplicates
    const isDuplicate = availability.some(slot => 
      slot.day === newSlot.day && 
      slot.startTime === newSlot.startTime && 
      slot.endTime === newSlot.endTime
    );
    
    if (isDuplicate) {
      toast.warning('This slot already exists');
      return;
    }
    
    setAvailability([...availability, newSlot]);
    toast.info(`${newSlot.day} slot added to temporary list`);
  };

  const handleRemoveSlot = (index) => {
    const updated = availability.filter((_, i) => i !== index);
    setAvailability(updated);
  };

  const handleSaveSchedule = async () => {
    try {
      setSaving(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await api.put('/doctors/availability', { availability }, config);
      toast.success('Schedule saved successfully!');
    } catch (error) {
      toast.error('Failed to save schedule');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <DoctorSidebar activeId="schedule" />

      <main className="dashboard-content">
        <header className="dashboard-welcome" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="welcome-title text-slate-800 font-bold" style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>My Schedule</h1>
            <p className="welcome-subtitle text-slate-500" style={{ fontSize: '1rem' }}>Manage your weekly availability slots</p>
          </div>
          <button 
            className="btn btn-primary" 
            onClick={handleSaveSchedule}
            disabled={saving || loading}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '0.5rem' }}
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </header>

        {/* Add New Slot Section */}
        <section style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={20} className="text-primary" /> Add New Availability Slot
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', alignItems: 'flex-end' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#64748b' }}>Select Day</label>
              <select 
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontWeight: 500 }}
                value={newSlot.day}
                onChange={(e) => setNewSlot({...newSlot, day: e.target.value})}
              >
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#64748b' }}>Start Time</label>
              <input 
                type="time" 
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc' }}
                value={newSlot.startTime}
                onChange={(e) => setNewSlot({...newSlot, startTime: e.target.value})}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#64748b' }}>End Time</label>
              <input 
                type="time" 
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc' }}
                value={newSlot.endTime}
                onChange={(e) => setNewSlot({...newSlot, endTime: e.target.value})}
              />
            </div>
            <button 
              className="btn btn-outline" 
              onClick={handleAddSlot}
              style={{ padding: '0.8rem', fontWeight: 700, color: 'var(--primary)', borderColor: 'var(--primary)', height: '45px' }}
            >
              Add to List
            </button>
          </div>
        </section>

        {/* Current Schedule Grid */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#1e293b' }}>Weekly Overview</h3>
          {loading ? (
            <div className="text-center py-12">
              <Loader2 size={40} className="animate-spin text-primary mx-auto mb-4" />
              <p className="text-slate-500">Loading your profile...</p>
            </div>
          ) : availability.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {availability.map((item, index) => (
                <div key={index} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.5rem', position: 'relative', transition: 'all 0.2s' }}>
                  <button 
                    onClick={() => handleRemoveSlot(index)}
                    style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#ef4444', transition: 'opacity 0.2s', padding: '0.4rem', borderRadius: '6px', backgroundColor: '#fef2f2' }}
                    className="hover:opacity-80"
                    title="Remove slot"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                    <div style={{ padding: '0.5rem', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
                      <Calendar size={20} className="text-green-600" />
                    </div>
                    <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>{item.day}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#64748b' }}>
                    <Clock size={16} className="text-slate-400" />
                    <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{item.startTime} - {item.endTime}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '4rem 2rem', textAlign: 'center' }}>
              <div style={{ backgroundColor: '#f8fafc', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <Calendar size={32} className="text-slate-300" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#475569', marginBottom: '0.75rem' }}>No Schedule Found</h3>
              <p style={{ color: '#64748b', maxWidth: '300px', margin: '0 auto' }}>You haven't set any availability slots yet. Use the form above to add your working hours.</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default DoctorSchedule;
