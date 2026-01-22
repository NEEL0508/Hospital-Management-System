import React, { useState, useEffect, useContext } from 'react';
import { FileText, Activity, Pill, Calendar } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const MedicalRecords = () => {
  const { user } = useContext(AuthContext);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await api.get('/records/my-records', config);
        setRecords(data);
      } catch (error) {
        toast.error('Failed to load medical records');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchRecords();
    }
  }, [user]);

  const getRecordIcon = (type) => {
    switch (type) {
      case 'Lab Report':
        return { icon: <Activity size={24} className="text-blue-600" />, bg: "bg-blue-100" };
      case 'Prescription':
        return { icon: <Pill size={24} className="text-purple-600" />, bg: "bg-purple-100" };
      case 'Consultation':
        return { icon: <Calendar size={24} className="text-orange-600" />, bg: "bg-orange-100" };
      case 'Scan Report':
      default:
        return { icon: <FileText size={24} className="text-emerald-600" />, bg: "bg-emerald-100" };
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar activeId="records" />

      <main className="dashboard-content">
        <header className="dashboard-welcome">
          <h1 className="welcome-title">Medical Records</h1>
          <p className="welcome-subtitle">View your prescriptions and medical history</p>
        </header>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading records...</div>
        ) : records.length > 0 ? (
          <div className="records-list">
            {records.map((record) => {
              const style = getRecordIcon(record.type);
              return (
                <div key={record._id} className="record-card">
                  <div className={`record-icon-wrapper ${style.bg}`}>
                    {style.icon}
                  </div>
                  <div className="record-main-content">
                    <div className="record-details">
                      <h3 className="record-title">{record.title}</h3>
                      <div className="record-meta">
                        <span className="record-type">{record.type}</span>
                        <span className="record-dot">•</span>
                        <span>{new Date(record.date).toISOString().split('T')[0]}</span>
                        <span className="record-dot">•</span>
                        <span>Dr. {record.doctor?.user?.name || 'Unknown'}</span>
                      </div>
                    </div>
                    
                    {record.prescription && (
                      <div className="prescription-box">
                        <span className="prescription-label">Prescription Details:</span>
                        <p className="prescription-text">{record.prescription}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state-card">
            <div className="empty-icon-wrapper">
              <FileText size={48} color="#94a3b8" />
            </div>
            <h3>No medical records found</h3>
            <p>Your prescriptions and medical records will appear here after your consultations</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MedicalRecords;
