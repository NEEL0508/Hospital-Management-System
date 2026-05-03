import React, { useState, useEffect, useContext } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const statusColor = {
  Unpaid: { bg: '#fee2e2', color: '#991b1b' },
  Partial: { bg: '#fef9c3', color: '#92400e' },
  'Payment Requested': { bg: '#dbeafe', color: '#1d4ed8' },
  Paid: { bg: '#dcfce7', color: '#166534' },
};

const ManageBills = () => {
  const { user } = useContext(AuthContext);
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [payModal, setPayModal] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [chargeModal, setChargeModal] = useState(null);
  const [newCharge, setNewCharge] = useState({ description: '', amount: '' });

  const [form, setForm] = useState({
    patient: '', doctor: '', dueDate: '', notes: '',
    items: [{ description: '', amount: '' }]
  });

  const config = user ? { headers: { Authorization: `Bearer ${user.token}` } } : {};

  const fetchAll = async () => {
    if (!user) return;
    try {
      const cfg = { headers: { Authorization: `Bearer ${user.token}` } };
      const [billsRes, patientsRes, doctorsRes] = await Promise.all([
        api.get('/bills', cfg),
        api.get('/admin/patients', cfg),
        api.get('/doctors'),
      ]);
      setBills(billsRes.data);
      setPatients(patientsRes.data);
      setDoctors(doctorsRes.data);
    } catch (err) {
      console.error('Billing fetch error:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user) fetchAll(); }, [user]);

  const addItem = () => setForm({ ...form, items: [...form.items, { description: '', amount: '' }] });
  const removeItem = (i) => setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) });
  const updateItem = (i, field, val) => {
    const items = [...form.items];
    items[i][field] = val;
    setForm({ ...form, items });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const items = form.items.map(it => ({ description: it.description, amount: Number(it.amount) }));
      await api.post('/bills', { ...form, items }, config);
      toast.success('Bill created!');
      setShowModal(false);
      setForm({ patient: '', doctor: '', dueDate: '', notes: '', items: [{ description: '', amount: '' }] });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create bill');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this bill?')) return;
    await api.delete(`/bills/${id}`, config);
    toast.success('Bill deleted');
    fetchAll();
  };

  const handlePayment = async () => {
    try {
      await api.put(`/bills/${payModal._id}`, { paidAmount: Number(payAmount) }, config);
      toast.success('Payment updated!');
      setPayModal(null);
      setPayAmount('');
      fetchAll();
    } catch {
      toast.error('Failed to update payment');
    }
  };

  const handleAddCharge = async () => {
    if (!newCharge.description || !newCharge.amount) return toast.error('Fill description and amount');
    try {
      const updatedItems = [...chargeModal.items, { description: newCharge.description, amount: Number(newCharge.amount) }];
      const newTotal = updatedItems.reduce((s, i) => s + i.amount, 0);
      await api.put(`/bills/${chargeModal._id}`, {
        items: updatedItems,
        totalAmount: newTotal,
        status: chargeModal.status
      }, config);
      toast.success('Charge added!');
      setChargeModal(null);
      setNewCharge({ description: '', amount: '' });
      fetchAll();
    } catch {
      toast.error('Failed to add charge');
    }
  };

  const filtered = bills.filter(b =>
    b.patient?.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.patient?.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = bills.filter(b => b.status === 'Paid').reduce((s, b) => s + b.totalAmount, 0);
  const pending = bills.filter(b => b.status !== 'Paid').reduce((s, b) => s + (b.totalAmount - b.paidAmount), 0);

  return (
    <div className="dashboard-layout">
      <AdminSidebar activeId="billing" />
      <main className="dashboard-content" style={{ backgroundColor: '#f8fafc', padding: '2rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1e293b' }}>Billing Management</h1>
            <p style={{ color: '#64748b' }}>Create and manage patient bills</p>
          </div>
          <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={18} /> Create Bill
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Bills', value: bills.length, bg: '#eff6ff', color: '#2563eb' },
            { label: 'Total Collected', value: `₹${totalRevenue.toLocaleString()}`, bg: '#f0fdf4', color: '#16a34a' },
            { label: 'Pending Amount', value: `₹${pending.toLocaleString()}`, bg: '#fef9c3', color: '#ca8a04' },
          ].map((s, i) => (
            <div key={i} style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>{s.label}</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: s.color }}>{s.value}</h3>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input type="text" placeholder="Search by patient name or email..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none', color: '#1e293b' }} />
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  {['Patient', 'Doctor', 'Total', 'Paid', 'Due', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '1rem 1.25rem' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="8" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan="8" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No bills found.</td></tr>
                ) : filtered.map((bill, i) => (
                  <tr key={bill._id} style={{ borderBottom: i === filtered.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{bill.patient?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{bill.patient?.email}</div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: '#475569', fontSize: '0.875rem' }}>
                      {bill.doctor?.user?.name ? `Dr. ${bill.doctor.user.name}` : 'N/A'}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#1e293b' }}>₹{bill.totalAmount.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '1rem 1.25rem', color: '#16a34a', fontWeight: 600 }}>₹{bill.paidAmount.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '1rem 1.25rem', color: '#dc2626', fontWeight: 600 }}>₹{(bill.totalAmount - bill.paidAmount).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: '9999px', backgroundColor: statusColor[bill.status]?.bg, color: statusColor[bill.status]?.color }}>
                        {bill.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: '#64748b', fontSize: '0.875rem' }}>
                      {new Date(bill.createdAt).toISOString().split('T')[0]}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {bill.status !== 'Paid' && (
                          <button onClick={() => { setPayModal(bill); setPayAmount(bill.paidAmount); }}
                            style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '0.375rem', padding: '0.35rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                            Pay
                          </button>
                        )}
                        {bill.status !== 'Paid' && (
                          <button onClick={() => setChargeModal(bill)}
                            style={{ backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: '0.375rem', padding: '0.35rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                            + Charge
                          </button>
                        )}
                        <button onClick={() => handleDelete(bill._id)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Bill Modal */}
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1.5rem' }}>Create New Bill</h3>
              <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Patient *</label>
                    <select required value={form.patient} onChange={e => setForm({ ...form, patient: e.target.value })}
                      style={{ width: '100%', padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', color: '#1e293b', outline: 'none' }}>
                      <option value="">Select Patient</option>
                      {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Doctor</label>
                    <select value={form.doctor} onChange={e => setForm({ ...form, doctor: e.target.value })}
                      style={{ width: '100%', padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', color: '#1e293b', outline: 'none' }}>
                      <option value="">Select Doctor</option>
                      {doctors.map(d => <option key={d._id} value={d._id}>Dr. {d.user?.name}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Due Date</label>
                  <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })}
                    style={{ width: '100%', padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', color: '#1e293b', outline: 'none' }} />
                </div>

                {/* Bill Items */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>Bill Items *</label>
                    <button type="button" onClick={addItem}
                      style={{ fontSize: '0.75rem', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>+ Add Item</button>
                  </div>
                  {form.items.map((item, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                      <input placeholder="Description (e.g. Consultation)" required value={item.description} onChange={e => updateItem(i, 'description', e.target.value)}
                        style={{ padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', color: '#1e293b', outline: 'none' }} />
                      <input type="number" placeholder="₹ Amount" required min="0" value={item.amount} onChange={e => updateItem(i, 'amount', e.target.value)}
                        style={{ padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', color: '#1e293b', outline: 'none', width: '110px' }} />
                      {form.items.length > 1 && (
                        <button type="button" onClick={() => removeItem(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <div style={{ textAlign: 'right', fontWeight: 700, color: '#1e293b', marginTop: '0.5rem' }}>
                    Total: ₹{form.items.reduce((s, it) => s + (Number(it.amount) || 0), 0).toLocaleString()}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Notes</label>
                  <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows="2"
                    style={{ width: '100%', padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', color: '#1e293b', outline: 'none', resize: 'none' }} />
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <button type="button" onClick={() => setShowModal(false)}
                    style={{ padding: '0.625rem 1.25rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button type="submit"
                    style={{ padding: '0.625rem 1.25rem', borderRadius: '0.375rem', border: 'none', backgroundColor: '#2563eb', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                    Create Bill
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Charge Modal */}
        {chargeModal && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', width: '90%', maxWidth: '480px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>Add Extra Charge</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
                Patient: <strong>{chargeModal.patient?.name}</strong> | Current Total: <strong>₹{chargeModal.totalAmount.toLocaleString('en-IN')}</strong>
              </p>

              {/* Existing items */}
              <div style={{ background: '#f8fafc', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem' }}>EXISTING ITEMS</p>
                {chargeModal.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#475569', marginBottom: '0.25rem' }}>
                    <span>{item.description}</span>
                    <span style={{ fontWeight: 600 }}>₹{item.amount.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem', marginBottom: '1.5rem', alignItems: 'end' }}>
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>New Charge Description *</label>
                  <input placeholder="e.g. Lab Test, Medicine" value={newCharge.description} onChange={e => setNewCharge({ ...newCharge, description: e.target.value })}
                    style={{ width: '100%', padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Amount (₹) *</label>
                  <input type="number" min="0" placeholder="0" value={newCharge.amount} onChange={e => setNewCharge({ ...newCharge, amount: e.target.value })}
                    style={{ width: '110px', padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', outline: 'none' }} />
                </div>
              </div>

              {newCharge.amount && (
                <div style={{ background: '#fef9c3', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '1rem', fontSize: '0.875rem', color: '#92400e' }}>
                  New Total: <strong>₹{(chargeModal.totalAmount + Number(newCharge.amount)).toLocaleString('en-IN')}</strong>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button onClick={() => { setChargeModal(null); setNewCharge({ description: '', amount: '' }); }}
                  style={{ padding: '0.625rem 1.25rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button onClick={handleAddCharge}
                  style={{ padding: '0.625rem 1.25rem', borderRadius: '0.375rem', border: 'none', backgroundColor: '#f59e0b', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                  Add Charge
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {payModal && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', width: '90%', maxWidth: '400px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>Update Payment</h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Patient: <strong>{payModal.patient?.name}</strong> | Total: <strong>₹{payModal.totalAmount.toLocaleString('en-IN')}</strong>
              </p>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Amount Paid (₹)</label>
              <input type="number" min="0" max={payModal.totalAmount} value={payAmount} onChange={e => setPayAmount(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', color: '#1e293b', outline: 'none', marginBottom: '1.5rem' }} />
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button onClick={() => setPayModal(null)}
                  style={{ padding: '0.625rem 1.25rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button onClick={handlePayment}
                  style={{ padding: '0.625rem 1.25rem', borderRadius: '0.375rem', border: 'none', backgroundColor: '#16a34a', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                  Save Payment
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default ManageBills;
