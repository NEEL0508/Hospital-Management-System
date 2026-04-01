import React from 'react';
import { FileText, Download, Activity, Pill } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const records = [
  {
    type: "Lab Report",
    title: "Complete Blood Count (CBC)",
    date: "2026-03-10",
    doctor: "Dr. Sarah Johnson",
    icon: <Activity size={24} className="text-blue-600" />,
    iconBg: "bg-blue-100"
  },
  {
    type: "Prescription",
    title: "Amoxicillin 500mg",
    date: "2026-02-15",
    doctor: "Dr. Michael Chen",
    icon: <Pill size={24} className="text-purple-600" />,
    iconBg: "bg-purple-100"
  },
  {
    type: "Scan Report",
    title: "Chest X-Ray",
    date: "2026-01-20",
    doctor: "Dr. Emily Davis",
    icon: <FileText size={24} className="text-emerald-600" />,
    iconBg: "bg-emerald-100"
  }
];

const MedicalRecords = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar activeId="records" />

      <main className="dashboard-content">
        <header className="dashboard-welcome">
          <h1 className="welcome-title">Medical Records</h1>
          <p className="welcome-subtitle">View your prescriptions and medical history</p>
        </header>

        {records.length > 0 ? (
          <div className="records-list">
            {records.map((record, idx) => (
              <div key={idx} className="record-card">
                <div className={`record-icon-wrapper ${record.iconBg}`}>
                  {record.icon}
                </div>
                <div className="record-details">
                  <h3 className="record-title">{record.title}</h3>
                  <div className="record-meta">
                    <span className="record-type">{record.type}</span>
                    <span className="record-dot">•</span>
                    <span>{record.date}</span>
                    <span className="record-dot">•</span>
                    <span>{record.doctor}</span>
                  </div>
                </div>
                <button className="btn btn-outline-dark btn-download">
                  <Download size={18} className="mr-1" /> Download
                </button>
              </div>
            ))}
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
