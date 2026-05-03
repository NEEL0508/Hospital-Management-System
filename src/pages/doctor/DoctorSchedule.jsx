import React, { useState, useEffect, useContext } from 'react';
import { Calendar, Clock, Plus, Trash2, Save, Loader2, Eye } from 'lucide-react';
import api from '../../api';
import { AuthContext } from '../../context/AuthContext';
import DoctorSidebar from '../../components/DoctorSidebar';
import { toast } from 'react-toastify';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DoctorSchedule = () => {
  const { user } = useContext(AuthContext);
  const [doctorId, setDoctorId] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSlot, setNewSlot] = useState({ day: 'Monday', startTime: '09:00', endTime: '17:00' });

  // Date-specific slot view
  const [viewDate, setViewDate] = useState('');
  const [dateSlots, setDateSlots] = useState([]);
  const [dateSlotsLoading, setDateSlotsLoading] = useState(false);
  const [dateOnLeave, setDateOnLeave] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await api.get('/doctors/me', config);
        setAvailability(data.availability || []);
        setDoctorId(data._id);
      } catch {
        toast.error('Failed to load schedule');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchProfile();
  }, [user]);

  // Fetch slots for selected date
  useEffect(() => {
    if (!viewDate || !doctorId) { setDateSlots([]); return; }
    const fetchDateSlots = async () => {
      setDateSlotsLoading(true);
      setDateOnLeave(false);
      try {
        const { data } = await api.get(`/appointments/slots/${doctorId}/${viewDate}`);
        if (data.onLeave) { setDateOnLeave(true); setDateSlots([]); }
        else setDateSlots(data.slots || []);
      } catch {
        setDateSlots([]);
      } finally {
        setDateSlotsLoading(false);
      }
    };
    fetchDateSlots();
  }, [viewDate, doctorId]);

  const handleAddSlot = () => {
    if (newSlot.startTime >= newSlot.endTime) { toast.error('End time must be after start time'); return; }
    const isDuplicate = availability.some(s => s.day === newSlot.day && s.startTime === newSlot.startTime && s.endTime === newSlot.endTime);
    if (isDuplicate) { toast.warning('This slot already exists'); return; }
    setAvailability([...availability, { ...newSlot }]);
    toast.info(`${newSlot.day} slot added — click Save to apply`);
  };

  const handleRemoveSlot = (index) => setAvailability(availability.filter((_, i) => i !== index));

  const handleSaveSchedule = async () => {
    try {
      setSaving(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await api.put('/doctors/availability', { availability }, config);
      toast.success('Schedule saved successfully!');
    } catch {
      toast.error('Failed to save schedule');
    } finally {
      setSaving(false);
    }
  };

  // Group availability by day for display
  const byDay = {};
  DAYS.forEach(d => { byDay[d] = availability.filter(s => s.day === d); });

  return (
    <div className="dashboard-layout">
      <DoctorSidebar activeId="schedule" />
      <main className="dashboard-content" style={{ backgroundColor: '#f8fafc', padding: '2rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.25rem' }}>My Schedule</h1>
            <p style={{ color: '#64748b' }}>Manage your weekly availability and view daily slot bookings</p>
          </div>
          <button onClick={handleSaveSchedule} disabled={saving || loading}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', backgroundColor: '#2563eb', color: 'white', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer' }}>
            {saving ? <Loader2 size={18} /> : <Save size={18} />}
            {saving ? 'Saving...' : 'Save Schedule'}
          </button>
        </div>

        {/* Add Slot */}
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} color="#2563eb" /> Add Availability Slot
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', alignItems: 'flex-end' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Day</label>
              <select value={newSlot.day} onChange={e => setNewSlot({ ...newSlot, day: e.target.value })}
                style={{ width: '100%', padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', outline: 'none', color: '#1e293b' }}>
                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Start Time</label>
              <input type="time" value={newSlot.startTime} onChange={e => setNewSlot({ ...newSlot, startTime: e.target.value })}
                style={{ width: '100%', padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>End Time</label>
              <input type="time" value={newSlot.endTime} onChange={e => setNewSlot({ ...newSlot, endTime: e.target.value })}
                style={{ width: '100%', padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', outline: 'none' }} />
            </div>
            <button onClick={handleAddSlot}
              style={{ padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #2563eb', backgroundColor: '#eff6ff', color: '#2563eb', fontWeight: 700, cursor: 'pointer' }}>
              + Add Slot
            </button>
          </div>
        </div>

        {/* Weekly Grid */}
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginBottom: '1.25rem' }}>Weekly Availability</h3>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.75rem' }}>
              {DAYS.map(day => {
                const slots = byDay[day];
                const hasSlots = slots.length > 0;
                return (
                  <div key={day} style={{ borderRadius: '0.5rem', border: `1px solid ${hasSlots ? '#86efac' : '#e2e8f0'}`, backgroundColor: hasSlots ? '#f0fdf4' : '#f8fafc', padding: '0.75rem', minHeight: '100px' }}>
                    <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', fontWeight: 700, color: hasSlots ? '#166534' : '#94a3b8', textAlign: 'center' }}>{day.slice(0, 3)}</p>
                    {hasSlots ? slots.map((s, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', borderRadius: '0.25rem', padding: '0.3rem 0.4rem', marginBottom: '0.3rem', border: '1px solid #bbf7d0' }}>
                        <span style={{ fontSize: '0.65rem', color: '#166534', fontWeight: 600 }}>{s.startTime}–{s.endTime}</span>
                        <button onClick={() => handleRemoveSlot(availability.indexOf(s))}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0', lineHeight: 1 }}>
                          <Trash2 size={11} />
                        </button>
                      </div>
                    )) : (
                      <p style={{ margin: 0, fontSize: '0.65rem', color: '#cbd5e1', textAlign: 'center', marginTop: '1rem' }}>Off</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Date-specific Slot View */}
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Eye size={18} color="#0f766e" /> View Slot Bookings for a Date
          </h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <input type="date" value={viewDate} min={new Date().toISOString().split('T')[0]}
              onChange={e => setViewDate(e.target.value)}
              style={{ padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', outline: 'none', color: '#1e293b' }} />
            {viewDate && (
              <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                {new Date(viewDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            )}
          </div>

          {viewDate && (
            dateSlotsLoading ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b' }}>Loading slots...</div>
            ) : dateOnLeave ? (
              <div style={{ padding: '1rem', backgroundColor: '#fee2e2', borderRadius: '0.5rem', color: '#991b1b', fontWeight: 600 }}>
                🏖️ You are on leave on this date.
              </div>
            ) : dateSlots.length === 0 ? (
              <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', color: '#94a3b8', textAlign: 'center' }}>
                No schedule set for this day.
              </div>
            ) : (
              <>
                {/* Legend */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.875rem', flexWrap: 'wrap' }}>
                  {[
                    { bg: 'white', border: '#e2e8f0', label: 'Available' },
                    { bg: '#fee2e2', border: '#fca5a5', label: 'Booked' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#64748b' }}>
                      <div style={{ width: '14px', height: '14px', borderRadius: '3px', backgroundColor: item.bg, border: `1px solid ${item.border}` }} />
                      {item.label}
                    </div>
                  ))}
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {dateSlots.filter(s => s.status === 'booked').length} booked / {dateSlots.filter(s => s.status === 'available').length} available
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '0.5rem' }}>
                  {dateSlots.map((slot, i) => (
                    <div key={i} style={{
                      padding: '0.625rem 0.25rem',
                      borderRadius: '0.5rem',
                      border: `1.5px solid ${slot.status === 'booked' ? '#fca5a5' : '#e2e8f0'}`,
                      backgroundColor: slot.status === 'booked' ? '#fee2e2' : 'white',
                      textAlign: 'center',
                    }}>
                      <Clock size={12} style={{ display: 'block', margin: '0 auto 2px', color: slot.status === 'booked' ? '#dc2626' : '#94a3b8' }} />
                      <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: slot.status === 'booked' ? '#991b1b' : '#1e293b' }}>{slot.time}</p>
                      <p style={{ margin: '2px 0 0', fontSize: '0.6rem', color: slot.status === 'booked' ? '#ef4444' : '#94a3b8' }}>
                        {slot.status === 'booked' ? 'Booked' : 'Free'}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )
          )}
        </div>

      </main>
    </div>
  );
};

export default DoctorSchedule;
