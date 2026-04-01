import React from 'react';
import { LayoutDashboard, CalendarPlus, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const DoctorSidebar = ({ activeId }) => {
  const sidebarItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: "Dashboard", link: "/doctor/dashboard" },
    { id: 'appointments', icon: <CalendarPlus size={20} />, label: "Appointments", link: "/doctor/appointments" },
    { id: 'schedule', icon: <Clock size={20} />, label: "My Schedule", link: "/doctor/schedule" },
    { id: 'profile', icon: <User size={20} />, label: "Profile", link: "/doctor/profile" }
  ];

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title" style={{ color: '#1e293b' }}>Doctor Panel</h2>
      <nav className="sidebar-nav">
        {sidebarItems.map((item) => (
          <Link 
            to={item.link} 
            key={item.id} 
            className={`sidebar-link ${item.id === activeId ? 'active' : ''}`}
            style={item.id === activeId ? { backgroundColor: '#10b981', color: 'white' } : {}}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default DoctorSidebar;
