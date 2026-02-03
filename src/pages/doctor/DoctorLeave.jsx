import React, { useState, useEffect, useContext } from 'react';
import { CalendarOff, Plus, Trash2, AlertCircle } from 'lucide-react';
import DoctorSidebar from '../../components/DoctorSidebar';
import api from '../../api';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const DoctorLeave = () => {
  const { user } = useContext(AuthContext);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [adding, setAdding] = useState(false);

  const config = { headers: { Authorization: `Bearer ${user.token}` } };

  const fetchLeaves = async () => {
    try {
      const { data } = await api.get('/leaves', config);
      setLeaves(data);
    } catch {
      toast.error('Failed to load leaves');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user) fetchLeaves(); }, [user]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!date) return toast.error('Please select a date');
    setAdding(true);
    try {
      await api.post('/leaves', { date, reason }, config);
      toast.success('Leave marked successfully');
      setDate('');
      setReason('');
      fetchLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to mark leave');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this leave?')) return;
    try {
      await api.delete(`/leaves/${id}`, config);
      toast.success('Leave removed');
      fetchLeaves();
    } catch {
      toast.error('Failed to remove leave');
    }
  };

  const today = new Date().toISOString().split('T')[0];

  const upcoming = leaves.filter(l => new Date(l.date) >= new Date(today));
  const past = leaves.filter(l => new Date(l.date) < new Date(today));

  return (
    <div className="dashboard-layout">
      <DoctorSidebar activeId="leave" />
      <main className="dashboard-content" style={{ backgroundColor: '#f8fafc', padding: '2rem' }}>

        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.25rem' }}>Leave Management</h1>
          <p style={{ color: '#64748b' }}>Mark dates when you are unavailable for appointments</p>
        </header>

        {/* Add Leave Form */}
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} color="#10b981" /> Mark New Leave
          </h3>
          <form onSubmit={handleAdd} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: '0 0 200px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Date *</label>
              <input type="date" value={date} min={today} onChange={e => setDate(e.target.value)} required
                style={{ width: '100%', padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', outline: 'none', color: '#1e293b' }} />
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Reason (optional)</label>
              <input type="text" placeholder="e.g. Personal, Medical, Conference..." value={reason} onChange={e => setReason(e.target.value)}
                style={{ width: '100%', padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', outline: 'none', color: '#1e293b' }} />
            </div>
            <button type="submit" disabled={adding}
              style={{ padding: '0.625rem 1.5rem', backgroundColor: adding ? '#6ee7b7' : '#10b981', color: 'white', border: 'none', borderRadius: '0.375rem', fontWeight: 600, cursor: adding ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}>
              {adding ? 'Marking...' : 'Mark Leave'}
            </button>
          </form>

          <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#fef9c3', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} color="#ca8a04" />
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#92400e' }}>
              Patients will not be able to book appointments on marked leave dates.
            </p>
          </div>
        </div>

        {/* Upcoming Leaves */}
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalendarOff size={18} color="#ef4444" />
            <h3 style={{ margin: 0, fontWeight: 700, color: '#1e293b', fontSize: '1rem' }}>Upcoming Leaves</h3>
            <span style={{ backgroundColor: '#fee2e2', color: '#dc2626', fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>
              {upcoming.length}
            </span>
          </div>

          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading...</div>
          ) : upcoming.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
              <CalendarOff size={36} style={{ margin: '0 auto 0.75rem', display: 'block', opacity: 0.3 }} />
              <p style={{ margin: 0 }}>No upcoming leaves marked</p>
            </div>
          ) : (
            <div style={{ padding: '0.5rem 0' }}>
              {upcoming.map((leave, i) => (
                <div key={leave._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 1.25rem', borderBottom: i < upcoming.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ backgroundColor: '#fee2e2', borderRadius: '0.5rem', padding: '0.5rem 0.875rem', textAlign: 'center', minWidth: '70px' }}>
                      <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#dc2626' }}>
                        {new Date(leave.date).getDate()}
                      </p>
                      <p style={{ margin: 0, fontSize: '0.7rem', color: '#ef4444', fontWeight: 600 }}>
                        {new Date(leave.date).toLocaleString('en-IN', { month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, color: '#1e293b', fontSize: '0.9rem' }}>
                        {new Date(leave.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                      {leave.reason && (
                        <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>Reason: {leave.reason}</p>
                      )}
                    </div>
                  </div>
                  <button onClick={() => handleDelete(leave._id)}
                    style={{ background: 'none', border: '1px solid #fecaca', borderRadius: '0.375rem', padding: '0.4rem 0.75rem', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Past Leaves */}
        {past.length > 0 && (
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: 0, fontWeight: 700, color: '#94a3b8', fontSize: '1rem' }}>Past Leaves</h3>
            </div>
            <div style={{ padding: '0.5rem 0' }}>
              {past.slice(0, 5).map((leave, i) => (
                <div key={leave._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1.25rem', borderBottom: i < Math.min(past.length, 5) - 1 ? '1px solid #f1f5f9' : 'none', opacity: 0.6 }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>
                      {new Date(leave.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    {leave.reason && <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>{leave.reason}</p>}
                  </div>
                  <span style={{ fontSize: '0.72rem', backgroundColor: '#f1f5f9', color: '#64748b', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontWeight: 600 }}>Past</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default DoctorLeave;
