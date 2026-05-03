
import React, { useState, useEffect, useContext } from 'react';
import { Users, Stethoscope, Calendar, FileText, CreditCard, Clock, X, ChevronDown, ChevronUp, Download, Activity, Search } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const statusColor = {
  Completed: { bg: '#dcfce7', color: '#166534' },
  Approved:  { bg: '#dbeafe', color: '#1d4ed8' },
  Pending:   { bg: '#fef9c3', color: '#92400e' },
  Cancelled: { bg: '#fee2e2', color: '#991b1b' },
  Rejected:  { bg: '#fee2e2', color: '#991b1b' },
};

const billStatusColor = {
  Unpaid:             { bg: '#fee2e2', color: '#991b1b' },
  Partial:            { bg: '#fef9c3', color: '#92400e' },
  'Payment Requested':{ bg: '#dbeafe', color: '#1d4ed8' },
  Paid:               { bg: '#dcfce7', color: '#166534' },
};

/* ─── small reusable badge ─── */
const Badge = ({ label, bg, color }) => (
  <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.55rem', borderRadius: '9999px', backgroundColor: bg, color }}>{label}</span>
);

/* ─── collapsible section ─── */
const Section = ({ title, icon, count, children, accent = '#2563eb' }) => {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', overflow: 'hidden', marginBottom: '0.75rem' }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', backgroundColor: '#f8fafc', border: 'none', cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {icon}
          <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.875rem' }}>{title}</span>
          {count !== undefined && (
            <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.1rem 0.45rem', borderRadius: '9999px', backgroundColor: accent + '22', color: accent }}>{count}</span>
          )}
        </div>
        {open ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
      </button>
      {open && <div style={{ padding: '0.75rem 1rem' }}>{children}</div>}
    </div>
  );
};

