import React from 'react';
import { Search, Mail, Phone } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const doctors = [
  {
    name: "Dr. Sarah Johnson",
    title: "MD, PhD - Senior Cardiologist",
    email: "s.johnson@hplus.com",
    phone: "+1 (555) 012-3456",
    badge: "Cardiology",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop",
    tags: [
      { text: "12+ years exp", type: "gray" },
      { text: "Top Rated", type: "green" }
    ],
    days: ["Mon", "Wed", "Fri"]
  },
  {
    name: "Dr. Michael Chen",
    title: "MD - Lead Neurologist",
    email: "m.chen@hplus.com",
    phone: "+1 (555) 012-7890",
    badge: "Neurology",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop",
    tags: [
      { text: "8+ years exp", type: "gray" }
    ],
    days: ["Tue", "Thu", "Sat"]
  },
  {
    name: "Dr. Emily Davis",
    title: "MD - Pediatric Specialist",
    email: "e.davis@hplus.com",
    phone: "+1 (555) 012-9999",
    badge: "Pediatrics",
    image: "https://images.unsplash.com/photo-1594824436998-efa4c61989c9?q=80&w=1974&auto=format&fit=crop",
    tags: [
      { text: "10+ years exp", type: "gray" }
    ],
    days: ["Mon", "Tue", "Wed", "Thu"]
  }
];

const FindDoctors = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar activeId="find-doctors" />

      <main className="dashboard-content">
        <header className="dashboard-welcome">
          <h1 className="welcome-title">Find a Doctor</h1>
          <p className="welcome-subtitle">Search for medical specialists by name or department</p>
        </header>

        <div className="doctor-filters">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search by doctor name or specialty..." />
          </div>
          <select className="filter-select">
            <option>All Departments</option>
            <option>Cardiology</option>
            <option>Neurology</option>
            <option>Pediatrics</option>
          </select>
          <button className="btn btn-search">Search</button>
        </div>

        <div className="doctors-grid">
          {doctors.map((doc, idx) => (
            <div key={idx} className="doctor-card">
              <div className="doctor-image-wrapper">
                <img src={doc.image} alt={doc.name} />
                <span className="doctor-badge">{doc.badge}</span>
              </div>
              <div className="doctor-info">
                <h3 className="doctor-name">{doc.name}</h3>
                <p className="doctor-title">{doc.title}</p>
                
                <div className="doctor-contact">
                  <div className="doctor-contact-item">
                    <Mail size={16} /> {doc.email}
                  </div>
                  <div className="doctor-contact-item">
                    <Phone size={16} /> {doc.phone}
                  </div>
                </div>

                <div className="doctor-tags">
                  {doc.tags.map((tag, i) => (
                    <span key={i} className={`tag tag-${tag.type}`}>{tag.text}</span>
                  ))}
                </div>

                <div className="available-days">
                  <p className="available-days-title">Available Days</p>
                  <div className="days-list">
                    {doc.days.map((day, i) => (
                      <span key={i} className="day-badge">{day}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default FindDoctors;
