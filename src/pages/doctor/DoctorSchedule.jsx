import React, { useState, useEffect, useContext } from 'react';
import { Calendar, Clock, Plus, Trash2, Save, Loader2, Eye, Coffee, CheckCircle } from 'lucide-react';
import api from '../../api';
import { AuthContext } from '../../context/AuthContext';
import DoctorSidebar from '../../components/DoctorSidebar';
import { toast } from 'react-toastify';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Generate 30-min slots between two HH:MM strings
const genSlots = (start, end) => {
  const slots = [];
  if (!start || !end) return slots;
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let cur = sh * 60 + sm;
  const endMin = eh * 60 + em;
  while (cur < endMin) {
    slots.push(`${String(Math.floor(cur / 60)).padStart(2, '0')}:${String(cur % 60).padStart(2, '0')}`);
    cur += 30;
  }
  return slots;
};

const DoctorSchedule = () => {
  const { user } = useContext(AuthContext);
  const [doctorId, setDoctorId] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // New schedule form
  const [form, setForm] = useState({
    date: '',
    morningStart: '09:00',
    morningEnd: '13:00',
    lunchStart: '13:00',
    lunchEnd: '14:00',
    eveningStart: '14:00',
    eveningEnd: '18:00',
    notes: '',
    isOff: false,
    enableLunch: true,
    enableEvening: true,
  });

  // Preview slots
  const previewSlots = [
    ...genSlots(form.morningStart, form.morningEnd),
    ...(form.enableEvening ? genSlots(form.eveningStart, form.eveningEnd) : []),
  ];

  // View slots for a date
  const [viewDate, setViewDate] = useState('');
  const [viewSlots, setViewSlots] = useState([]);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewOnLeave, setViewOnLeave] = useState(false);
  const [viewLunch, setViewLunch] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const [profileRes, schedulesRes] = await Promise.all([
          api.get('/doctors/me', config),
          api.get('/schedules/my', config),
        ]);
        setDoctorId(profileRes.data._id);
        setSchedules(schedulesRes.data);
      } catch {
        toast.error('Failed to load schedule');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  // Fetch view slots
  useEffect(() => {
    if (!viewDate || !doctorId) { setViewSlots([]); return; }
    const fetch = async () => {
      setViewLoading(true);
      setViewOnLeave(false);
      setViewLunch(null);
      try {
        const { data } = await api.get(`/schedules/slots/${doctorId}/${viewDate}`);
        if (data.onLeave || data.isOff) { setViewOnLeave(true); setViewSlots([]); }
        else { setViewSlots(data.slots || []); setViewLunch(data.lunchBreak || null); }
      } catch { setViewSlots([]); }
      finally { setViewLoading(false); }
    };
    fetch();
  }, [viewDate, doctorId]);

  const handleSave = async () => {
    if (!form.date) { toast.error('Please select a date'); return; }
    if (!form.isOff && !form.morningStart) { toast.error('Please set morning start time'); return; }
    setSaving(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const payload = {
        date: form.date,
        morningStart: form.isOff ? '' : form.morningStart,
        morningEnd: form.isOff ? '' : form.morningEnd,
        lunchStart: (form.isOff || !form.enableLunch) ? '' : form.lunchStart,
        lunchEnd: (form.isOff || !form.enableLunch) ? '' : form.lunchEnd,
        eveningStart: (form.isOff || !form.enableEvening) ? '' : form.eveningStart,
        eveningEnd: (form.isOff || !form.enableEvening) ? '' : form.eveningEnd,
        notes: form.notes,
        isOff: form.isOff,
      };
      const { data } = await api.post('/schedules', payload, config);
      toast.success(`Schedule saved! ${data.slots?.length || 0} slots created.`);
      // Refresh schedules list
      const res = await api.get('/schedules/my', config);
      setSchedules(res.data);
      setForm(prev => ({ ...prev, date: '', notes: '' }));
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to save schedule');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this schedule?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await api.delete(`/schedules/${id}`, config);
      setSchedules(prev => prev.filter(s => s._id !== id));
      toast.success('Schedule deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="dashboard-layout">
      <DoctorSidebar activeId="schedule" />
      <main className="dashboard-content" style={{ backgroundColor: '#f8fafc', padding: '2rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.25rem' }}>My Schedule</h1>
          <p style={{ color: '#64748b' }}>Add date-specific schedules with morning/evening sessions and lunch break. 30-min slots are auto-generated.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>

          {/* ── Left: Add Schedule Form ── */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={18} color="#2563eb" /> Add / Update Schedule
            </h3>

            {/* Date */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Date *</label>
              <input type="date" value={form.date} min={today} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                style={{ width: '100%', padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', outline: 'none', color: '#1e293b' }} />
              {form.date && (
                <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#2563eb', fontWeight: 600 }}>
                  📅 {new Date(form.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              )}
            </div>

            {/* Day Off toggle */}
            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', backgroundColor: form.isOff ? '#fee2e2' : '#f8fafc', borderRadius: '0.5rem', border: `1px solid ${form.isOff ? '#fca5a5' : '#e2e8f0'}` }}>
              <input type="checkbox" id="isOff" checked={form.isOff} onChange={e => setForm(f => ({ ...f, isOff: e.target.checked }))}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
              <label htmlFor="isOff" style={{ fontSize: '0.875rem', fontWeight: 600, color: form.isOff ? '#991b1b' : '#475569', cursor: 'pointer' }}>
                Mark this day as OFF (no appointments)
              </label>
            </div>

            {!form.isOff && (
              <>
                {/* Morning Session */}
                <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '0.5rem', border: '1px solid #bfdbfe' }}>
                  <p style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', fontWeight: 700, color: '#1d4ed8' }}>🌅 Morning Session</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Start</label>
                      <input type="time" value={form.morningStart} onChange={e => setForm(f => ({ ...f, morningStart: e.target.value }))}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #bfdbfe', outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>End</label>
                      <input type="time" value={form.morningEnd} onChange={e => setForm(f => ({ ...f, morningEnd: e.target.value }))}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #bfdbfe', outline: 'none' }} />
                    </div>
                  </div>
                </div>

                {/* Lunch Break */}
                <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#fef9c3', borderRadius: '0.5rem', border: '1px solid #fde68a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <input type="checkbox" id="enableLunch" checked={form.enableLunch} onChange={e => setForm(f => ({ ...f, enableLunch: e.target.checked }))}
                      style={{ width: '14px', height: '14px', cursor: 'pointer' }} />
                    <label htmlFor="enableLunch" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#92400e', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Coffee size={14} /> Lunch Break
                    </label>
                  </div>
                  {form.enableLunch && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Break Start</label>
                        <input type="time" value={form.lunchStart} onChange={e => setForm(f => ({ ...f, lunchStart: e.target.value }))}
                          style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #fde68a', outline: 'none' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Break End</label>
                        <input type="time" value={form.lunchEnd} onChange={e => setForm(f => ({ ...f, lunchEnd: e.target.value }))}
                          style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #fde68a', outline: 'none' }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Evening Session */}
                <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #bbf7d0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <input type="checkbox" id="enableEvening" checked={form.enableEvening} onChange={e => setForm(f => ({ ...f, enableEvening: e.target.checked }))}
                      style={{ width: '14px', height: '14px', cursor: 'pointer' }} />
                    <label htmlFor="enableEvening" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#166534', cursor: 'pointer' }}>🌆 Evening Session</label>
                  </div>
                  {form.enableEvening && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Start</label>
                        <input type="time" value={form.eveningStart} onChange={e => setForm(f => ({ ...f, eveningStart: e.target.value }))}
                          style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #bbf7d0', outline: 'none' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>End</label>
                        <input type="time" value={form.eveningEnd} onChange={e => setForm(f => ({ ...f, eveningEnd: e.target.value }))}
                          style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #bbf7d0', outline: 'none' }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Notes (optional)</label>
                  <input type="text" placeholder="e.g. OPD only, Emergency cases..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    style={{ width: '100%', padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', outline: 'none', color: '#1e293b' }} />
                </div>

                {/* Slot Preview */}
                {previewSlots.length > 0 && (
                  <div style={{ marginBottom: '1rem', padding: '0.875rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                    <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>
                      Preview: {previewSlots.length} slots will be created
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                      {previewSlots.map((s, i) => (
                        <span key={i} style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem', borderRadius: '0.25rem', backgroundColor: 'white', border: '1px solid #e2e8f0', color: '#475569', fontWeight: 600 }}>{s}</span>
                      ))}
                    </div>
                    {form.enableLunch && form.lunchStart && form.lunchEnd && (
                      <p style={{ margin: '0.5rem 0 0', fontSize: '0.72rem', color: '#92400e' }}>
                        ☕ Lunch break: {form.lunchStart} – {form.lunchEnd} (no slots during break)
                      </p>
                    )}
                  </div>
                )}
              </>
            )}

            <button onClick={handleSave} disabled={saving}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '0.5rem', border: 'none', backgroundColor: saving ? '#93c5fd' : '#2563eb', color: 'white', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: '0.9rem' }}>
              {saving ? <Loader2 size={18} /> : <Save size={18} />}
              {saving ? 'Saving...' : 'Save Schedule & Generate Slots'}
            </button>
          </div>

          {/* ── Right: Saved Schedules + Slot Viewer ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Slot Viewer */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Eye size={18} color="#0f766e" /> View Slots for a Date
              </h3>
              <input type="date" value={viewDate} onChange={e => setViewDate(e.target.value)}
                style={{ padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', outline: 'none', color: '#1e293b', marginBottom: '1rem', width: '100%' }} />

              {viewDate && (
                viewLoading ? <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Loading slots...</p>
                : viewOnLeave ? <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', borderRadius: '0.5rem', color: '#991b1b', fontWeight: 600, fontSize: '0.875rem' }}>🏖️ Day off / On leave</div>
                : viewSlots.length === 0 ? <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', color: '#94a3b8', textAlign: 'center', fontSize: '0.875rem' }}>No schedule for this date.</div>
                : (
                  <>
                    {viewLunch && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', padding: '0.5rem 0.75rem', backgroundColor: '#fef9c3', borderRadius: '0.375rem' }}>
                        <Coffee size={14} color="#92400e" />
                        <span style={{ fontSize: '0.75rem', color: '#92400e', fontWeight: 600 }}>Lunch: {viewLunch.start} – {viewLunch.end}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>✓ {viewSlots.filter(s => s.status === 'available').length} Available</span>
                      <span style={{ fontSize: '0.72rem', color: '#dc2626', fontWeight: 600 }}>✗ {viewSlots.filter(s => s.status === 'booked').length} Booked</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.4rem' }}>
                      {viewSlots.map((sl, i) => (
                        <div key={i} style={{ padding: '0.5rem 0.25rem', borderRadius: '0.375rem', textAlign: 'center', backgroundColor: sl.status === 'booked' ? '#fee2e2' : 'white', border: `1px solid ${sl.status === 'booked' ? '#fca5a5' : '#e2e8f0'}` }}>
                          <Clock size={11} style={{ display: 'block', margin: '0 auto 2px', color: sl.status === 'booked' ? '#dc2626' : '#94a3b8' }} />
                          <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: sl.status === 'booked' ? '#991b1b' : '#1e293b' }}>{sl.time}</p>
                          <p style={{ margin: 0, fontSize: '0.58rem', color: sl.status === 'booked' ? '#ef4444' : '#94a3b8' }}>{sl.status === 'booked' ? 'Booked' : 'Free'}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )
              )}
            </div>

            {/* Saved Schedules List */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={18} color="#7c3aed" /> Saved Schedules ({schedules.length})
              </h3>
              {loading ? <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Loading...</p>
                : schedules.length === 0 ? <p style={{ color: '#94a3b8', fontSize: '0.875rem', textAlign: 'center', padding: '1rem' }}>No schedules added yet.</p>
                : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '400px', overflowY: 'auto' }}>
                    {schedules.map(sch => {
                      const morningSlots = genSlots(sch.morningStart, sch.morningEnd);
                      const eveningSlots = genSlots(sch.eveningStart, sch.eveningEnd);
                      const total = morningSlots.length + eveningSlots.length;
                      return (
                        <div key={sch._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', borderRadius: '0.5rem', border: `1px solid ${sch.isOff ? '#fca5a5' : '#e2e8f0'}`, backgroundColor: sch.isOff ? '#fff5f5' : '#fafafa' }}>
                          <div>
                            <p style={{ margin: 0, fontWeight: 700, color: '#1e293b', fontSize: '0.875rem' }}>
                              {new Date(sch.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                            {sch.isOff ? (
                              <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#dc2626', fontWeight: 600 }}>Day Off</p>
                            ) : (
                              <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: '#64748b' }}>
                                {sch.morningStart && `🌅 ${sch.morningStart}–${sch.morningEnd}`}
                                {sch.lunchStart && ` ☕ ${sch.lunchStart}–${sch.lunchEnd}`}
                                {sch.eveningStart && ` 🌆 ${sch.eveningStart}–${sch.eveningEnd}`}
                                {total > 0 && <span style={{ marginLeft: '0.5rem', color: '#16a34a', fontWeight: 600 }}>({total} slots)</span>}
                              </p>
                            )}
                            {sch.notes && <p style={{ margin: '2px 0 0', fontSize: '0.7rem', color: '#94a3b8' }}>{sch.notes}</p>}
                          </div>
                          <button onClick={() => handleDelete(sch._id)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem' }}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorSchedule;
