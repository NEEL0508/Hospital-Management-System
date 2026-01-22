import React, { useState, useEffect, useContext } from 'react';
import { FileText, CheckCircle2, Clock, AlertCircle, CreditCard } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const statusStyle = {
  Unpaid: { bg: '#fee2e2', color: '#991b1b', icon: <AlertCircle size={14} /> },
  Partial: { bg: '#fef9c3', color: '#92400e', icon: <Clock size={14} /> },
  'Payment Requested': { bg: '#dbeafe', color: '#1d4ed8', icon: <Clock size={14} /> },
  Paid: { bg: '#dcfce7', color: '#166634', icon: <CheckCircle2 size={14} /> },
};

const MyBills = () => {
  const { user } = useContext(AuthContext);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(null);

  const fetchBills = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await api.get('/bills/my-bills', config);
      setBills(data);
    } catch {
      toast.error('Failed to load bills');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user) fetchBills(); }, [user]);

  const handlePay = async (bill) => {
    if (!window.confirm(`Payment request of ₹${(bill.totalAmount - bill.paidAmount).toLocaleString()} submit karein? Admin ko notification jayegi.`)) return;
    setPaying(bill._id);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await api.post(`/bills/${bill._id}/pay`, {}, config);
      toast.success('Payment request sent! Admin will verify and update your bill status.');
      fetchBills();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally {
      setPaying(null);
    }
  };

  const totalDue = bills.filter(b => b.status !== 'Paid').reduce((s, b) => s + (b.totalAmount - b.paidAmount), 0);

  return (
    <div className="dashboard-layout">
      <Sidebar activeId="bills" />
      <main className="dashboard-content">
        <header className="dashboard-welcome">
          <h1 className="welcome-title">My Bills</h1>
          <p className="welcome-subtitle">View your billing and payment history</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Bills', value: bills.length, color: '#2563eb' },
            { label: 'Paid', value: bills.filter(b => b.status === 'Paid').length, color: '#16a34a' },
            { label: 'Amount Due', value: `₹${totalDue.toLocaleString()}`, color: '#dc2626' },
          ].map((s, i) => (
            <div key={i} style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>{s.label}</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: s.color }}>{s.value}</h3>
            </div>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading bills...</div>
        ) : bills.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
            <FileText size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem' }} />
            <p style={{ color: '#64748b' }}>No bills found.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {bills.map(bill => (
              <div key={bill._id} style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>
                      {bill.doctor?.user?.name ? `Dr. ${bill.doctor.user.name}` : 'Hospital Bill'}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      {bill.appointment?.department || 'General'} &bull; {new Date(bill.createdAt).toISOString().split('T')[0]}
                    </p>
                  </div>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, padding: '0.3rem 0.75rem', borderRadius: '9999px', backgroundColor: statusStyle[bill.status]?.bg, color: statusStyle[bill.status]?.color }}>
                    {statusStyle[bill.status]?.icon} {bill.status}
                  </span>
                </div>

                <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem' }}>
                  {bill.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#475569', marginBottom: i < bill.items.length - 1 ? '0.5rem' : 0 }}>
                      <span>{item.description}</span>
                      <span style={{ fontWeight: 600 }}>₹{item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', flexWrap: 'wrap' }}>
                    <span style={{ color: '#64748b' }}>Total: <strong style={{ color: '#1e293b' }}>₹{bill.totalAmount.toLocaleString()}</strong></span>
                    <span style={{ color: '#64748b' }}>Paid: <strong style={{ color: '#16a34a' }}>₹{bill.paidAmount.toLocaleString()}</strong></span>
                    {bill.totalAmount - bill.paidAmount > 0 && (
                      <span style={{ color: '#64748b' }}>Due: <strong style={{ color: '#dc2626' }}>₹{(bill.totalAmount - bill.paidAmount).toLocaleString()}</strong></span>
                    )}
                    {bill.dueDate && (
                      <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Due by: {new Date(bill.dueDate).toISOString().split('T')[0]}</span>
                    )}
                  </div>
                  {bill.status !== 'Paid' && bill.status !== 'Payment Requested' && (
                    <button
                      onClick={() => handlePay(bill)}
                      disabled={paying === bill._id}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: paying === bill._id ? '#93c5fd' : '#2563eb', color: 'white', border: 'none', borderRadius: '0.5rem', padding: '0.6rem 1.25rem', fontWeight: 600, fontSize: '0.875rem', cursor: paying === bill._id ? 'not-allowed' : 'pointer' }}>
                      <CreditCard size={16} />
                      {paying === bill._id ? 'Sending...' : `Pay ₹${(bill.totalAmount - bill.paidAmount).toLocaleString()}`}
                    </button>
                  )}
                  {bill.status === 'Payment Requested' && (
                    <span style={{ fontSize: '0.8rem', color: '#1d4ed8', fontWeight: 600, backgroundColor: '#dbeafe', padding: '0.4rem 0.9rem', borderRadius: '0.5rem' }}>
                      ⏳ Awaiting Admin Verification
                    </span>
                  )}
                </div>

                {bill.notes && (
                  <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: '#64748b', fontStyle: 'italic' }}>Note: {bill.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyBills;
