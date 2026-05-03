import React from 'react';
import { LayoutDashboard, Users, Building, CalendarPlus, User, Receipt, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminSidebar = ({ activeId }) => {
  const sidebarItems = [
    { id: 'dashboard',      icon: <LayoutDashboard size={20} />, label: 'Dashboard',        link: '/admin/dashboard' },
    { id: 'manage-doctors', icon: <Users size={20} />,           label: 'Manage Doctors',   link: '/admin/manage-doctors' },
    { id: 'departments',    icon: <Building size={20} />,        label: 'Departments',      link: '/admin/departments' },
    { id: 'patients',       icon: <User size={20} />,            label: 'Patients',         link: '/admin/patients' },
    { id: 'appointments',   icon: <CalendarPlus size={20} />,    label: 'Appointments',     link: '/admin/appointments' },
    { id: 'activity',       icon: <Activity size={20} />,        label: 'Activity',         link: '/admin/activity' },
    { id: 'billing',        icon: <Receipt size={20} />,         label: 'Billing',          link: '/admin/billing' },
    { id: 'profile',        icon: <User size={20} />,            label: 'Profile',          link: '/admin/profile' },
  ];

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title text-slate-400" style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>ADMIN PANEL</h2>
      <nav className="sidebar-nav">
        {sidebarItems.map((item) => (
          <Link 
            to={item.link} 
            key={item.id} 
            className={`sidebar-link ${item.id === activeId ? 'active' : ''}`}
            style={item.id === activeId ? { backgroundColor: '#2563eb', color: 'white' } : {}}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