/* ─── Doctor card ─── */
const DoctorCard = ({ doc }) => {
  const [slotDate, setSlotDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [onLeave, setOnLeave] = useState(false);

  const fetchSlots = async (date) => {
    if (!date) return;
    setSlotsLoading(true);
    setOnLeave(false);
    try {
      const { data } = await api.get(`/schedules/slots/${doc._id}/${date}`);
      if (data.onLeave || data.isOff) { setOnLeave(true); setSlots([]); }
      else setSlots(data.slots || []);
    } catch { setSlots([]); }
    finally { setSlotsLoading(false); }
  };

  const handleDateChange = (e) => { setSlotDate(e.target.value); fetchSlots(e.target.value); };

  const byDay = {};
  DAYS.forEach(d => { byDay[d] = (doc.availability || []).filter(s => s.day === d); });

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.25rem', marginBottom: '1rem' }}>
      {/* Doctor header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1rem' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Stethoscope size={22} color="#2563eb" />
        </div>
        <div>
          <p style={{ margin: 0, fontWeight: 700, color: '#1e293b', fontSize: '1rem' }}>Dr. {doc.user?.name}</p>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{doc.specialization} &bull; {doc.experience} yrs &bull; ₹{doc.feesPerConsultation?.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Weekly schedule grid */}
      <Section title="Weekly Schedule" icon={<Calendar size={15} color="#2563eb" />} accent="#2563eb">
        {(doc.availability || []).length === 0 ? (
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>No schedule set.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.4rem' }}>
            {DAYS.map(day => {
              const s = byDay[day];
              return (
                <div key={day} style={{ textAlign: 'center', padding: '0.4rem 0.2rem', borderRadius: '0.375rem', backgroundColor: s.length ? '#f0fdf4' : '#f8fafc', border: `1px solid ${s.length ? '#86efac' : '#e2e8f0'}` }}>
                  <p style={{ margin: '0 0 2px', fontSize: '0.65rem', fontWeight: 700, color: s.length ? '#166534' : '#94a3b8' }}>{day.slice(0, 3)}</p>
                  {s.length ? s.map((sl, i) => <p key={i} style={{ margin: 0, fontSize: '0.58rem', color: '#16a34a' }}>{sl.startTime}–{sl.endTime}</p>)
                    : <p style={{ margin: 0, fontSize: '0.58rem', color: '#cbd5e1' }}>Off</p>}
                </div>
              );
            })}
          </div>
        )}
      </Section>

      {/* Upcoming leaves */}
      {doc.leaves?.length > 0 && (
        <Section title="Upcoming Leaves" icon={<Clock size={15} color="#ef4444" />} count={doc.leaves.length} accent="#ef4444">
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {doc.leaves.map((l, i) => (
              <span key={i} style={{ fontSize: '0.75rem', backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.25rem 0.6rem', borderRadius: '0.375rem', fontWeight: 600 }}>
                {new Date(l.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                {l.reason ? ` — ${l.reason}` : ''}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Date slot viewer */}
      <Section title="View Slots by Date" icon={<Activity size={15} color="#0f766e" />} accent="#0f766e">
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.875rem', flexWrap: 'wrap' }}>
          <input type="date" value={slotDate} onChange={handleDateChange}
            style={{ padding: '0.5rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem', color: '#1e293b' }} />
          {slotDate && <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{new Date(slotDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</span>}
        </div>
        {slotDate && (
          slotsLoading ? <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Loading...</p>
          : onLeave ? <p style={{ color: '#991b1b', fontWeight: 600, fontSize: '0.8rem' }}>🏖️ Doctor on leave</p>
          : slots.length === 0 ? <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>No schedule for this day.</p>
          : (
            <>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>✓ {slots.filter(s => s.status === 'available').length} Available</span>
                <span style={{ fontSize: '0.72rem', color: '#dc2626', fontWeight: 600 }}>✗ {slots.filter(s => s.status === 'booked').length} Booked</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.4rem' }}>
                {slots.map((sl, i) => (
                  <div key={i} style={{ padding: '0.4rem 0.25rem', borderRadius: '0.375rem', textAlign: 'center', backgroundColor: sl.status === 'booked' ? '#fee2e2' : 'white', border: `1px solid ${sl.status === 'booked' ? '#fca5a5' : '#e2e8f0'}` }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: sl.status === 'booked' ? '#991b1b' : '#1e293b' }}>{sl.time}</p>
                    <p style={{ margin: 0, fontSize: '0.58rem', color: sl.status === 'booked' ? '#ef4444' : '#94a3b8' }}>{sl.status === 'booked' ? 'Booked' : 'Free'}</p>
                  </div>
                ))}
              </div>
            </>
          )
        )}
      </Section>

      {/* Recent appointments */}
      <Section title="Recent Appointments" icon={<Calendar size={15} color="#7c3aed" />} count={doc.appointments?.length} accent="#7c3aed">
        {!doc.appointments?.length ? <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>No appointments.</p>
          : doc.appointments.slice(0, 5).map(apt => (
            <div key={apt._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <p style={{ margin: 0, fontWeight: 600, color: '#1e293b', fontSize: '0.8rem' }}>{apt.patient?.name}</p>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748b' }}>{new Date(apt.appointmentDate).toLocaleDateString('en-IN')} at {apt.appointmentTime} — {apt.reasonForVisit}</p>
              </div>
              <Badge label={apt.status} {...(statusColor[apt.status] || { bg: '#f1f5f9', color: '#475569' })} />
            </div>
          ))}
      </Section>
    </div>
  );
};

/* ─── Patient card ─── */
const PatientCard = ({ pt }) => (
  <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.25rem', marginBottom: '1rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1rem' }}>
      <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Users size={22} color="#16a34a" />
      </div>
      <div>
        <p style={{ margin: 0, fontWeight: 700, color: '#1e293b', fontSize: '1rem' }}>{pt.name}</p>
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{pt.email} &bull; {pt.phone || 'No phone'} {pt.bloodGroup ? `&bull; ${pt.bloodGroup}` : ''}</p>
      </div>
    </div>

    {/* Appointments */}
    <Section title="Appointments" icon={<Calendar size={15} color="#2563eb" />} count={pt.appointments?.length} accent="#2563eb">
      {!pt.appointments?.length ? <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>No appointments.</p>
        : pt.appointments.map(apt => (
          <div key={apt._id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ margin: 0, fontWeight: 600, color: '#1e293b', fontSize: '0.8rem' }}>Dr. {apt.doctor?.user?.name} — {apt.department}</p>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748b' }}>{new Date(apt.appointmentDate).toLocaleDateString('en-IN')} at {apt.appointmentTime}</p>
                <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: '#475569' }}>{apt.reasonForVisit}</p>
              </div>
              <Badge label={apt.status} {...(statusColor[apt.status] || { bg: '#f1f5f9', color: '#475569' })} />
            </div>
            {apt.prescription && (
              <div style={{ marginTop: '0.4rem', backgroundColor: '#f0fdf4', borderRadius: '0.25rem', padding: '0.35rem 0.6rem' }}>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#166534' }}><strong>Rx:</strong> {apt.prescription}</p>
              </div>
            )}
          </div>
        ))}
    </Section>

    {/* Medical Records */}
    <Section title="Medical Records" icon={<FileText size={15} color="#0f766e" />} count={pt.medicalRecords?.length} accent="#0f766e">
      {!pt.medicalRecords?.length ? <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>No records.</p>
        : pt.medicalRecords.map(rec => (
          <div key={rec._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 600, color: '#1e293b', fontSize: '0.8rem' }}>{rec.title}</p>
              <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748b' }}>{rec.type} &bull; Dr. {rec.doctor?.user?.name} &bull; {new Date(rec.date || rec.createdAt).toLocaleDateString('en-IN')}</p>
              {rec.prescription && <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: '#475569' }}>{rec.prescription}</p>}
            </div>
            {rec.fileUrl && rec.fileUrl !== '#' && (
              <a href={rec.fileUrl} download={rec.title} target="_blank" rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', color: '#0f766e', fontWeight: 600, textDecoration: 'none', backgroundColor: '#f0fdfa', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', flexShrink: 0, marginLeft: '0.75rem' }}>
                <Download size={11} /> File
              </a>
            )}
          </div>
        ))}
    </Section>

    {/* Bills */}
    <Section title="Bills" icon={<CreditCard size={15} color="#ca8a04" />} count={pt.bills?.length} accent="#ca8a04">
      {!pt.bills?.length ? <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>No bills.</p>
        : pt.bills.map(bill => (
          <div key={bill._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 600, color: '#1e293b', fontSize: '0.8rem' }}>Dr. {bill.doctor?.user?.name || 'N/A'}</p>
              <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748b' }}>
                Total: ₹{bill.totalAmount?.toLocaleString('en-IN')} &bull; Paid: ₹{bill.paidAmount?.toLocaleString('en-IN')} &bull; {new Date(bill.createdAt).toLocaleDateString('en-IN')}
              </p>
            </div>
            <Badge label={bill.status} {...(billStatusColor[bill.status] || { bg: '#f1f5f9', color: '#475569' })} />
          </div>
        ))}
    </Section>
  </div>
);

/* ─── Main Page ─── */
const AdminActivity = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('doctors');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data: res } = await api.get('/admin/activity', { headers: { Authorization: `Bearer ${user.token}` } });
        setData(res);
      } catch {
        toast.error('Failed to load activity data');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetch();
  }, [user]);

  const filteredDoctors = (data?.doctors || []).filter(d =>
    d.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredPatients = (data?.patients || []).filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <AdminSidebar activeId="activity" />
      <main className="dashboard-content" style={{ backgroundColor: '#f8fafc', padding: '2rem' }}>

        <header style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.25rem' }}>Activity Overview</h1>
          <p style={{ color: '#64748b' }}>All doctor schedules, patient appointments, medical history and reports</p>
        </header>

        {/* Stats */}
        {data && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'Doctors', value: data.doctors.length, color: '#2563eb', bg: '#eff6ff' },
              { label: 'Patients', value: data.patients.length, color: '#16a34a', bg: '#f0fdf4' },
              { label: 'Total Appointments', value: data.patients.reduce((s, p) => s + (p.appointments?.length || 0), 0), color: '#7c3aed', bg: '#f5f3ff' },
              { label: 'Medical Records', value: data.patients.reduce((s, p) => s + (p.medicalRecords?.length || 0), 0), color: '#0f766e', bg: '#f0fdfa' },
            ].map((s, i) => (
              <div key={i} style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.25rem', border: '1px solid #e2e8f0' }}>
                <p style={{ margin: '0 0 0.4rem', fontSize: '0.8rem', color: '#64748b' }}>{s.label}</p>
                <h3 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: s.color }}>{s.value}</h3>
              </div>
            ))}
          </div>
        )}

        {/* Tabs + Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0' }}>
            {[
              { id: 'doctors', label: `Doctors (${data?.doctors?.length || 0})`, icon: <Stethoscope size={15} /> },
              { id: 'patients', label: `Patients (${data?.patients?.length || 0})`, icon: <Users size={15} /> },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.625rem 1.25rem', border: '1px solid #e2e8f0', backgroundColor: tab === t.id ? '#2563eb' : 'white', color: tab === t.id ? 'white' : '#475569', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', borderRadius: t.id === 'doctors' ? '0.5rem 0 0 0.5rem' : '0 0.5rem 0.5rem 0' }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input type="text" placeholder={`Search ${tab}...`} value={search} onChange={e => setSearch(e.target.value)}
              style={{ padding: '0.625rem 0.875rem 0.625rem 2.25rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none', color: '#1e293b', fontSize: '0.875rem', minWidth: '220px' }} />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading activity data...</div>
        ) : tab === 'doctors' ? (
          filteredDoctors.length === 0
            ? <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No doctors found.</div>
            : filteredDoctors.map(doc => <DoctorCard key={doc._id} doc={doc} />)
        ) : (
          filteredPatients.length === 0
            ? <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No patients found.</div>
            : filteredPatients.map(pt => <PatientCard key={pt._id} pt={pt} />)
        )}
      </main>
    </div>
  );
};

export default AdminActivity;
