import React, { useState, useEffect, useContext, useRef } from 'react';
import { Bell } from 'lucide-react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

const typeColor = {
  appointment: { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  prescription: { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  bill: { bg: '#fef9c3', color: '#ca8a04', border: '#fde68a' },
  general: { bg: '#f8fafc', color: '#475569', border: '#e2e8f0' },
};

const NotificationBell = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const fetchNotifications = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await api.get('/notifications', config);
      setNotifications(data);
    } catch {}
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unread = notifications.filter(n => !n.isRead).length;

  const markAllRead = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await api.put('/notifications/read-all', {}, config);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch {}
  };

  const markRead = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await api.put(`/notifications/${id}/read`, {}, config);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch {}
  };

  if (!user) return null;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => { setOpen(!open); if (!open && unread > 0) markAllRead(); }}
        style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}>
        <Bell size={22} color={unread > 0 ? '#2563eb' : '#64748b'} />
        {unread > 0 && (
          <span style={{ position: 'absolute', top: '-2px', right: '-2px', backgroundColor: '#ef4444', color: 'white', fontSize: '10px', fontWeight: 'bold', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div style={{ position: 'absolute', right: 0, top: '110%', width: '340px', backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 10px 25px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0', zIndex: 1000 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', borderBottom: '1px solid #f1f5f9' }}>
            <h4 style={{ margin: 0, fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>Notifications</h4>
            {notifications.some(n => !n.isRead) && (
              <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                Mark all read
              </button>
            )}
          </div>

          <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                <Bell size={32} style={{ margin: '0 auto 0.5rem', display: 'block', opacity: 0.3 }} />
                <p style={{ margin: 0, fontSize: '0.875rem' }}>No notifications yet</p>
              </div>
            ) : notifications.map(n => {
              const style = typeColor[n.type] || typeColor.general;
              return (
                <div key={n._id} onClick={() => markRead(n._id)}
                  style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid #f8fafc', backgroundColor: n.isRead ? 'white' : '#f8fafc', cursor: 'pointer', transition: 'background 0.2s' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: n.isRead ? '#e2e8f0' : '#2563eb', marginTop: '6px', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 3px', fontWeight: n.isRead ? 500 : 700, color: '#1e293b', fontSize: '0.875rem' }}>{n.title}</p>
                      <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '0.8rem', lineHeight: 1.4 }}>{n.message}</p>
                      <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.72rem' }}>
                        {new Date(n.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
