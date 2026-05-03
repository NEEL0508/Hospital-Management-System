import React, { useState, useEffect, useContext } from 'react';
import { Search, Mail, Phone, Eye, X, Calendar, FileText, CreditCard, Activity, User, Droplet, MapPin, ChevronDown, ChevronUp, Download } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
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

const TABS = ['Appointments', 'Medical Records', 'Bills'];

const ManagePatients = () => {
  const { user } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState(null);
  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Appointments');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data } = await api.get('/admin/patients', { headers: { Authorization: `Bearer ${user.token}` } });
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
      const { data } = await api.get(`/admin/patients/${pt._id}/details`, { headers: { Authorization: `Bearer ${user.token}` } });
      setDetails(data);
    } catch {
      toast.error('Failed to load patient details');
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeModal = () => { setSelected(null); setDetails(null); };

  const filtered = patients.filter(pt =>
    pt.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pt.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <AdminSidebar activeId="patients" />

      <main className="dashboard-content" style={{ backgroundColor: '#f8fafc', padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.25rem' }}>Manage Patients</h1>
          <p style={{ color: '#64748b' }}>View patient information, appointments, records and bills</p>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          {/* Search */}
          <div style={{ padding: '1.25rem', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input type="text" placeholder="Search patients by name or email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none', color: '#1e293b' }} />
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {['Patient', 'Blood Group', 'Contact', 'Registration Date', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '1.25rem' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading patients...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No patients found.</td></tr>
                ) : filtered.map((pt, i) => (
                  <tr key={pt._id} style={{ borderBottom: i === filtered.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1.5rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <User size={18} color="#2563eb" />
                        </div>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{pt.name}</div>
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem 1.25rem' }}>
                      {pt.bloodGroup ? (
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: '9999px', backgroundColor: '#fee2e2', color: '#ef4444' }}>
                          {pt.bloodGroup}
                        </span>
                      ) : <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>N/A</span>}
                    </td>
                    <td style={{ padding: '1.5rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.75rem', marginBottom: '0.375rem' }}>
                        <Mail size={12} color="#94a3b8" /> {pt.email}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.75rem' }}>
                        <Phone size={12} color="#94a3b8" /> {pt.phone || 'N/A'}
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem 1.25rem', color: '#475569', fontSize: '0.875rem' }}>
                      {new Date(pt.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td style={{ padding: '1.5rem 1.25rem' }}>
                      <button onClick={() => openDetails(pt)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '0.375rem', padding: '0.45rem 0.9rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                        <Eye size={14} /> View Details
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

            {/* Modal Header */}
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={24} color="#2563eb" />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b' }}>{selected.name}</h2>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>Patient since {new Date(selected.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
              </div>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '0.25rem' }}>
                <X size={22} />
              </button>
            </div>

            {/* Patient Info */}
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {[
                  { icon: <Mail size={14} />, label: 'Email', value: selected.email },
                  { icon: <Phone size={14} />, label: 'Phone', value: selected.phone || 'N/A' },
                  { icon: <Droplet size={14} />, label: 'Blood Group', value: selected.bloodGroup || 'N/A' },
                ].map((item, i) => (
                  <div key={i} style={{ backgroundColor: '#f8fafc', borderRadius: '0.5rem', padding: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#94a3b8', fontSize: '0.7rem', marginBottom: '0.25rem' }}>{item.icon} {item.label}</div>
                    <p style={{ margin: 0, fontWeight: 600, color: '#1e293b', fontSize: '0.875rem', wordBreak: 'break-all' }}>{item.value}</p>
                  </div>
                ))}
              </div>
              {selected.address && (
                <div style={{ marginTop: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', padding: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <MapPin size={14} color="#94a3b8" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <p style={{ margin: 0, color: '#475569', fontSize: '0.875rem' }}>{selected.address}</p>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div style={{ padding: '0 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '0' }}>
              {TABS.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{ padding: '1rem 1.25rem', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', color: activeTab === tab ? '#2563eb' : '#64748b', borderBottom: activeTab === tab ? '2px solid #2563eb' : '2px solid transparent', marginBottom: '-1px' }}>
                  {tab}
                  {details && (
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
              ) : !details ? null : (

                <>
                  {/* Appointments Tab */}
                  {activeTab === 'Appointments' && (
                    <div>
                      {details.appointments.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                          <Calendar size={40} style={{ margin: '0 auto 0.75rem', display: 'block', opacity: 0.4 }} />
                          No appointments found
                        </div>
                      ) : details.appointments.map((apt, i) => (
                        <div key={apt._id} style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem', marginBottom: '0.75rem', backgroundColor: '#fafafa' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <div>
                              <p style={{ margin: 0, fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>
                                Dr. {apt.doctor?.user?.name || 'N/A'} — {apt.department}
                              </p>
                              <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                                {new Date(apt.appointmentDate).toLocaleDateString('en-IN')} at {apt.appointmentTime}
                              </p>
                            </div>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '9999px', backgroundColor: statusColor[apt.status]?.bg || '#f1f5f9', color: statusColor[apt.status]?.color || '#475569' }}>
                              {apt.status}
                            </span>
                          </div>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569' }}>
                            <strong>Reason:</strong> {apt.reasonForVisit}
                          </p>
                          {apt.prescription && (
                            <div style={{ marginTop: '0.5rem', backgroundColor: '#f0fdf4', borderRadius: '0.375rem', padding: '0.5rem 0.75rem' }}>
                              <p style={{ margin: 0, fontSize: '0.78rem', color: '#166534' }}><strong>Prescription:</strong> {apt.prescription}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Medical Records Tab */}
                  {activeTab === 'Medical Records' && (
                    <div>
                      {details.medicalRecords.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                          <FileText size={40} style={{ margin: '0 auto 0.75rem', display: 'block', opacity: 0.4 }} />
                          No medical records found
                        </div>
                      ) : details.medicalRecords.map((rec) => (
                        <div key={rec._id} style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem', marginBottom: '0.75rem', backgroundColor: '#fafafa' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                              <p style={{ margin: 0, fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>{rec.title}</p>
                              <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                                {rec.type} &bull; Dr. {rec.doctor?.user?.name || 'N/A'} &bull; {new Date(rec.date || rec.createdAt).toLocaleDateString('en-IN')}
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

                  {/* Bills Tab */}
                  {activeTab === 'Bills' && (
                    <div>
                      {details.bills.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                          <CreditCard size={40} style={{ margin: '0 auto 0.75rem', display: 'block', opacity: 0.4 }} />
                          No bills found
                        </div>
                      ) : details.bills.map((bill) => (
                        <div key={bill._id} style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem', marginBottom: '0.75rem', backgroundColor: '#fafafa' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <div>
                              <p style={{ margin: 0, fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>
                                Dr. {bill.doctor?.user?.name || 'N/A'}
                              </p>
                              <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                                {new Date(bill.createdAt).toLocaleDateString('en-IN')}
                              </p>
                            </div>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '9999px', backgroundColor: billStatusColor[bill.status]?.bg || '#f1f5f9', color: billStatusColor[bill.status]?.color || '#475569' }}>
                              {bill.status}
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
                            <span style={{ color: '#64748b' }}>Total: <strong style={{ color: '#1e293b' }}>₹{bill.totalAmount.toLocaleString('en-IN')}</strong></span>
                            <span style={{ color: '#64748b' }}>Paid: <strong style={{ color: '#16a34a' }}>₹{bill.paidAmount.toLocaleString('en-IN')}</strong></span>
                            {bill.totalAmount - bill.paidAmount > 0 && (
                              <span style={{ color: '#64748b' }}>Due: <strong style={{ color: '#dc2626' }}>₹{(bill.totalAmount - bill.paidAmount).toLocaleString('en-IN')}</strong></span>
                            )}
                          </div>
                          {bill.items?.length > 0 && (
                            <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: '#64748b' }}>
                              {bill.items.map((it, i) => (
                                <span key={i}>{it.description} (₹{it.amount.toLocaleString('en-IN')}){i < bill.items.length - 1 ? ', ' : ''}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
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

export default ManagePatients;
