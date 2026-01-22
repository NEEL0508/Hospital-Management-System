import React, { useState, useEffect, useContext } from 'react';
import { FileText, Info } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const BookAppointment = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDoctorData, setSelectedDoctorData] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [formData, setFormData] = useState({
    department: '', doctor: '', appointmentDate: '', appointmentTime: '', reasonForVisit: ''
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await api.get('/doctors');
        setDoctors(data);
        const uniqueDepts = [...new Set(data.map(d => d.specialization).filter(Boolean))];
        setDepartments(uniqueDepts);
      } catch {
        toast.error('Failed to load doctors');
      }
    };
    fetchDoctors();
  }, []);

  // When doctor changes, load their availability
  useEffect(() => {
    if (!formData.doctor) {
      setSelectedDoctorData(null);
      setAvailableSlots([]);
      return;
    }
    const doc = doctors.find(d => d._id === formData.doctor);
    setSelectedDoctorData(doc || null);
    setFormData(prev => ({ ...prev, appointmentDate: '', appointmentTime: '' }));
    setAvailableSlots([]);
  }, [formData.doctor]);

  // When date changes, find matching time slots
  useEffect(() => {
    if (!formData.appointmentDate || !selectedDoctorData) {
      setAvailableSlots([]);
      return;
    }
    const dayName = DAYS[new Date(formData.appointmentDate).getDay()];
    const slots = (selectedDoctorData.availability || []).filter(s => s.day === dayName);
    setAvailableSlots(slots);
    setFormData(prev => ({ ...prev, appointmentTime: '' }));
  }, [formData.appointmentDate, selectedDoctorData]);

  // Generate time options from slot range (every 30 min)
  const generateTimeOptions = (startTime, endTime) => {
    const times = [];
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    let current = startH * 60 + startM;
    const end = endH * 60 + endM;
    while (current < end) {
      const h = Math.floor(current / 60).toString().padStart(2, '0');
      const m = (current % 60).toString().padStart(2, '0');
      times.push(`${h}:${m}`);
      current += 30;
    }
    return times;
  };

  const allTimeOptions = availableSlots.flatMap(s => generateTimeOptions(s.startTime, s.endTime));

  // Check if date is available (doctor has schedule that day)
  const isDateAvailable = (dateStr) => {
    if (!selectedDoctorData || !dateStr) return true;
    const dayName = DAYS[new Date(dateStr).getDay()];
    return (selectedDoctorData.availability || []).some(s => s.day === dayName);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to book an appointment');
      navigate('/login');
      return;
    }

    // Check past time on today's date
    const today = new Date().toISOString().split('T')[0];
    if (formData.appointmentDate === today && formData.appointmentTime) {
      const now = new Date();
      const [h, m] = formData.appointmentTime.split(':').map(Number);
      const selected = new Date();
      selected.setHours(h, m, 0, 0);
      if (selected <= now) {
        toast.error('Please select a future time for today\'s appointment.');
        return;
      }
    }

    // Check schedule
    if (selectedDoctorData && formData.appointmentDate) {
      if (!isDateAvailable(formData.appointmentDate)) {
        toast.error('Doctor is not available on this day. Please check their schedule.');
        return;
      }
    }

    // Check leave
    if (formData.doctor && formData.appointmentDate) {
      try {
        const { data } = await api.get(`/leaves/check/${formData.doctor}/${formData.appointmentDate}`);
        if (data.onLeave) {
          toast.error('Doctor is on leave on this date. Please select another date.');
          return;
        }
      } catch {}
    }

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await api.post('/appointments', formData, config);
      toast.success('Appointment booked successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    }
  };

  const availableDays = selectedDoctorData
    ? [...new Set((selectedDoctorData.availability || []).map(s => s.day))]
    : [];

  return (
    <div className="dashboard-layout">
      <Sidebar activeId="book" />
      <main className="dashboard-content">
        <header className="dashboard-welcome">
          <h1 className="welcome-title">Book Appointment</h1>
          <p className="welcome-subtitle">Schedule a consultation with our doctors</p>
        </header>

        <div className="book-appointment-card">
          <form className="appointment-form" onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Department *</label>
              <select className="form-select" name="department" required value={formData.department} onChange={handleChange}>
                <option value="" disabled>Select Department</option>
                {departments.map((dept, i) => (
                  <option key={i} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Select Doctor *</label>
              <select className="form-select" name="doctor" required value={formData.doctor} onChange={handleChange}>
                <option value="" disabled>Select Doctor</option>
                {doctors
                  .filter(doc => !formData.department || doc.specialization === formData.department)
                  .map(doc => (
                    <option key={doc._id} value={doc._id}>
                      Dr. {doc.user?.name} ({doc.specialization}) - ₹{doc.feesPerConsultation}
                    </option>
                  ))}
              </select>
            </div>

            {/* Show doctor's available days */}
            {selectedDoctorData && availableDays.length > 0 && (
              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.5rem', padding: '1rem', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Info size={15} color="#16a34a" />
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#166534' }}>
                    Dr. {selectedDoctorData.user?.name}'s Schedule
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.5rem' }}>
                  {DAYS.map(day => {
                    const slots = (selectedDoctorData.availability || []).filter(s => s.day === day);
                    const isAvailable = slots.length > 0;
                    return (
                      <div key={day} style={{
                        padding: '0.5rem 0.75rem',
                        borderRadius: '0.375rem',
                        backgroundColor: isAvailable ? 'white' : '#f8fafc',
                        border: isAvailable ? '1px solid #86efac' : '1px solid #e2e8f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: isAvailable ? '#166534' : '#94a3b8' }}>
                          {day.slice(0, 3)}
                        </span>
                        {isAvailable ? (
                          <div style={{ textAlign: 'right' }}>
                            {slots.map((s, i) => (
                              <p key={i} style={{ margin: 0, fontSize: '0.72rem', color: '#16a34a', fontWeight: 500 }}>
                                {s.startTime} - {s.endTime}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Off</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedDoctorData && availableDays.length === 0 && (
              <div style={{ backgroundColor: '#fef9c3', border: '1px solid #fde68a', borderRadius: '0.5rem', padding: '0.75rem 1rem', marginBottom: '0.5rem' }}>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#92400e' }}>⚠️ This doctor has not set their schedule yet. You can still submit a request.</p>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label>Appointment Date *</label>
                <input type="date" name="appointmentDate" required className="form-input"
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.appointmentDate} onChange={handleChange} />
                {formData.appointmentDate && selectedDoctorData && availableDays.length > 0 && !isDateAvailable(formData.appointmentDate) && (
                  <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#dc2626' }}>
                    ❌ Doctor is not available on {DAYS[new Date(formData.appointmentDate).getDay()]}s
                  </p>
                )}
                {formData.appointmentDate && selectedDoctorData && isDateAvailable(formData.appointmentDate) && availableDays.length > 0 && (
                  <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#16a34a' }}>
                    ✓ Doctor is available on {DAYS[new Date(formData.appointmentDate).getDay()]}s
                  </p>
                )}
              </div>

              <div className="form-group">
                <label>Preferred Time *</label>
                {allTimeOptions.length > 0 ? (
                  <select className="form-select" name="appointmentTime" required value={formData.appointmentTime} onChange={handleChange}>
                    <option value="" disabled>Select Time Slot</option>
                    {allTimeOptions.map((t, i) => <option key={i} value={t}>{t}</option>)}
                  </select>
                ) : (
                  <input type="time" name="appointmentTime" required className="form-input"
                    value={formData.appointmentTime} onChange={handleChange} />
                )}
                {availableSlots.length > 0 && (
                  <p style={{ margin: '4px 0 0', fontSize: '0.72rem', color: '#64748b' }}>
                    Available: {availableSlots.map(s => `${s.startTime} - ${s.endTime}`).join(', ')}
                  </p>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Reason for Visit *</label>
              <div className="textarea-wrapper">
                <FileText size={18} className="textarea-icon" />
                <textarea name="reasonForVisit" required className="form-textarea"
                  placeholder="Describe your symptoms or reason for consultation..."
                  rows="4" value={formData.reasonForVisit} onChange={handleChange} />
              </div>
            </div>

            <div className="info-callout">
              <strong>Note:</strong> Your appointment request will be reviewed by the hospital staff. You will receive a confirmation once it's approved.
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-outline-dark" onClick={() => navigate('/dashboard')}>Cancel</button>
              <button type="submit" className="btn btn-search">Submit Request</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default BookAppointment;
