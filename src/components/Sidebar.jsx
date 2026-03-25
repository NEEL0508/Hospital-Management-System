import React from 'react';
import { 
  LayoutDashboard, Search, CalendarPlus, Clock, MessageSquare, 
  FileText, User
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = ({ activeId }) => {
  const sidebarItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: "Dashboard", link: "/dashboard" },
    { id: 'find-doctors', icon: <Search size={20} />, label: "Find Doctors", link: "/find-doctors" },
    { id: 'book', icon: <CalendarPlus size={20} />, label: "Book Appointment", link: "#" },
    { id: 'appointments', icon: <Clock size={20} />, label: "My Appointments", link: "#" },
    { id: 'feedback', icon: <MessageSquare size={20} />, label: "Feedback", link: "#" },
    { id: 'records', icon: <FileText size={20} />, label: "Medical Records", link: "#" },
    { id: 'profile', icon: <User size={20} />, label: "Profile", link: "#" }
  ];

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Patient Portal</h2>
      <nav className="sidebar-nav">
        {sidebarItems.map((item) => (
          <Link 
            to={item.link} 
            key={item.id} 
            className={`sidebar-link ${item.id === activeId ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
