import React, { useState, useEffect, useContext } from 'react';
import { Search, Plus, Trash2 } from 'lucide-react';
import DoctorSidebar from '../../components/DoctorSidebar';
import api from '../../api';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const statusColor = {
  Unpaid: { bg: '#fee2e2', color: '#991b1b' },
  Partial: { bg: '#fef9c3', color: '#92400e' },
  'Payment Requested': { bg: '#dbeafe', color: '#1d4ed8' },
  Paid: { bg: '#dcfce7', color: '#166534' },
};

const DoctorBilling = () => {
  const { user } = useContext(AuthContext);
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctorId, setDoctorId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    patient: '', dueDate: '', notes: '',
    items: [{ description: '', amount: '' }]
  });

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const docRes = await api.get('/doctors/me', config);
      setDoctorId(docRes.data._id);

      const [billsRes, patientsRes] = await Promise.all([
        api.get('/bills/doctor-bills', config),
        api.get('/doctors/my-patients', config),
      ]);
      setBills(billsRes.data);
      setPatients(patientsRes.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const updateItem = (i, field, val) => {
    const items = [...form.items];
    items[i][field] = val;
    setForm({ ...form, items });
  };

  const addQuickItem = (desc) => {
    setForm({ ...form, items: [...form.items, { description: desc, amount: '' }] });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const items = form.items.filter(i => i.description && i.amount);
    if (!items.length) return toast.error('Add at least one item');
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await api.post('/bills', {
        patient: form.patient,
        doctor: doctorId,
        items: items.map(i => ({ description: i.description, amount: Number(i.amount) })),
        dueDate: form.dueDate || undefined,
        notes: form.notes
      }, config);

      // Notify patient
      await api.post('/notifications', {
        userId: form.patient,
        title: '🧾 New Bill Generated',
        message: `Dr. ${user.name} has generated a bill of ₹${items.reduce((s, i) => s + Number(i.amount), 0).toLocaleString()} for you.`,
        type: 'bill'
      }, config);

      toast.success('Bill created!');
      setShowModal(false);
      setForm({ patient: '', dueDate: '', notes: '', items: [{ description: '', amount: '' }] });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create bill');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this bill?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await api.delete(`/bills/${id}`, config);
      toast.success('Deleted');
      fetchData();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const filtered = bills.filter(b =>
    b.patient?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalBilled = bills.reduce((s, b) => s + b.totalAmount, 0);
  const totalPaid = bills.filter(b => b.status === 'Paid').reduce((s, b) => s + b.totalAmount, 0);
  const totalPending = bills.reduce((s, b) => s + (b.totalAmount - b.paidAmount), 0) - totalPaid;

  return (
    <div className="dashboard-layout">
      <DoctorSidebar activeId="billing" />
      <main className="dashboard-content" style={{ backgroundColor: '#f8fafc', padding: '2rem' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.25rem' }}>Billing</h1>
            <p style={{ color: '#64748b' }}>Manage bills for your patients</p>
          </div>
          <button onClick={() => setShowModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#10b981', color: 'white', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={18} /> Create Bill
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Billed', value: `₹${totalBilled.toLocaleString()}`, color: '#2563eb' },
            { label: 'Collected', value: `₹${totalPaid.toLocaleString()}`, color: '#16a34a' },
            { label: 'Pending', value: `₹${Math.max(0, totalBilled - totalPaid).toLocaleString()}`, color: '#dc2626' },
          ].map((s, i) => (
            <div key={i} style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>{s.label}</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: s.color, margin: 0 }}>{s.value}</h3>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input type="text" placeholder="Search by patient name..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none', color: '#1e293b' }} />
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  {['Patient', 'Items', 'Total', 'Paid', 'Due', 'Status', 'Date', ''].map((h, i) => (
                    <th key={i} style={{ padding: '1rem 1.25rem' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="8" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan="8" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No bills yet. Create one or complete an appointment.</td></tr>
                ) : filtered.map((bill, i) => (
                  <tr key={bill._id} style={{ borderBottom: i === filtered.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#1e293b' }}>{bill.patient?.name}</td>
                    <td style={{ padding: '1rem 1.25rem', color: '#64748b', fontSize: '0.8rem', maxWidth: '150px' }}>
                      {bill.items.map(it => it.description).join(', ')}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>₹{bill.totalAmount.toLocaleString()}</td>
                    <td style={{ padding: '1rem 1.25rem', color: '#16a34a', fontWeight: 600 }}>₹{bill.paidAmount.toLocaleString()}</td>
                    <td style={{ padding: '1rem 1.25rem', color: '#dc2626', fontWeight: 600 }}>₹{(bill.totalAmount - bill.paidAmount).toLocaleString()}</td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: '9999px', backgroundColor: statusColor[bill.status]?.bg || '#f1f5f9', color: statusColor[bill.status]?.color || '#475569' }}>
                        {bill.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: '#64748b', fontSize: '0.875rem' }}>
                      {new Date(bill.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <button onClick={() => handleDelete(bill._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Bill Modal */}
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', width: '90%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1.5rem' }}>Create Bill</h3>
              <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Patient *</label>
                  <select required value={form.patient} onChange={e => setForm({ ...form, patient: e.target.value })}
                    style={{ width: '100%', padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', color: '#1e293b', outline: 'none' }}>
                    <option value="">Select Patient</option>
                    {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.5rem' }}>Quick Add</label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {['Consultation Fee', 'Medicine Charges', 'Test Charges', 'Procedure Fee', 'X-Ray', 'Blood Test'].map(s => (
                      <button key={s} type="button" onClick={() => addQuickItem(s)}
                        style={{ fontSize: '0.72rem', padding: '0.3rem 0.7rem', borderRadius: '9999px', border: '1px solid #bfdbfe', backgroundColor: '#eff6ff', color: '#2563eb', cursor: 'pointer', fontWeight: 500 }}>
                        + {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>Bill Items *</label>
                    <button type="button" onClick={() => setForm({ ...form, items: [...form.items, { description: '', amount: '' }] })}
                      style={{ fontSize: '0.75rem', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>+ Add Item</button>
                  </div>
                  {form.items.map((item, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                      <input placeholder="Description" value={item.description} onChange={e => updateItem(i, 'description', e.target.value)}
                        style={{ padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem' }} />
                      <input type="number" placeholder="₹" min="0" value={item.amount} onChange={e => updateItem(i, 'amount', e.target.value)}
                        style={{ padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', outline: 'none', width: '100px', fontSize: '0.875rem' }} />
                      {form.items.length > 1 && (
                        <button type="button" onClick={() => setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) })}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <div style={{ textAlign: 'right', fontWeight: 700, color: '#1e293b', marginTop: '0.5rem' }}>
                    Total: ₹{form.items.reduce((s, i) => s + (Number(i.amount) || 0), 0).toLocaleString()}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Due Date</label>
                    <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })}
                      style={{ width: '100%', padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Notes</label>
                    <input placeholder="Optional..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                      style={{ width: '100%', padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', outline: 'none' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <button type="button" onClick={() => setShowModal(false)}
                    style={{ padding: '0.625rem 1.25rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button type="submit"
                    style={{ padding: '0.625rem 1.25rem', borderRadius: '0.375rem', border: 'none', backgroundColor: '#10b981', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                    Generate Bill
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default DoctorBilling;
