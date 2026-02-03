import React, { useState, useEffect, useContext } from 'react';
import { Search, User, Mail, Phone, Droplet, Calendar, Clock, FileText, Upload, X } from 'lucide-react';
import DoctorSidebar from '../../components/DoctorSidebar';
import api from '../../api';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const DoctorPatients = () => {
  const { user } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [reportFile, setReportFile] = useState(null);
  const [reportTitle, setReportTitle] = useState('');
  const [reportNotes, setReportNotes] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await api.get('/doctors/my-patients', config);
        setPatients(data);
      } catch {
        toast.error('Failed to load patients');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetch();
  }, [user]);

  const filtered = patients.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

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

      await api.post('/reports/send', formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success(`Report sent to ${selected.email}`);
      setReportFile(null);
      setReportTitle('');
      setReportNotes('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send report');
    } finally {
      setSending(false);
    }
  };

  const closeModal = () => {
    setSelected(null);
    setReportFile(null);
    setReportTitle('');
    setReportNotes('');
  };

  const statusColor = {
    Completed: { bg: '#dcfce7', color: '#166534' },
    Approved: { bg: '#dbeafe', color: '#1d4ed8' },
    Pending: { bg: '#fef9c3', color: '#92400e' },
    Cancelled: { bg: '#fee2e2', color: '#991b1b' },
  };

  return (
    <div className="dashboard-layout">
      <DoctorSidebar activeId="patients" />
      <main className="dashboard-content" style={{ backgroundColor: '#f8fafc', padding: '2rem' }}>

        {/* Header */}
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.25rem' }}>My Patients</h1>
          <p style={{ color: '#64748b' }}>All patients who have visited or booked with you</p>
        </header>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Patients', value: patients.length, color: '#2563eb' },
            { label: 'Completed Visits', value: patients.filter(p => p.lastStatus === 'Completed').length, color: '#16a34a' },
            { label: 'Pending', value: patients.filter(p => p.lastStatus === 'Pending' || p.lastStatus === 'Approved').length, color: '#f59e0b' },
          ].map((s, i) => (
            <div key={i} style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>{s.label}</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: s.color, margin: 0 }}>{s.value}</h3>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none', color: '#1e293b' }} />
            </div>
          </div>

          {/* Table */}
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
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#1e293b', textAlign: 'center' }}>
                      {pt.totalAppointments}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: '#475569', fontSize: '0.875rem' }}>
                      {new Date(pt.lastVisit).toLocaleDateString('en-IN')}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.75rem', borderRadius: '9999px', backgroundColor: statusColor[pt.lastStatus]?.bg || '#f1f5f9', color: statusColor[pt.lastStatus]?.color || '#475569' }}>
                        {pt.lastStatus}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <button onClick={() => setSelected(pt)}
                        style={{ backgroundColor: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '0.375rem', padding: '0.4rem 0.75rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Patient Detail Modal */}
        {selected && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', width: '90%', maxWidth: '560px', boxShadow: '0 20px 25px rgba(0,0,0,0.1)', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Patient Details</h3>
                <button onClick={closeModal} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={28} color="#2563eb" />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontWeight: 700, color: '#1e293b', fontSize: '1.1rem' }}>{selected.name}</h4>
                  <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: '0.875rem' }}>Patient since {new Date(selected.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                {[
                  { icon: <Mail size={16} />, label: 'Email', value: selected.email },
                  { icon: <Phone size={16} />, label: 'Phone', value: selected.phone || 'N/A' },
                  { icon: <Droplet size={16} />, label: 'Blood Group', value: selected.bloodGroup || 'N/A' },
                  { icon: <Calendar size={16} />, label: 'Total Visits', value: selected.totalAppointments },
                  { icon: <Clock size={16} />, label: 'Last Visit', value: new Date(selected.lastVisit).toLocaleDateString('en-IN') },
                  { icon: <FileText size={16} />, label: 'Last Status', value: selected.lastStatus },
                ].map((item, i) => (
                  <div key={i} style={{ backgroundColor: '#f8fafc', borderRadius: '0.5rem', padding: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                      {item.icon} {item.label}
                    </div>
                    <p style={{ margin: 0, fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }}>{item.value}</p>
                  </div>
                ))}
              </div>

              {selected.address && (
                <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '1rem' }}>
                  <p style={{ margin: '0 0 4px', color: '#94a3b8', fontSize: '0.75rem' }}>Address</p>
                  <p style={{ margin: 0, color: '#1e293b', fontSize: '0.875rem' }}>{selected.address}</p>
                </div>
              )}

              {selected.lastReason && (
                <div style={{ backgroundColor: '#fef9c3', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '1.5rem' }}>
                  <p style={{ margin: '0 0 4px', color: '#92400e', fontSize: '0.75rem', fontWeight: 600 }}>Last Reason for Visit</p>
                  <p style={{ margin: 0, color: '#78350f', fontSize: '0.875rem' }}>{selected.lastReason}</p>
                </div>
              )}

              {/* Report Upload Section */}
              <div style={{ borderTop: '2px dashed #e2e8f0', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Upload size={18} color="#0f766e" />
                  <h4 style={{ margin: 0, fontWeight: 700, color: '#0f766e', fontSize: '1rem' }}>Send Report to Patient</h4>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Report Title *</label>
                    <input type="text" placeholder="e.g. Blood Test Report, X-Ray Report" value={reportTitle} onChange={e => setReportTitle(e.target.value)}
                      style={{ width: '100%', padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', color: '#1e293b', outline: 'none', fontSize: '0.875rem' }} />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Upload File * (PDF, Image, Word — max 10MB)</label>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={e => setReportFile(e.target.files[0])}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', fontSize: '0.875rem', cursor: 'pointer' }} />
                    {reportFile && (
                      <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#16a34a' }}>✓ {reportFile.name}</p>
                    )}
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Doctor's Notes (optional)</label>
                    <textarea placeholder="Add any notes or instructions for the patient..." value={reportNotes} onChange={e => setReportNotes(e.target.value)} rows="3"
                      style={{ width: '100%', padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', color: '#1e293b', outline: 'none', resize: 'none', fontSize: '0.875rem' }} />
                  </div>

                  <button onClick={handleSendReport} disabled={sending}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.75rem', backgroundColor: sending ? '#99f6e4' : '#0f766e', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 700, cursor: sending ? 'not-allowed' : 'pointer', fontSize: '0.9rem' }}>
                    <Upload size={16} /> {sending ? 'Sending...' : `Send Report to ${selected.email}`}
                  </button>
                </div>
              </div>

              <button onClick={closeModal}
                style={{ width: '100%', marginTop: '1rem', padding: '0.625rem', backgroundColor: 'white', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}>
                Close
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default DoctorPatients;
