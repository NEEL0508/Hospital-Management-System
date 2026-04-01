import React, { useState } from 'react';
import { Star, Send, MessageSquare } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const Feedback = () => {
  const [rating, setRating] = useState(0);

  return (
    <div className="dashboard-layout">
      <Sidebar activeId="feedback" />

      <main className="dashboard-content">
        <header className="dashboard-welcome">
          <h1 className="welcome-title">Patient Feedback</h1>
          <p className="welcome-subtitle">Help us improve our services by sharing your experience</p>
        </header>

        <div className="book-appointment-card">
          <form className="appointment-form">
            <div className="form-group">
              <label>Rate Your Experience *</label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    style={{ 
                      color: star <= rating ? '#fbbf24' : '#cbd5e1',
                      transition: 'color 0.2s',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    <Star size={32} fill={star <= rating ? 'currentColor' : 'none'} strokeWidth={1.5} />
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Feedback Category *</label>
              <select className="form-select">
                <option>Select Category</option>
                <option>Doctor Consultation</option>
                <option>Facilities</option>
                <option>Staff Behavior</option>
                <option>Billing</option>
                <option>Wait Time</option>
              </select>
            </div>

            <div className="form-group">
              <label>Subject *</label>
              <input 
                type="text" 
                className="form-input"
                placeholder="Brief description of your feedback" 
              />
            </div>

            <div className="form-group">
              <label>Your Feedback *</label>
              <div className="textarea-wrapper">
                <MessageSquare size={18} className="textarea-icon" />
                <textarea 
                  className="form-textarea"
                  placeholder="Please share your detailed feedback..."
                ></textarea>
              </div>
            </div>

            <div style={{ backgroundColor: '#f0fdf4', color: '#16a34a', padding: '1rem', borderRadius: '8px', fontSize: '0.875rem', border: '1px solid #dcfce7' }}>
              Your feedback is valuable to us and will help improve our healthcare services.
            </div>

            <button type="submit" className="btn btn-purple form-submit-btn" style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <Send size={18} /> Submit Feedback
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Feedback;
