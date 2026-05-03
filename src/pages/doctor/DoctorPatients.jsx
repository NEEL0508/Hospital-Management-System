import React, { useState, useEffect, useContext } from 'react';
import { Search, User, Mail, Phone, Droplet, Calendar, Clock, FileText, Upload, X, CreditCard, Download, Activity } from 'lucide-react';
import DoctorSidebar from '../../components/DoctorSidebar';
import api from '../../api';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const statusColor = {
  Completed: { bg: '#dcfce7', color: '#166534' },
  Approved: { bg: '#dbeafe', color: '#1d4ed8' },
  Pending: { bg: '#fef9c3', color: '#92400e' },
  Cancelled: { bg: '#fee2e2', color: '#991b1b' },
  Rejected: { bg: '#fee2e2', color: '#991b1b' },
};

const billStatusColor = {
  Unpaid: { bg: '#fee2e2', color: '#991b1b' },
  Partial: { bg: '#fef9c3', color: '#92400e' },
  'Payment Requested': { bg: '#dbeafe', color: '#1d4ed8' },
  Paid: { bg: '#dcfce7', color: '#166534' },
};

const TABS = ['Appointments', 'Medical Records', 'Bills', 'Send Report'];

const DoctorPatients = () => {
  const { user } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Appointments');

  // Report upload state
  const [reportFile, setReportFile] = useState(null);
  const [reportTitle, setReportTitle] = useState('');
  const [reportNotes, setReportNotes] = useState('');
  const [reportType, setReportType] = useState('Lab Report');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data } = await api.get('/doctors/my-patients', { headers: { Authorization: `Bearer ${user.token}` } });
        setPatients(data);
      } catch {
        toast.error('Failed to load patients');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchPatients();
  }, [user]);

  const openDetails = async (pt) => {
    setSelected(pt);
    setActiveTab('Appointments');
    setDetailsLoading(true);
    try {
      const { data } = await api.get(`/doctors/patient/${pt._id}/details`, { headers: { Authorization: `Bearer ${user.token}` } });
      setDetails(data);
    } catch {
      toast.error('Failed to load patient details');
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeModal = () => {
    setSelected(null);
    setDetails(null);
    setReportFile(null);
    setReportTitle('');
    setReportNotes('');
    setReportType('Lab Report');
  };

  const handleSendReport = async () => {
    if (!reportFile) return toast.error('Please select a file');
    if (!reportTitle.trim()) return toast.error('Please enter report title');
    setSending(true);
    try {
      const formData = new FormData();
      formData.append('report', reportFile);
      formData.append('patientId', selected._id);
      formData.append('patientName', selected.name);
      formData.append('patientEmail', selected.email);
      formData.append('reportTitle', reportTitle);
      formData.append('notes', reportNotes);
      formData.append('reportType', reportType);

      await api.post('/reports/send', formData, {
        headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'multipart/form-data' }
      });
      toast.success(`Report sent to ${selected.email} and saved to patient records`);
      setReportFile(null);
      setReportTitle('');
      setReportNotes('');
      setReportType('Lab Report');
      // Refresh details
      const { data } = await api.get(`/doctors/patient/${selected._id}/details`, { headers: { Authorization: `Bearer ${user.token}` } });
      setDetails(data);
      setActiveTab('Medical Records');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send report');
    } finally {
      setSending(false);
    }
  };

  const filtered = patients.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <DoctorSidebar activeId="patients" />
      <main className="dashboard-content" style={{ backgroundColor: '#f8fafc', padding: '2rem' }}>

        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.25rem' }}>My Patients</h1>
          <p style={{ color: '#64748b' }}>All patients who have visited or booked with you</p>
        </header>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Patients', value: patients.length, color: '#2563eb' },
            { label: 'Completed Visits', value: patients.filter(p => p.lastStatus === 'Completed').length, color: '#16a34a' },
            { label: 'Pending / Approved', value: patients.filter(p => p.lastStatus === 'Pending' || p.lastStatus === 'Approved').length, color: '#f59e0b' },
          ].map((s, i) => (
            <div key={i} style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>{s.label}</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: s.color, margin: 0 }}>{s.value}</h3>
            </div>
          ))}
        </div>

        {/* Patient Table */}
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none', color: '#1e293b' }} />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  {['Patient', 'Contact', 'Blood Group', 'Visits', 'Last Visit', 'Status', 'Action'].map(h => (
                    <th key={h} style={{ padding: '1rem 1.25rem' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading patients...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No patients found.</td></tr>
                ) : filtered.map((pt, i) => (
                  <tr key={pt._id} style={{ borderBottom: i === filtered.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <User size={18} color="#2563eb" />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#1e293b' }}>{pt.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Since {new Date(pt.createdAt).toLocaleDateString('en-IN')}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                        <Mail size={12} /> {pt.email}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569', fontSize: '0.8rem' }}>
                        <Phone size={12} /> {pt.phone || 'N/A'}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      {pt.bloodGroup ? (
                        <span style={{ backgroundColor: '#fee2e2', color: '#ef4444', fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '9999px' }}>
                          {pt.bloodGroup}
                        </span>
                      ) : <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>N/A</span>}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#1e293b', textAlign: 'center' }}>{pt.totalAppointments}</td>
                    <td style={{ padding: '1rem 1.25rem', color: '#475569', fontSize: '0.875rem' }}>
                      {new Date(pt.lastVisit).toLocaleDateString('en-IN')}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.75rem', borderRadius: '9999px', backgroundColor: statusColor[pt.lastStatus]?.bg || '#f1f5f9', color: statusColor[pt.lastStatus]?.color || '#475569' }}>
                        {pt.lastStatus}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <button onClick={() => openDetails(pt)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '0.375rem', padding: '0.4rem 0.75rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                        <Activity size={13} /> View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Patient Details Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', width: '100%', maxWidth: '760px', maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.15)' }}>

            {/* Header */}
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={24} color="#2563eb" />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b' }}>{selected.name}</h2>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>{selected.email} &bull; {selected.phone || 'No phone'}</p>
                </div>
              </div>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={22} />
              </button>
            </div>

            {/* Patient Info Strip */}
            <div style={{ padding: '1rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', backgroundColor: '#f8fafc' }}>
              {[
                { label: 'Blood Group', value: selected.bloodGroup || 'N/A', color: '#ef4444' },
                { label: 'Total Visits', value: selected.totalAppointments, color: '#2563eb' },
                { label: 'Last Visit', value: new Date(selected.lastVisit).toLocaleDateString('en-IN'), color: '#0f766e' },
                { label: 'Last Status', value: selected.lastStatus, color: '#92400e' },
              ].map((item, i) => (
                <div key={i}>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</p>
                  <p style={{ margin: '2px 0 0', fontWeight: 700, color: item.color, fontSize: '0.9rem' }}>{item.value}</p>
                </div>
              ))}
              {selected.lastReason && (
                <div>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Reason</p>
                  <p style={{ margin: '2px 0 0', fontWeight: 600, color: '#475569', fontSize: '0.85rem' }}>{selected.lastReason}</p>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div style={{ padding: '0 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '0', overflowX: 'auto' }}>
              {TABS.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{ padding: '1rem 1.1rem', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', color: activeTab === tab ? '#2563eb' : '#64748b', borderBottom: activeTab === tab ? '2px solid #2563eb' : '2px solid transparent', marginBottom: '-1px', whiteSpace: 'nowrap' }}>
                  {tab}
                  {details && tab !== 'Send Report' && (
                    <span style={{ marginLeft: '0.4rem', fontSize: '0.7rem', backgroundColor: activeTab === tab ? '#dbeafe' : '#f1f5f9', color: activeTab === tab ? '#1d4ed8' : '#64748b', padding: '0.1rem 0.4rem', borderRadius: '9999px' }}>
                      {tab === 'Appointments' ? details.appointments?.length : tab === 'Medical Records' ? details.medicalRecords?.length : details.bills?.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div style={{ padding: '1.5rem 2rem' }}>
              {detailsLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading details...</div>
              ) : (
                <>
                  {/* Appointments */}
                  {activeTab === 'Appointments' && details && (
                    <div>
                      {details.appointments.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                          <Calendar size={40} style={{ margin: '0 auto 0.75rem', display: 'block', opacity: 0.4 }} />
                          No appointments with this patient
                        </div>
                      ) : details.appointments.map((apt) => (
                        <div key={apt._id} style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem', marginBottom: '0.75rem', backgroundColor: '#fafafa' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <div>
                              <p style={{ margin: 0, fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>{apt.department}</p>
                              <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                                {new Date(apt.appointmentDate).toLocaleDateString('en-IN')} at {apt.appointmentTime}
                              </p>
                            </div>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '9999px', backgroundColor: statusColor[apt.status]?.bg || '#f1f5f9', color: statusColor[apt.status]?.color || '#475569' }}>
                              {apt.status}
                            </span>
                          </div>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569' }}><strong>Reason:</strong> {apt.reasonForVisit}</p>
                          {apt.prescription && (
                            <div style={{ marginTop: '0.5rem', backgroundColor: '#f0fdf4', borderRadius: '0.375rem', padding: '0.5rem 0.75rem' }}>
                              <p style={{ margin: 0, fontSize: '0.78rem', color: '#166534' }}><strong>Prescription:</strong> {apt.prescription}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Medical Records */}
                  {activeTab === 'Medical Records' && details && (
                    <div>
                      {details.medicalRecords.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                          <FileText size={40} style={{ margin: '0 auto 0.75rem', display: 'block', opacity: 0.4 }} />
                          No medical records yet. Use "Send Report" tab to upload one.
                        </div>
                      ) : details.medicalRecords.map((rec) => (
                        <div key={rec._id} style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem', marginBottom: '0.75rem', backgroundColor: '#fafafa' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                              <p style={{ margin: 0, fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>{rec.title}</p>
                              <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                                {rec.type} &bull; {new Date(rec.date || rec.createdAt).toLocaleDateString('en-IN')}
                              </p>
                              {rec.prescription && (
                                <p style={{ margin: '6px 0 0', fontSize: '0.8rem', color: '#475569' }}>{rec.prescription}</p>
                              )}
                            </div>
                            {rec.fileUrl && rec.fileUrl !== '#' && (
                              <a href={rec.fileUrl} download={rec.title} target="_blank" rel="noreferrer"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: '#0f766e', fontWeight: 600, textDecoration: 'none', backgroundColor: '#f0fdfa', padding: '0.35rem 0.7rem', borderRadius: '0.375rem', flexShrink: 0, marginLeft: '1rem' }}>
                                <Download size={13} /> View File
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Bills */}
                  {activeTab === 'Bills' && details && (
                    <div>
                      {details.bills.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                          <CreditCard size={40} style={{ margin: '0 auto 0.75rem', display: 'block', opacity: 0.4 }} />
                          No bills for this patient
                        </div>
                      ) : details.bills.map((bill) => (
                        <div key={bill._id} style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem', marginBottom: '0.75rem', backgroundColor: '#fafafa' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{new Date(bill.createdAt).toLocaleDateString('en-IN')}</p>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '9999px', backgroundColor: billStatusColor[bill.status]?.bg || '#f1f5f9', color: billStatusColor[bill.status]?.color || '#475569' }}>
                              {bill.status}
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                            <span>Total: <strong style={{ color: '#1e293b' }}>₹{bill.totalAmount.toLocaleString('en-IN')}</strong></span>
                            <span>Paid: <strong style={{ color: '#16a34a' }}>₹{bill.paidAmount.toLocaleString('en-IN')}</strong></span>
                            {bill.totalAmount - bill.paidAmount > 0 && (
                              <span>Due: <strong style={{ color: '#dc2626' }}>₹{(bill.totalAmount - bill.paidAmount).toLocaleString('en-IN')}</strong></span>
                            )}
                          </div>
                          {bill.items?.length > 0 && (
                            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                              {bill.items.map((it, i) => (
                                <span key={i}>{it.description} (₹{it.amount.toLocaleString('en-IN')}){i < bill.items.length - 1 ? ', ' : ''}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Send Report */}
                  {activeTab === 'Send Report' && (
                    <div>
                      <div style={{ backgroundColor: '#f0fdfa', border: '1px solid #99f6e4', borderRadius: '0.5rem', padding: '0.75rem 1rem', marginBottom: '1.5rem' }}>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: '#0f766e' }}>
                          📧 Report will be sent to <strong>{selected.email}</strong> and saved to their Medical Records.
                        </p>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Report Title *</label>
                            <input type="text" placeholder="e.g. Blood Test Report" value={reportTitle} onChange={e => setReportTitle(e.target.value)}
                              style={{ width: '100%', padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', color: '#1e293b', outline: 'none', fontSize: '0.875rem' }} />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Report Type</label>
                            <select value={reportType} onChange={e => setReportType(e.target.value)}
                              style={{ width: '100%', padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', color: '#1e293b', outline: 'none', fontSize: '0.875rem' }}>
                              <option>Lab Report</option>
                              <option>Scan Report</option>
                              <option>Prescription</option>
                              <option>Other</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Upload File * (PDF, Image, Word — max 10MB)</label>
                          <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={e => setReportFile(e.target.files[0])}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', fontSize: '0.875rem', cursor: 'pointer' }} />
                          {reportFile && <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#16a34a' }}>✓ {reportFile.name}</p>}
                        </div>

                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Doctor's Notes (optional)</label>
                          <textarea placeholder="Add any notes or instructions for the patient..." value={reportNotes} onChange={e => setReportNotes(e.target.value)} rows="3"
                            style={{ width: '100%', padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', color: '#1e293b', outline: 'none', resize: 'none', fontSize: '0.875rem' }} />
                        </div>

                        <button onClick={handleSendReport} disabled={sending}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.75rem', backgroundColor: sending ? '#99f6e4' : '#0f766e', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 700, cursor: sending ? 'not-allowed' : 'pointer', fontSize: '0.9rem' }}>
                          <Upload size={16} /> {sending ? 'Sending...' : `Send Report to ${selected.name}`}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPatients;
