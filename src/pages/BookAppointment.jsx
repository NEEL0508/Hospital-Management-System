import React from 'react';
import { FileText } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const BookAppointment = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar activeId="book" />

      <main className="dashboard-content">
        <header className="dashboard-welcome">
          <h1 className="welcome-title">Book Appointment</h1>
          <p className="welcome-subtitle">Schedule a consultation with our doctors</p>
        </header>

        <div className="book-appointment-card">
          <form className="appointment-form">
            <div className="form-group">
              <label>Department *</label>
              <select className="form-select" defaultValue="">
                <option value="" disabled>Select Department</option>
                <option value="cardiology">Cardiology</option>
                <option value="neurology">Neurology</option>
                <option value="pediatrics">Pediatrics</option>
              </select>
            </div>

            <div className="form-group">
              <label>Select Doctor *</label>
              <select className="form-select" defaultValue="">
                <option value="" disabled>Select Doctor</option>
                <option value="johnson">Dr. Sarah Johnson</option>
                <option value="chen">Dr. Michael Chen</option>
                <option value="davis">Dr. Emily Davis</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Appointment Date *</label>
                <input type="date" className="form-input" />
              </div>
              <div className="form-group">
                <label>Preferred Time *</label>
                <input type="time" className="form-input" />
              </div>
            </div>

            <div className="form-group">
              <label>Reason for Visit *</label>
              <div className="textarea-wrapper">
                <FileText size={18} className="textarea-icon" />
                <textarea 
                  className="form-textarea" 
                  placeholder="Describe your symptoms or reason for consultation..."
                  rows="4"
                ></textarea>
              </div>
            </div>

            <div className="info-callout">
              <strong>Note:</strong> Your appointment request will be reviewed by the hospital staff. You will receive a confirmation once it's approved.
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-outline-dark">Cancel</button>
              <button type="submit" className="btn btn-search">Submit Request</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default BookAppointment;
