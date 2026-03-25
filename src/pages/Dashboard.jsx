import React from 'react';
import { 
  LayoutDashboard, Search, CalendarPlus, Clock, MessageSquare, 
  FileText, User, Calendar, CheckCircle2,
} from 'lucide-react';

const sidebarItems = [
  { icon: <LayoutDashboard size={20} />, label: "Dashboard", active: true },
  { icon: <Search size={20} />, label: "Find Doctors" },
  { icon: <CalendarPlus size={20} />, label: "Book Appointment" },
  { icon: <Clock size={20} />, label: "My Appointments" },
  { icon: <MessageSquare size={20} />, label: "Feedback" },
  { icon: <FileText size={20} />, label: "Medical Records" },
  { icon: <User size={20} />, label: "Profile" }
];

const stats = [
  { label: "TOTAL APPOINTMENTS", value: "1", icon: <Calendar size={20} className="text-purple-600" />, iconBg: "bg-purple-100" },
  { label: "UPCOMING", value: "1", icon: <Clock size={20} className="text-blue-600" />, iconBg: "bg-blue-100" },
  { label: "COMPLETED", value: "0", icon: <CheckCircle2 size={20} className="text-green-600" />, iconBg: "bg-green-100" },
  { label: "PRESCRIPTIONS", value: "0", icon: <FileText size={20} className="text-orange-600" />, iconBg: "bg-orange-100" }
];

const Dashboard = () => {
  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Patient Portal</h2>
        <nav className="sidebar-nav">
          {sidebarItems.map((item, index) => (
            <a href="#" key={index} className={`sidebar-link ${item.active ? 'active' : ''}`}>
              {item.icon}
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        <header className="dashboard-welcome">
          <h1 className="welcome-title">Welcome, John Smith</h1>
          <p className="welcome-subtitle">Manage your health and appointments</p>
        </header>

        {/* Stats Grid */}
        <div className="dashboard-stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className="dashboard-stat-card">
              <div className="stat-info">
                <p className="stat-label-small">{stat.label}</p>
                <h3 className="stat-value-large">{stat.value}</h3>
              </div>
              <div className={`stat-icon-wrapper ${stat.iconBg}`}>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Info Layout */}
        <div className="dashboard-info-grid">
          <div className="info-card">
            <div className="info-card-header">
              <h3>Upcoming Appointments</h3>
              <a href="#" className="view-all-link">View All &rarr;</a>
            </div>
            <div className="info-card-empty">
              <p>No upcoming appointments</p>
              <button className="btn btn-primary btn-purple mt-4">Book Appointment</button>
            </div>
          </div>

          <div className="info-card">
            <div className="info-card-header">
              <h3>Recent Prescriptions</h3>
              <a href="#" className="view-all-link">View All &rarr;</a>
            </div>
            <div className="info-card-empty">
              <p>No prescriptions yet</p>
            </div>
          </div>
        </div>

        {/* Action Banners */}
        <div className="action-banners-grid">
          <div className="action-banner banner-purple">
            <div className="banner-content">
              <h3>Find a Doctor</h3>
              <p>Search for doctors by specialization and department</p>
            </div>
            <Search className="banner-bg-icon" size={160} />
          </div>

          <div className="action-banner banner-blue">
            <div className="banner-content">
              <h3>Book Appointment</h3>
              <p>Schedule your next consultation with our doctors</p>
            </div>
            <CalendarPlus className="banner-bg-icon" size={160} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
