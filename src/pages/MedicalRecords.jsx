import React, { useState, useEffect, useContext } from 'react';
import { FileText, Activity, Pill, Calendar, Download, Eye, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const getRecordStyle = (type) => {
  switch (type) {
    case 'Lab Report':
      return { icon: <Activity size={22} color="#2563eb" />, bg: '#eff6ff', badge: '#dbeafe', badgeText: '#1d4ed8' };
    case 'Prescription':
      return { icon: <Pill size={22} color="#7c3aed" />, bg: '#f5f3ff', badge: '#ede9fe', badgeText: '#6d28d9' };
    case 'Consultation':
      return { icon: <Calendar size={22} color="#ea580c" />, bg: '#fff7ed', badge: '#ffedd5', badgeText: '#c2410c' };
    case 'Scan Report':
      return { icon: <FileText size={22} color="#0f766e" />, bg: '#f0fdfa', badge: '#ccfbf1', badgeText: '#0f766e' };
    default:
      return { icon: <FileText size={22} color="#475569" />, bg: '#f8fafc', badge: '#f1f5f9', badgeText: '#475569' };
  }
};

const MedicalRecords = () => {
  const { user } = useContext(AuthContext);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewRecord, setPreviewRecord] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const { data } = await api.get('/records/my-records', { headers: { Authorization: `Bearer ${user.token}` } });
        setRecords(data);
      } catch {
        toast.error('Failed to load medical records');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchRecords();
  }, [user]);

  const types = ['All', 'Lab Report', 'Scan Report', 'Prescription', 'Consultation', 'Other'];
  const filtered = filter === 'All' ? records : records.filter(r => r.type === filter);

  const hasFile = (rec) => rec.fileUrl && rec.fileUrl !== '#' && rec.fileUrl.length > 10;

  const isImage = (fileUrl) => fileUrl?.startsWith('data:image');
  const isPdf = (fileUrl) => fileUrl?.startsWith('data:application/pdf');

  return (
    <div className="dashboard-layout">
      <Sidebar activeId="records" />

      <main className="dashboard-content" style={{ backgroundColor: '#f8fafc', padding: '2rem' }}>
        <header style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.25rem' }}>Medical Records</h1>
          <p style={{ color: '#64748b' }}>Your prescriptions, lab reports, and medical history</p>
        </header>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Total Records', value: records.length, color: '#2563eb' },
            { label: 'Lab Reports', value: records.filter(r => r.type === 'Lab Report').length, color: '#0f766e' },
            { label: 'Prescriptions', value: records.filter(r => r.type === 'Prescription').length, color: '#7c3aed' },
            { label: 'With Files', value: records.filter(r => hasFile(r)).length, color: '#ea580c' },
          ].map((s, i) => (
            <div key={i} style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.25rem', border: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.4rem' }}>{s.label}</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: s.color, margin: 0 }}>{s.value}</h3>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {types.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              style={{ padding: '0.4rem 1rem', borderRadius: '9999px', border: '1px solid', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', backgroundColor: filter === t ? '#2563eb' : 'white', color: filter === t ? 'white' : '#475569', borderColor: filter === t ? '#2563eb' : '#e2e8f0' }}>
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading records...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
            <FileText size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem', display: 'block' }} />
            <h3 style={{ color: '#475569', marginBottom: '0.5rem' }}>No records found</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
              {filter === 'All'
                ? 'Your prescriptions and medical records will appear here after your consultations.'
                : `No ${filter} records found.`}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filtered.map((record) => {
              const style = getRecordStyle(record.type);
              const fileAvailable = hasFile(record);
              return (
                <div key={record._id} style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.25rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  {/* Icon */}
                  <div style={{ width: '44px', height: '44px', borderRadius: '0.5rem', backgroundColor: style.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {style.icon}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                      <div>
                        <h3 style={{ margin: 0, fontWeight: 700, color: '#1e293b', fontSize: '1rem' }}>{record.title}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '9999px', backgroundColor: style.badge, color: style.badgeText }}>
                            {record.type}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                            {new Date(record.date || record.createdAt).toLocaleDateString('en-IN')}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                            Dr. {record.doctor?.user?.name || 'Unknown'}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                        {fileAvailable && (
                          <>
                            <button onClick={() => setPreviewRecord(record)}
                              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', fontWeight: 600, color: '#2563eb', backgroundColor: '#eff6ff', border: 'none', borderRadius: '0.375rem', padding: '0.4rem 0.75rem', cursor: 'pointer' }}>
                              <Eye size={13} /> View
                            </button>
                            <a href={record.fileUrl} download={record.title}
                              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', fontWeight: 600, color: '#0f766e', backgroundColor: '#f0fdfa', border: 'none', borderRadius: '0.375rem', padding: '0.4rem 0.75rem', textDecoration: 'none' }}>
                              <Download size={13} /> Download
                            </a>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Prescription / Notes */}
                    {record.prescription && (
                      <div style={{ marginTop: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.375rem', padding: '0.625rem 0.875rem', borderLeft: '3px solid #e2e8f0' }}>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569', lineHeight: 1.6 }}>
                          <strong style={{ color: '#1e293b' }}>Notes: </strong>{record.prescription}
                        </p>
                      </div>
                    )}

                    {/* File indicator */}
                    {fileAvailable && (
                      <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <FileText size={12} color="#0f766e" />
                        <span style={{ fontSize: '0.75rem', color: '#0f766e', fontWeight: 600 }}>
                          {isImage(record.fileUrl) ? 'Image file attached' : isPdf(record.fileUrl) ? 'PDF file attached' : 'File attached'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* File Preview Modal */}
      {previewRecord && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', width: '100%', maxWidth: '800px', maxHeight: '92vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>{previewRecord.title}</h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                  {previewRecord.type} &bull; Dr. {previewRecord.doctor?.user?.name || 'Unknown'} &bull; {new Date(previewRecord.date || previewRecord.createdAt).toLocaleDateString('en-IN')}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <a href={previewRecord.fileUrl} download={previewRecord.title}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', fontWeight: 600, color: '#0f766e', backgroundColor: '#f0fdfa', border: 'none', borderRadius: '0.375rem', padding: '0.4rem 0.75rem', textDecoration: 'none' }}>
                  <Download size={14} /> Download
                </a>
                <button onClick={() => setPreviewRecord(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '0.25rem' }}>
                  <X size={22} />
                </button>
              </div>
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: '1rem', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isImage(previewRecord.fileUrl) ? (
                <img src={previewRecord.fileUrl} alt={previewRecord.title} style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: '0.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              ) : isPdf(previewRecord.fileUrl) ? (
                <iframe src={previewRecord.fileUrl} title={previewRecord.title} style={{ width: '100%', height: '70vh', border: 'none', borderRadius: '0.5rem' }} />
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <FileText size={48} color="#94a3b8" style={{ margin: '0 auto 1rem', display: 'block' }} />
                  <p style={{ color: '#64748b', marginBottom: '1rem' }}>Preview not available for this file type.</p>
                  <a href={previewRecord.fileUrl} download={previewRecord.title}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#0f766e', color: 'white', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 600 }}>
                    <Download size={16} /> Download File
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;
