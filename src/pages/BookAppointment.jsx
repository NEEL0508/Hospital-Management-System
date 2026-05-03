import React, { useState, useEffect, useContext } from 'react';
import { FileText, Info, Clock, Calendar, CheckCircle, XCircle, User } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const BookAppointment = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDoctorData, setSelectedDoctorData] = useState(null);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [onLeave, setOnLeave] = useState(false);
  const [noSchedule, setNoSchedule] = useState(false);

  const [formData, setFormData] = useState({
    department: location.state?.department || '',
    doctor: location.state?.doctorId || '',
    appointmentDate: '',
    appointmentTime: '',
    reasonForVisit: '',
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await api.get('/doctors');
        setDoctors(data);
        const uniqueDepts = [...new Set(data.map(d => d.specialization).filter(Boolean))];
        setDepartments(uniqueDepts);
        // If pre-selected doctor from FindDoctors
        if (location.state?.doctorId) {
          const doc = data.find(d => d._id === location.state.doctorId);
          if (doc) setSelectedDoctorData(doc);
        }
      } catch {
        toast.error('Failed to load doctors');
      }
    };
    fetchDoctors();
  }, []);

  // When doctor changes
  useEffect(() => {
    if (!formData.doctor) { setSelectedDoctorData(null); setSlots([]); return; }
    const doc = doctors.find(d => d._id === formData.doctor);
    setSelectedDoctorData(doc || null);
    setFormData(prev => ({ ...prev, appointmentDate: '', appointmentTime: '' }));
    setSlots([]);
  }, [formData.doctor, doctors]);

  // When date changes — fetch slots from new schedule API
  useEffect(() => {
    if (!formData.appointmentDate || !formData.doctor) { setSlots([]); return; }
    const fetchSlots = async () => {
      setSlotsLoading(true);
      setOnLeave(false);
      setNoSchedule(false);
      setFormData(prev => ({ ...prev, appointmentTime: '' }));
      try {
        // Use new schedule-based slot API (falls back to weekly availability)
        const { data } = await api.get(`/schedules/slots/${formData.doctor}/${formData.appointmentDate}`);
        if (data.onLeave || data.isOff) { setOnLeave(true); setSlots([]); }
        else if (data.noSchedule) { setNoSchedule(true); setSlots([]); }
        else setSlots(data.slots || []);
      } catch {
        setSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    };
    fetchSlots();
  }, [formData.appointmentDate, formData.doctor]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSlotClick = (slot) => {
    if (slot.status === 'booked') return; // can't select booked
    setFormData(prev => ({ ...prev, appointmentTime: slot.time }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to book an appointment'); navigate('/login'); return; }
    if (!formData.appointmentTime) { toast.error('Please select a time slot'); return; }
    if (onLeave) { toast.error('Doctor is on leave on this date'); return; }

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await api.post('/appointments', formData, config);
      toast.success('Appointment booked successfully!');
      navigate('/my-appointments');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    }
  };

  const availableDays = selectedDoctorData
    ? [...new Set((selectedDoctorData.availability || []).map(s => s.day))]
    : [];

  // Slot color logic:
  //  green  = patient's OWN booked slot
  //  red    = booked by someone else
  //  green  = currently selected (available)
  //  white  = available
  const getSlotStyle = (slot) => {
    if (slot.status === 'booked') {
      const isMySlot = user && slot.patientId && slot.patientId === user._id;
      if (isMySlot) {
        return { bg: '#dcfce7', border: '#4ade80', color: '#166534', cursor: 'not-allowed', isMySlot: true };
      }
      return { bg: '#fee2e2', border: '#fca5a5', color: '#991b1b', cursor: 'not-allowed', isMySlot: false };
    }
    if (formData.appointmentTime === slot.time) {
      return { bg: '#dcfce7', border: '#4ade80', color: '#166534', cursor: 'pointer', isMySlot: false };
    }
    return { bg: 'white', border: '#e2e8f0', color: '#1e293b', cursor: 'pointer', isMySlot: false };
  };

  return (
    <div className="dashboard-layout">
      <Sidebar activeId="book" />
      <main className="dashboard-content" style={{ backgroundColor: '#f8fafc', padding: '2rem' }}>
        <header style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.25rem' }}>Book Appointment</h1>
          <p style={{ color: '#64748b' }}>Schedule a consultation with our doctors</p>
        </header>

        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '2rem', maxWidth: '800px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Department */}
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Department *</label>
              <select name="department" required value={formData.department} onChange={handleChange}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', color: '#1e293b', outline: 'none', backgroundColor: 'white' }}>
                <option value="">Select Department</option>
                {departments.map((dept, i) => <option key={i} value={dept}>{dept}</option>)}
              </select>
            </div>

            {/* Doctor */}
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Select Doctor *</label>
              <select name="doctor" required value={formData.doctor} onChange={handleChange}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', color: '#1e293b', outline: 'none', backgroundColor: 'white' }}>
                <option value="">Select Doctor</option>
                {doctors
                  .filter(doc => !formData.department || doc.specialization === formData.department)
                  .map(doc => (
                    <option key={doc._id} value={doc._id}>
                      Dr. {doc.user?.name} ({doc.specialization}) — ₹{doc.feesPerConsultation?.toLocaleString('en-IN')}
                    </option>
                  ))}
              </select>
            </div>

            {/* Doctor Schedule Info */}
            {selectedDoctorData && availableDays.length > 0 && (
              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.5rem', padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Info size={15} color="#16a34a" />
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#166534' }}>
                    Dr. {selectedDoctorData.user?.name}'s Weekly Schedule
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.4rem' }}>
                  {DAYS.map(day => {
                    const daySlots = (selectedDoctorData.availability || []).filter(s => s.day === day);
                    const isAvail = daySlots.length > 0;
                    return (
                      <div key={day} style={{ textAlign: 'center', padding: '0.5rem 0.25rem', borderRadius: '0.375rem', backgroundColor: isAvail ? 'white' : '#f1f5f9', border: `1px solid ${isAvail ? '#86efac' : '#e2e8f0'}` }}>
                        <p style={{ margin: '0 0 2px', fontSize: '0.68rem', fontWeight: 700, color: isAvail ? '#166534' : '#94a3b8' }}>{day.slice(0, 3)}</p>
                        {isAvail ? daySlots.map((s, i) => (
                          <p key={i} style={{ margin: 0, fontSize: '0.6rem', color: '#16a34a' }}>{s.startTime}–{s.endTime}</p>
                        )) : <p style={{ margin: 0, fontSize: '0.6rem', color: '#cbd5e1' }}>Off</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Date */}
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Appointment Date *</label>
              <input type="date" name="appointmentDate" required
                min={new Date().toISOString().split('T')[0]}
                value={formData.appointmentDate} onChange={handleChange}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', color: '#1e293b', outline: 'none' }} />
            </div>

            {/* Slot Grid */}
            {formData.appointmentDate && formData.doctor && (
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.75rem' }}>
                  Select Time Slot *
                </label>

                {/* Legend */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.875rem', flexWrap: 'wrap' }}>
                  {[
                    { bg: 'white', border: '#e2e8f0', label: 'Available' },
                    { bg: '#dcfce7', border: '#4ade80', label: 'Selected / Your Booking' },
                    { bg: '#fee2e2', border: '#fca5a5', label: 'Booked by Others' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#64748b' }}>
                      <div style={{ width: '14px', height: '14px', borderRadius: '3px', backgroundColor: item.bg, border: `1px solid ${item.border}` }} />
                      {item.label}
                    </div>
                  ))}
                </div>

                {slotsLoading ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
                    Loading available slots...
                  </div>
                ) : onLeave ? (
                  <div style={{ padding: '1rem', backgroundColor: '#fee2e2', borderRadius: '0.5rem', border: '1px solid #fca5a5', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <XCircle size={18} color="#dc2626" />
                    <p style={{ margin: 0, color: '#991b1b', fontWeight: 600 }}>Doctor is on leave on this date. Please select another date.</p>
                  </div>
                ) : noSchedule ? (
                  <div style={{ padding: '1rem', backgroundColor: '#fef9c3', borderRadius: '0.5rem', border: '1px solid #fde68a' }}>
                    <p style={{ margin: 0, color: '#92400e' }}>⚠️ Doctor has no schedule set for {DAYS[new Date(formData.appointmentDate).getDay()]}. You can still enter a time manually.</p>
                    <input type="time" name="appointmentTime" value={formData.appointmentTime} onChange={handleChange}
                      style={{ marginTop: '0.75rem', padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', outline: 'none', color: '#1e293b' }} />
                  </div>
                ) : slots.length === 0 ? (
                  <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0', textAlign: 'center', color: '#94a3b8' }}>
                    No slots available for this date.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '0.5rem' }}>
                    {slots.map((slot, i) => {
                      const style = getSlotStyle(slot);
                      return (
                        <button key={i} type="button" onClick={() => handleSlotClick(slot)}
                          title={slot.status === 'booked' ? (style.isMySlot ? 'Your booked slot' : 'Booked by another patient') : 'Click to select'}
                          style={{
                            padding: '0.625rem 0.25rem',
                            borderRadius: '0.5rem',
                            border: `1.5px solid ${style.border}`,
                            backgroundColor: style.bg,
                            color: style.color,
                            cursor: style.cursor,
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            textAlign: 'center',
                            transition: 'all 0.15s',
                          }}>
                          <Clock size={12} style={{ display: 'block', margin: '0 auto 2px' }} />
                          {slot.time}
                          {slot.status === 'booked' && style.isMySlot && (
                            <div style={{ fontSize: '0.6rem', color: '#16a34a', marginTop: '1px' }}>✓ Yours</div>
                          )}
                          {slot.status === 'booked' && !style.isMySlot && (
                            <div style={{ fontSize: '0.6rem', color: '#ef4444', marginTop: '1px' }}>Booked</div>
                          )}
                          {formData.appointmentTime === slot.time && slot.status !== 'booked' && (
                            <div style={{ fontSize: '0.6rem', color: '#16a34a', marginTop: '1px' }}>✓ Selected</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {formData.appointmentTime && !onLeave && (
                  <div style={{ marginTop: '0.75rem', padding: '0.625rem 1rem', backgroundColor: '#dcfce7', borderRadius: '0.375rem', border: '1px solid #86efac', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={16} color="#16a34a" />
                    <span style={{ fontSize: '0.875rem', color: '#166534', fontWeight: 600 }}>
                      Selected: {formData.appointmentTime}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Reason */}
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Reason for Visit *</label>
              <div style={{ position: 'relative' }}>
                <FileText size={16} style={{ position: 'absolute', left: '0.875rem', top: '0.875rem', color: '#94a3b8' }} />
                <textarea name="reasonForVisit" required rows="4"
                  placeholder="Describe your symptoms or reason for consultation..."
                  value={formData.reasonForVisit} onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem 0.875rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', color: '#1e293b', outline: 'none', resize: 'vertical', fontSize: '0.875rem' }} />
              </div>
            </div>

            {/* Note */}
            <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.5rem', padding: '0.875rem 1rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <Info size={16} color="#2563eb" style={{ flexShrink: 0, marginTop: '1px' }} />
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#1d4ed8' }}>
                Your appointment request will be reviewed by the hospital staff. You will receive a confirmation once it's approved.
              </p>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => navigate('/dashboard')}
                style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>
                Cancel
              </button>
              <button type="submit"
                style={{ padding: '0.75rem 1.75rem', borderRadius: '0.5rem', border: 'none', backgroundColor: '#2563eb', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default BookAppointment;
