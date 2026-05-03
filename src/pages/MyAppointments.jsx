import React, { useState, useEffect, useContext } from 'react';
import { Search, Calendar, Clock, X, Star } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

// ── Star Rating Widget ──────────────────────────────────────────────────────
const StarRating = ({ value, onChange, size = 24, readonly = false }) => (
  <div style={{ display: 'flex', gap: '4px' }}>
    {[1, 2, 3, 4, 5].map(s => (
      <button key={s} type="button"
        onClick={() => !readonly && onChange && onChange(s)}
        style={{ background: 'none', border: 'none', padding: 0, cursor: readonly ? 'default' : 'pointer', color: s <= value ? '#f59e0b' : '#cbd5e1' }}>
        <Star size={size} fill={s <= value ? 'currentColor' : 'none'} strokeWidth={1.5} />
      </button>
    ))}
  </div>
);

// ── Rate Doctor Modal ───────────────────────────────────────────────────────
const RateDoctorModal = ({ appointment, onClose, onRated }) => {
  const { user } = useContext(AuthContext);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return toast.error('Please select a star rating');
    setSubmitting(true);
    try {
      await api.post('/ratings', {
        doctorId: appointment.doctor?._id,
        appointmentId: appointment._id,
        rating,
        review,
      }, { headers: { Authorization: `Bearer ${user.token}` } });
      toast.success('Thank you for your rating!');
      onRated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', width: '90%', maxWidth: '440px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ margin: 0, fontWeight: 'bold', color: '#1e293b', fontSize: '1.1rem' }}>Rate Your Doctor</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', marginBottom: '1.25rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Star size={20} color="#2563eb" />
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>Dr. {appointment.doctor?.user?.name}</p>
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>{appointment.department}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.5rem' }}>Your Rating *</label>
            <StarRating value={rating} onChange={setRating} size={32} />
            {rating > 0 && (
              <p style={{ margin: '0.4rem 0 0', fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600 }}>
                {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
              </p>
            )}
          </div>

          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Write a Review (optional)</label>
            <textarea value={review} onChange={e => setReview(e.target.value)} rows={3}
              placeholder="Share your experience with this doctor..."
              style={{ width: '100%', padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', outline: 'none', resize: 'none', fontSize: '0.875rem', color: '#1e293b', boxSizing: 'border-box' }} />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose}
              style={{ padding: '0.625rem 1.25rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              style={{ padding: '0.625rem 1.25rem', borderRadius: '0.375rem', border: 'none', backgroundColor: submitting ? '#fde68a' : '#f59e0b', color: 'white', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer' }}>
              {submitting ? 'Submitting...' : '⭐ Submit Rating'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MyAppointments = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [cancelling, setCancelling] = useState(null);
  const [rescheduleModal, setRescheduleModal] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [rescheduling, setRescheduling] = useState(false);
  const [rateModal, setRateModal] = useState(null);
  const [myRatings, setMyRatings] = useState({}); // doctorId -> rating

  const fetchAppointments = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await api.get('/appointments', config);
      setAppointments(data);
      // Fetch existing ratings for completed appointments
      const completedDoctorIds = [...new Set(
        data.filter(a => a.status === 'Completed').map(a => a.doctor?._id).filter(Boolean)
      )];
      const ratingsMap = {};
      await Promise.all(completedDoctorIds.map(async (docId) => {
        try {
          const { data: r } = await api.get(`/ratings/my/${docId}`, config);
          if (r) ratingsMap[docId] = r;
        } catch {}
      }));
      setMyRatings(ratingsMap);
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user) fetchAppointments(); }, [user]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    setCancelling(id);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await api.put(`/appointments/${id}/status`, { status: 'Cancelled' }, config);
      toast.success('Appointment cancelled successfully');
      fetchAppointments();
    } catch {
      toast.error('Failed to cancel appointment');
    } finally {
      setCancelling(null);
    }
  };

  const handleReschedule = async (e) => {
    e.preventDefault();
    if (!newDate || !newTime) return toast.error('Please select date and time');
    // Past time check
    const today = new Date().toISOString().split('T')[0];
    if (newDate === today) {
      const now = new Date();
      const [h, m] = newTime.split(':').map(Number);
      const sel = new Date(); sel.setHours(h, m, 0, 0);
      if (sel <= now) return toast.error('Please select a future time');
    }
    setRescheduling(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await api.put(`/appointments/${rescheduleModal._id}/reschedule`, {
        appointmentDate: newDate,
        appointmentTime: newTime
      }, config);
      toast.success('Appointment rescheduled!');
      setRescheduleModal(null);
      setNewDate(''); setNewTime('');
      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reschedule');
    } finally {
      setRescheduling(false);
    }
  };

  const filteredAppointments = appointments
    .filter(apt => {
      const doctorName = apt.doctor?.user?.name || '';
      const matchesSearch = doctorName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All Status' || apt.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="dashboard-layout">
      <Sidebar activeId="appointments" />

      <main className="dashboard-content">
        <header className="dashboard-welcome">
          <h1 className="welcome-title">Appointment History</h1>
          <p className="welcome-subtitle">View all your past and upcoming appointments</p>
        </header>

        <div className="search-filter-bar">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by doctor name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Status</option>
            <option>Approved</option>
            <option>Pending</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </div>

        <div className="appointments-list">
          {loading ? (
            <p style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading your appointments...</p>
          ) : filteredAppointments.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No appointments found match your search.</p>
          ) : (
            filteredAppointments.map((apt) => (
              <div key={apt._id} className="appointment-card" style={{ marginBottom: '1.5rem' }}>
                <div className="apt-header">
                  <h3 className="apt-doctor">Dr. {apt.doctor?.user?.name || 'Unknown'}</h3>
                  <span className={`apt-status status-${apt.status.toLowerCase()}`}>{apt.status}</span>
                </div>
                <p className="apt-department">{apt.department}</p>
                <p className="apt-description">{apt.reasonForVisit}</p>
                <div className="apt-datetime" style={{ marginBottom: apt.prescription ? '1rem' : '0' }}>
                  <div className="datetime-item">
                    <Calendar size={16} />
                    <span>{new Date(apt.appointmentDate).toLocaleDateString()}</span>
                  </div>
                  <div className="datetime-item">
                    <Clock size={16} />
                    <span>at {apt.appointmentTime}</span>
                  </div>
                </div>

                {apt.prescription && (
                  <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.375rem', border: '1px solid #bbf7d0' }}>
                    <p style={{ fontWeight: 'bold', color: '#166534', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Prescription / Advice:</p>
                    <p style={{ color: '#14532d', fontSize: '0.875rem', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{apt.prescription}</p>
                  </div>
                )}

                {/* Rate Doctor button for completed appointments */}
                {apt.status === 'Completed' && apt.doctor?._id && (
                  <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.75rem' }}>
                    {myRatings[apt.doctor._id] ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <StarRating value={myRatings[apt.doctor._id].rating} readonly size={18} />
                        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Your rating</span>
                        <button onClick={() => setRateModal(apt)}
                          style={{ fontSize: '0.75rem', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}>
                          Edit
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setRateModal(apt)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#fef9c3', color: '#92400e', border: '1px solid #fde68a', borderRadius: '0.5rem', padding: '0.5rem 1rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>
                        <Star size={15} fill="#f59e0b" color="#f59e0b" /> Rate Doctor
                      </button>
                    )}
                  </div>
                )}

                {(apt.status === 'Pending' || apt.status === 'Approved') && (
                  <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                    <button
                      onClick={() => { setRescheduleModal(apt); setNewDate(''); setNewTime(''); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '0.5rem', padding: '0.5rem 1rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>
                      <Calendar size={15} /> Reschedule
                    </button>
                    <button
                      onClick={() => handleCancel(apt._id)}
                      disabled={cancelling === apt._id}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: cancelling === apt._id ? '#fca5a5' : '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '0.5rem', padding: '0.5rem 1rem', fontWeight: 600, fontSize: '0.875rem', cursor: cancelling === apt._id ? 'not-allowed' : 'pointer' }}>
                      {cancelling === apt._id ? 'Cancelling...' : '✕ Cancel'}
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>

      {/* Rate Doctor Modal */}
      {rateModal && (
        <RateDoctorModal
          appointment={rateModal}
          onClose={() => setRateModal(null)}
          onRated={fetchAppointments}
        />
      )}

      {/* Reschedule Modal */}
      {rescheduleModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', width: '90%', maxWidth: '440px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontWeight: 'bold', color: '#1e293b', fontSize: '1.1rem' }}>Reschedule Appointment</h3>
              <button onClick={() => setRescheduleModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Dr. <strong>{rescheduleModal.doctor?.user?.name}</strong> — {rescheduleModal.department}
            </p>
            <form onSubmit={handleReschedule} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>New Date *</label>
                <input type="date" required value={newDate} min={new Date().toISOString().split('T')[0]}
                  onChange={e => setNewDate(e.target.value)}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', outline: 'none', color: '#1e293b' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>New Time *</label>
                <input type="time" required value={newTime} onChange={e => setNewTime(e.target.value)}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', outline: 'none', color: '#1e293b' }} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setRescheduleModal(null)}
                  style={{ padding: '0.625rem 1.25rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={rescheduling}
                  style={{ padding: '0.625rem 1.25rem', borderRadius: '0.375rem', border: 'none', backgroundColor: rescheduling ? '#93c5fd' : '#2563eb', color: 'white', fontWeight: 600, cursor: rescheduling ? 'not-allowed' : 'pointer' }}>
                  {rescheduling ? 'Saving...' : 'Confirm Reschedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
