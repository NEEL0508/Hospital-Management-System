import React from 'react';
import { Search, Calendar, Clock } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const appointments = [
  {
    doctor: "Dr. Sarah Johnson",
    status: "approved",
    department: "Cardiology",
    description: "Regular checkup",
    date: "2026-02-05",
    time: "10:00"
  },
  {
    doctor: "Dr. Michael Chen",
    status: "pending",
    department: "Neurology",
    description: "Consultation for headaches",
    date: "2026-02-12",
    time: "14:30"
  }
];

const MyAppointments = () => {
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
            <input type="text" placeholder="Search by doctor name..." />
          </div>
          <select className="filter-select">
            <option>All Status</option>
            <option>Approved</option>
            <option>Pending</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </div>

        <div className="appointments-list">
          {appointments.map((apt, idx) => (
            <div key={idx} className="appointment-card">
              <div className="apt-header">
                <h3 className="apt-doctor">{apt.doctor}</h3>
                <span className={`apt-status status-${apt.status}`}>{apt.status}</span>
              </div>
              <p className="apt-department">{apt.department}</p>
              <p className="apt-description">{apt.description}</p>
              <div className="apt-datetime">
                <div className="datetime-item">
                  <Calendar size={16} />
                  <span>{apt.date}</span>
                </div>
                <div className="datetime-item">
                  <Clock size={16} />
                  <span>at {apt.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MyAppointments;
