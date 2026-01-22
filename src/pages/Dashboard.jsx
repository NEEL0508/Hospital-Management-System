import React, { useState, useEffect, useContext } from 'react';
import { Search, CalendarPlus, Clock, FileText, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const [appointmentsRes, recordsRes] = await Promise.all([
          api.get('/appointments', config),
          api.get('/records/my-records', config)
        ]);

        setAppointments(appointmentsRes.data);
        setRecords(recordsRes.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (user && user.token) {
      fetchData();
    }
  }, [user]);

  // Calculate Stats
  const totalAppointments = appointments.length;
  const upcomingCount = appointments.filter(a => a.status === 'Scheduled' || a.status === 'Pending').length;
  const completedCount = appointments.filter(a => a.status === 'Completed').length;
  const prescriptionCount = records.filter(r => r.type === 'Prescription').length;

  const stats = [
    { label: "TOTAL APPOINTMENTS", value: totalAppointments.toString(), icon: <Calendar size={20} className="text-purple-600" />, iconBg: "bg-purple-100" },
    { label: "UPCOMING", value: upcomingCount.toString(), icon: <Clock size={20} className="text-blue-600" />, iconBg: "bg-blue-100" },
    { label: "COMPLETED", value: completedCount.toString(), icon: <CheckCircle2 size={20} className="text-green-600" />, iconBg: "bg-green-100" },
    { label: "PRESCRIPTIONS", value: prescriptionCount.toString(), icon: <FileText size={20} className="text-orange-600" />, iconBg: "bg-orange-100" }
  ];

  // Get recent items
  const upcomingAppointments = appointments
    .filter(a => a.status === 'Scheduled' || a.status === 'Pending')
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
    .slice(0, 3);

  const recentPrescriptions = records
    .filter(r => r.type === 'Prescription' || (r.type === 'Consultation' && r.prescription))
    .slice(0, 2);

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar activeId="dashboard" />
        <main className="dashboard-content flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading your dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar activeId="dashboard" />

      {/* Main Content */}
      <main className="dashboard-content">
        <header className="dashboard-welcome">
          <h1 className="welcome-title">Welcome, {user?.name || 'Patient'}</h1>
          <p className="welcome-subtitle">Manage your health and appointments</p>
        </header>

        {error && (
          <div className="error-alert bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 flex items-center gap-3">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

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
              <Link to="/my-appointments" className="view-all-link">View All &rarr;</Link>
            </div>
            
            {upcomingAppointments.length > 0 ? (
              <div className="info-list">
                {upcomingAppointments.map((apt) => (
                  <div key={apt._id} className="info-list-item">
                    <div className="item-main">
                      <p className="item-title font-semibold">Dr. {apt.doctor?.user?.name || 'Doctor'}</p>
                      <p className="item-subtitle text-sm text-gray-500">{apt.department}</p>
                    </div>
                    <div className="item-meta text-right">
                      <p className="item-date text-sm font-medium">{new Date(apt.appointmentDate).toLocaleDateString()}</p>
                      <p className="item-time text-xs text-gray-400">{apt.appointmentTime}</p>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => navigate('/book-appointment')}
                  className="btn btn-primary btn-sm btn-purple mt-4 w-full"
                >
                  Book New Appointment
                </button>
              </div>
            ) : (
              <div className="info-card-empty">
                <p>No upcoming appointments</p>
                <button 
                  onClick={() => navigate('/book-appointment')}
                  className="btn btn-primary btn-purple mt-4"
                >
                  Book Appointment
                </button>
              </div>
            )}
          </div>

          <div className="info-card">
            <div className="info-card-header">
              <h3>Recent Prescriptions</h3>
              <Link to="/medical-records" className="view-all-link">View All &rarr;</Link>
            </div>
            
            {recentPrescriptions.length > 0 ? (
              <div className="info-list">
                {recentPrescriptions.map((record) => (
                  <div key={record._id} className="info-list-item">
                    <div className="item-main">
                      <p className="item-title font-semibold">{record.title || "Prescription"}</p>
                      <p className="item-subtitle text-sm text-gray-500">Dr. {record.doctor?.user?.name || 'Doctor'}</p>
                    </div>
                    <div className="item-meta text-right">
                      <p className="item-date text-sm font-medium">{new Date(record.date).toLocaleDateString()}</p>
                      <Link to="/medical-records" className="text-xs text-blue-600 hover:underline">View Details</Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="info-card-empty">
                <p>No prescriptions yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Banners */}
        <div className="action-banners-grid">
          <div 
            className="action-banner banner-purple cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => navigate('/find-doctors')}
          >
            <div className="banner-content">
              <h3>Find a Doctor</h3>
              <p>Search for doctors by specialization and department</p>
            </div>
            <Search className="banner-bg-icon" size={160} />
          </div>

          <div 
            className="action-banner banner-blue cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => navigate('/book-appointment')}
          >
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

