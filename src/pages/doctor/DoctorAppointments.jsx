import React, { useState, useEffect, useContext } from 'react';
import { Search, ChevronDown, CheckCircle, XCircle, Plus, Trash2 } from 'lucide-react';
import DoctorSidebar from '../../components/DoctorSidebar';
import api from '../../api';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const DoctorAppointments = () => {
  const { user } = useContext(AuthContext);
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [prescriptionText, setPrescriptionText] = useState('');
  const [showBillModal, setShowBillModal] = useState(false);
  const [billItems, setBillItems] = useState([{ description: '', amount: '' }]);
  const [billNotes, setBillNotes] = useState('');
  const [billDueDate, setBillDueDate] = useState('');
  const [completedApt, setCompletedApt] = useState(null);

  const fetchAppointments = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await api.get('/appointments', config);
      setAppointmentsData(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load appointments');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchAppointments();
  }, [user]);

  const handleStatusUpdate = async (id, status, prescription = '') => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await api.put(`/appointments/${id}/status`, { status, prescription }, config);
      toast.success(`Appointment ${status}`);
      fetchAppointments();
      setShowPrescriptionModal(false);
      setPrescriptionText('');
      // After completing, open bill modal
      if (status === 'Completed') {
        setCompletedApt(selectedAppointment);
        setShowBillModal(true);
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleCreateBill = async () => {
    const items = billItems.filter(i => i.description && i.amount);
    if (items.length === 0) {
      toast.error('Add at least one bill item');
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const docRes = await api.get('/doctors/me', config);
      await api.post('/bills', {
        patient: completedApt.patient._id,
        doctor: docRes.data._id,
        appointment: completedApt._id,
        items: items.map(i => ({ description: i.description, amount: Number(i.amount) })),
        dueDate: billDueDate || undefined,
        notes: billNotes
      }, config);

      // Notify patient
      await api.post('/notifications', {
        userId: completedApt.patient._id,
        title: '🧾 New Bill Generated',
        message: `Dr. ${user.name} has generated a bill for your appointment on ${new Date(completedApt.appointmentDate).toLocaleDateString('en-IN')}.`,
        type: 'bill'
      }, config);

      toast.success('Bill created!');
      setShowBillModal(false);
      setBillItems([{ description: '', amount: '' }]);
      setBillNotes('');
      setBillDueDate('');
      setCompletedApt(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create bill');
    }
  };

  const openPrescriptionModal = (apt) => {
    setSelectedAppointment(apt);
    setShowPrescriptionModal(true);
  };

  const filteredAppointments = appointmentsData.filter(apt => {
    const matchesSearch = apt.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="dashboard-layout">
      <DoctorSidebar activeId="appointments" />

      {/* Main Content */}
      <main className="dashboard-content">
        <header className="dashboard-welcome" style={{ marginBottom: '1.5rem' }}>
          <h1 className="welcome-title text-slate-800 font-bold" style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>My Appointments</h1>
          <p className="welcome-subtitle text-slate-500" style={{ fontSize: '1rem' }}>Manage your scheduled appointments</p>
        </header>

        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          {/* Controls Bar */}
          <div style={{ display: 'flex', gap: '1rem', padding: '1.25rem', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type="text" 
                placeholder="Search by patient name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', outline: 'none', color: '#475569', backgroundColor: '#f8fafc' }}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#475569', fontWeight: 500, cursor: 'pointer' }}>
                {statusFilter === 'All' ? 'All Status' : statusFilter} <ChevronDown size={16} />
              </button>
              {showStatusMenu && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '0.375rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', zIndex: 10, minWidth: '150px' }}>
                  {['All', 'Pending', 'Approved', 'Completed', 'Cancelled'].map(status => (
                    <div 
                      key={status}
                      onClick={() => { setStatusFilter(status); setShowStatusMenu(false); }}
                      style={{ padding: '0.6rem 1rem', cursor: 'pointer', color: '#475569', fontSize: '0.875rem', borderBottom: status === 'Cancelled' ? 'none' : '1px solid #f1f5f9' }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#f8fafc'}
                      onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      {status}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '1rem 1.25rem' }}>Patient</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Reason</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Date & Time</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Status</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading appointments...</td></tr>
                ) : filteredAppointments.length === 0 ? (
                  <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No appointments found for the selected criteria.</td></tr>
                ) : filteredAppointments.map((apt) => (
                  <tr key={apt._id} style={{ borderBottom: '1px solid #f1f5f9', color: '#1e293b' }}>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>{apt.patient?.name || 'Unknown'}</td>
                    <td style={{ padding: '1rem 1.25rem', color: '#64748b' }}>{apt.reasonForVisit} ({apt.department})</td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 600 }}>{new Date(apt.appointmentDate).toLocaleDateString()}</div>
                      <div style={{ color: '#64748b', fontSize: '0.875rem' }}>{apt.appointmentTime}</div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{ 
                        backgroundColor: apt.status === 'Approved' ? '#dcfce7' : apt.status === 'Cancelled' ? '#fee2e2' : apt.status === 'Completed' ? '#d1fae5' : '#fef9c3', 
                        color: apt.status === 'Approved' ? '#16a34a' : apt.status === 'Cancelled' ? '#991b1b' : apt.status === 'Completed' ? '#059669' : '#ca8a04', 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '9999px', 
                        fontSize: '0.75rem', 
                        fontWeight: 600,
                        textTransform: 'capitalize'
                      }}>{apt.status}</span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      {apt.status === 'Pending' && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                          <button onClick={() => handleStatusUpdate(apt._id, 'Approved')} style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer' }}><CheckCircle size={20} /></button>
                          <button onClick={() => handleStatusUpdate(apt._id, 'Cancelled')} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><XCircle size={20} /></button>
                        </div>
                      )}
                      {apt.status === 'Approved' && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                          <button onClick={() => openPrescriptionModal(apt)} style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#3b82f6', border: 'none', borderRadius: '0.375rem', padding: '0.4rem 0.75rem', color: 'white', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s' }}>Mark Completed</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Prescription Modal */}
          {showPrescriptionModal && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.75rem', width: '90%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>Add Prescription</h3>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>Enter the prescription details for <strong>{selectedAppointment?.patient?.name}</strong> to complete the appointment.</p>
                
                <textarea 
                  value={prescriptionText}
                  onChange={(e) => setPrescriptionText(e.target.value)}
                  placeholder="Type medicines, dosage, and instructions here..."
                  style={{ width: '100%', height: '150px', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', outline: 'none', resize: 'none', fontSize: '0.875rem', color: '#1e293b', marginBottom: '1.5rem' }}
                />

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={() => setShowPrescriptionModal(false)}
                    style={{ padding: '0.6rem 1.25rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(selectedAppointment._id, 'Completed', prescriptionText)}
                    style={{ padding: '0.6rem 1.25rem', borderRadius: '0.375rem', border: 'none', backgroundColor: '#10b981', color: 'white', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Save & Complete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{ padding: '1.5rem', textAlign: 'center', color: '#cbd5e1', fontSize: '0.875rem' }}>
            ... No more recent appointments ...
          </div>
        </div>

        {/* Bill Generate Modal */}
        {showBillModal && completedApt && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', width: '90%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>Generate Bill</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>
                Patient: <strong>{completedApt.patient?.name}</strong> &bull; {completedApt.department}
              </p>

              {/* Bill Items */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>Bill Items *</label>
                  <button type="button" onClick={() => setBillItems([...billItems, { description: '', amount: '' }])}
                    style={{ fontSize: '0.75rem', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                    + Add Item
                  </button>
                </div>

                {/* Default items suggestion */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  {['Consultation Fee', 'Medicine Charges', 'Test Charges', 'Procedure Fee'].map(s => (
                    <button key={s} type="button"
                      onClick={() => setBillItems([...billItems, { description: s, amount: '' }])}
                      style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem', borderRadius: '9999px', border: '1px solid #bfdbfe', backgroundColor: '#eff6ff', color: '#2563eb', cursor: 'pointer', fontWeight: 500 }}>
                      + {s}
                    </button>
                  ))}
                </div>

                {billItems.map((item, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                    <input placeholder="Description" value={item.description}
                      onChange={e => { const arr = [...billItems]; arr[i].description = e.target.value; setBillItems(arr); }}
                      style={{ padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem' }} />
                    <input type="number" placeholder="₹ Amount" min="0" value={item.amount}
                      onChange={e => { const arr = [...billItems]; arr[i].amount = e.target.value; setBillItems(arr); }}
                      style={{ padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', outline: 'none', width: '110px', fontSize: '0.875rem' }} />
                    {billItems.length > 1 && (
                      <button type="button" onClick={() => setBillItems(billItems.filter((_, idx) => idx !== i))}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}

                <div style={{ textAlign: 'right', fontWeight: 700, color: '#1e293b', marginTop: '0.5rem', fontSize: '0.95rem' }}>
                  Total: ₹{billItems.reduce((s, i) => s + (Number(i.amount) || 0), 0).toLocaleString()}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Due Date</label>
                  <input type="date" value={billDueDate} onChange={e => setBillDueDate(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Notes</label>
                  <input placeholder="Optional notes..." value={billNotes} onChange={e => setBillNotes(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button onClick={() => { setShowBillModal(false); setCompletedApt(null); }}
                  style={{ padding: '0.6rem 1.25rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>
                  Skip
                </button>
                <button onClick={handleCreateBill}
                  style={{ padding: '0.6rem 1.25rem', borderRadius: '0.375rem', border: 'none', backgroundColor: '#2563eb', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                  Generate Bill
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DoctorAppointments;
