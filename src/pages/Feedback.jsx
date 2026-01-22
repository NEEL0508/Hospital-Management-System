import React, { useState, useContext } from 'react';
import { Star, Send, MessageSquare } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Feedback = () => {
  const { user } = useContext(AuthContext);
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return toast.error('Please select a rating');
    setSubmitting(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await api.post('/feedback', { rating, category, subject, message }, config);
      toast.success('Feedback submitted! Thank you.');
      setSubmitted(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="dashboard-layout">
        <Sidebar activeId="feedback" />
        <main className="dashboard-content">
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
            <h2 style={{ color: '#1e293b', fontWeight: 'bold', marginBottom: '0.5rem' }}>Thank You!</h2>
            <p style={{ color: '#64748b' }}>Your feedback has been submitted successfully.</p>
            <button onClick={() => { setSubmitted(false); setRating(0); setCategory(''); setSubject(''); setMessage(''); }}
              style={{ marginTop: '1.5rem', padding: '0.75rem 2rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}>
              Submit Another
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar activeId="feedback" />
      <main className="dashboard-content">
        <header className="dashboard-welcome">
          <h1 className="welcome-title">Patient Feedback</h1>
          <p className="welcome-subtitle">Help us improve our services by sharing your experience</p>
        </header>

        <div className="book-appointment-card">
          <form className="appointment-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Rate Your Experience *</label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setRating(star)}
                    style={{ color: star <= rating ? '#fbbf24' : '#cbd5e1', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    <Star size={32} fill={star <= rating ? 'currentColor' : 'none'} strokeWidth={1.5} />
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Feedback Category *</label>
              <select className="form-select" required value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">Select Category</option>
                <option>Doctor Consultation</option>
                <option>Facilities</option>
                <option>Staff Behavior</option>
                <option>Billing</option>
                <option>Wait Time</option>
              </select>
            </div>

            <div className="form-group">
              <label>Subject *</label>
              <input type="text" className="form-input" required placeholder="Brief description of your feedback"
                value={subject} onChange={e => setSubject(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Your Feedback *</label>
              <div className="textarea-wrapper">
                <MessageSquare size={18} className="textarea-icon" />
                <textarea className="form-textarea" required placeholder="Please share your detailed feedback..."
                  value={message} onChange={e => setMessage(e.target.value)} />
              </div>
            </div>

            <div style={{ backgroundColor: '#f0fdf4', color: '#16a34a', padding: '1rem', borderRadius: '8px', fontSize: '0.875rem', border: '1px solid #dcfce7' }}>
              Your feedback is valuable to us and will help improve our healthcare services.
            </div>

            <button type="submit" disabled={submitting} className="btn btn-purple form-submit-btn" style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <Send size={18} /> {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Feedback;
