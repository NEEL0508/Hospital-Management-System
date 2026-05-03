import React, { useState, useEffect, useContext } from 'react';
import {
  Search, User, Users, Mail, Phone, Droplet, Calendar, Clock, FileText,
  Upload, X, CreditCard, Download, Activity, Plus, Trash2,
  Pill, Stethoscope, IndianRupee
} from 'lucide-react';
import DoctorSidebar from '../../components/DoctorSidebar';
import api from '../../api';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

// ─── Status colour maps ───────────────────────────────────────────────────────
const statusColor = {
  Completed:  { bg: '#dcfce7', color: '#166534' },
  Approved:   { bg: '#dbeafe', color: '#1d4ed8' },
  Pending:    { bg: '#fef9c3', color: '#92400e' },
  Cancelled:  { bg: '#fee2e2', color: '#991b1b' },
};

const billStatusColor = {
  Unpaid:              { bg: '#fee2e2', color: '#991b1b' },
  Partial:             { bg: '#fef9c3', color: '#92400e' },
  'Payment Requested': { bg: '#dbeafe', color: '#1d4ed8' },
  Paid:                { bg: '#dcfce7', color: '#166534' },
};

const TABS = ['Appointments', 'Medical Records', 'Bills', 'Send Report'];

// ─── Empty-state helpers ──────────────────────────────────────────────────────
const EmptyState = ({ icon, text }) => (
  <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#94a3b8' }}>
    <div style={{ marginBottom: '0.75rem', opacity: 0.4 }}>{icon}</div>
    <p style={{ margin: 0, fontSize: '0.9rem' }}>{text}</p>
  </div>
);

// ─── Inline-style helpers ─────────────────────────────────────────────────────
const inputStyle = {
  width: '100%',
  padding: '0.55rem 0.75rem',
  borderRadius: '0.375rem',
  border: '1px solid #e2e8f0',
  outline: 'none',
  fontSize: '0.875rem',
  color: '#1e293b',
  backgroundColor: '#fff',
  boxSizing: 'border-box',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.78rem',
  fontWeight: 600,
  color: '#475569',
  marginBottom: '0.35rem',
};

const sectionHeadStyle = {
  fontSize: '0.8rem',
  fontWeight: 700,
  color: '#334155',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: '0.6rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
};

// ─── DiagnosisForm ────────────────────────────────────────────────────────────
const DiagnosisForm = ({ appointment, onSaved, onCancel }) => {
  const { user } = useContext(AuthContext);

  const [diagnosis, setDiagnosis]     = useState(appointment.diagnosis || '');
  const [prescription, setPrescription] = useState(appointment.prescription || '');
  const [status, setStatus]           = useState(appointment.status === 'Completed' ? 'Completed' : appointment.status === 'Cancelled' ? 'Cancelled' : 'Approved');
  const [saving, setSaving]           = useState(false);

  // Medicines rows
  const [medicines, setMedicines] = useState(
    appointment.medicines?.length
      ? appointment.medicines.map(m => ({ name: m.name || '', dosage: m.dosage || '', duration: m.duration || '', notes: m.notes || '' }))
      : [{ name: '', dosage: '', duration: '', notes: '' }]
  );

  // Charges rows
  const [charges, setCharges] = useState(
    appointment.charges?.length
      ? appointment.charges.map(c => ({ description: c.description || '', amount: c.amount !== undefined ? String(c.amount) : '' }))
      : [{ description: '', amount: '' }]
  );

  const totalCharges = charges.reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);

  // Medicine helpers
  const addMedicine    = () => setMedicines(prev => [...prev, { name: '', dosage: '', duration: '', notes: '' }]);
  const removeMedicine = (i) => setMedicines(prev => prev.filter((_, idx) => idx !== i));
  const updateMedicine = (i, field, val) => setMedicines(prev => prev.map((m, idx) => idx === i ? { ...m, [field]: val } : m));

  // Charge helpers
  const addCharge    = () => setCharges(prev => [...prev, { description: '', amount: '' }]);
  const removeCharge = (i) => setCharges(prev => prev.filter((_, idx) => idx !== i));
  const updateCharge = (i, field, val) => setCharges(prev => prev.map((c, idx) => idx === i ? { ...c, [field]: val } : c));

  const handleSave = async () => {
    if (!status) { toast.error('Please select a status'); return; }
    setSaving(true);
    try {
      const payload = {
        status,
        diagnosis,
        prescription,
        medicines: medicines.filter(m => m.name.trim()),
        charges: charges.filter(c => c.description.trim()).map(c => ({ ...c, amount: parseFloat(c.amount) || 0 })),
      };
      await api.put(`/appointments/${appointment._id}/status`, payload, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success('Appointment updated successfully');
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.625rem', padding: '1.25rem', marginTop: '0.75rem', backgroundColor: '#f8fafc' }}>

      {/* Diagnosis */}
      <div style={{ marginBottom: '1rem' }}>
        <p style={sectionHeadStyle}><Stethoscope size={13} /> Diagnosis</p>
        <textarea
          value={diagnosis}
          onChange={e => setDiagnosis(e.target.value)}
          placeholder="Enter diagnosis details..."
          rows={3}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>

      {/* Medicines */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
          <p style={{ ...sectionHeadStyle, marginBottom: 0 }}><Pill size={13} /> Medicines</p>
          <button type="button" onClick={addMedicine}
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
            <Plus size={13} /> Add Medicine
          </button>
        </div>

        {medicines.map((med, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr auto', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
            <input placeholder="Medicine name" value={med.name} onChange={e => updateMedicine(i, 'name', e.target.value)} style={inputStyle} />
            <input placeholder="Dosage" value={med.dosage} onChange={e => updateMedicine(i, 'dosage', e.target.value)} style={inputStyle} />
            <input placeholder="Duration" value={med.duration} onChange={e => updateMedicine(i, 'duration', e.target.value)} style={inputStyle} />
            <input placeholder="Notes" value={med.notes} onChange={e => updateMedicine(i, 'notes', e.target.value)} style={inputStyle} />
            {medicines.length > 1 && (
              <button type="button" onClick={() => removeMedicine(i)}
                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem', flexShrink: 0 }}>
                <Trash2 size={15} />
              </button>
            )}
          </div>
        ))}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
          {['Paracetamol 500mg', 'Amoxicillin 250mg', 'Ibuprofen 400mg', 'Cetirizine 10mg'].map(s => (
            <button key={s} type="button"
              onClick={() => setMedicines(prev => [...prev, { name: s, dosage: '', duration: '', notes: '' }])}
              style={{ fontSize: '0.7rem', padding: '0.2rem 0.55rem', borderRadius: '9999px', border: '1px solid #bfdbfe', backgroundColor: '#eff6ff', color: '#2563eb', cursor: 'pointer', fontWeight: 500 }}>
              + {s}
            </button>
          ))}
        </div>
      </div>

      {/* Prescription */}
      <div style={{ marginBottom: '1rem' }}>
        <p style={sectionHeadStyle}><FileText size={13} /> Prescription Notes</p>
        <textarea
          value={prescription}
          onChange={e => setPrescription(e.target.value)}
          placeholder="Additional prescription instructions, diet advice, follow-up notes..."
          rows={2}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>

      {/* Charges */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
          <p style={{ ...sectionHeadStyle, marginBottom: 0 }}><IndianRupee size={13} /> Charges</p>
          <button type="button" onClick={addCharge}
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
            <Plus size={13} /> Add Charge
          </button>
        </div>

        {charges.map((ch, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
            <input placeholder="Description (e.g. Consultation Fee)" value={ch.description} onChange={e => updateCharge(i, 'description', e.target.value)} style={inputStyle} />
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.8rem', pointerEvents: 'none' }}>₹</span>
              <input type="number" min="0" placeholder="0" value={ch.amount} onChange={e => updateCharge(i, 'amount', e.target.value)}
                style={{ ...inputStyle, width: '110px', paddingLeft: '1.5rem' }} />
            </div>
            {charges.length > 1 && (
              <button type="button" onClick={() => removeCharge(i)}
                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem', flexShrink: 0 }}>
                <Trash2 size={15} />
              </button>
            )}
          </div>
        ))}

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
          {['Consultation Fee', 'Medicine Charges', 'Lab Test', 'Procedure Fee'].map(s => (
            <button key={s} type="button"
              onClick={() => setCharges(prev => [...prev, { description: s, amount: '' }])}
              style={{ fontSize: '0.7rem', padding: '0.2rem 0.55rem', borderRadius: '9999px', border: '1px solid #bfdbfe', backgroundColor: '#eff6ff', color: '#2563eb', cursor: 'pointer', fontWeight: 500 }}>
              + {s}
            </button>
          ))}
        </div>

        {charges.some(c => c.amount) && (
          <div style={{ textAlign: 'right', fontWeight: 700, color: '#1e293b', fontSize: '0.9rem', padding: '0.5rem 0.75rem', backgroundColor: '#f1f5f9', borderRadius: '0.375rem' }}>
            Total: ₹{totalCharges.toLocaleString('en-IN')}
          </div>
        )}
      </div>

      {/* Status */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={labelStyle}>Appointment Status</label>
        <select value={status} onChange={e => setStatus(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
          <option value="Approved">Approved</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <button type="button" onClick={onCancel}
          style={{ padding: '0.55rem 1.25rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#475569', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}>
          Cancel
        </button>
        <button type="button" onClick={handleSave} disabled={saving}
          style={{ padding: '0.55rem 1.25rem', borderRadius: '0.375rem', border: 'none', backgroundColor: saving ? '#93c5fd' : '#2563eb', color: 'white', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontSize: '0.875rem' }}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

// ─── AppointmentsTab ──────────────────────────────────────────────────────────
const AppointmentsTab = ({ appointments, onRefresh }) => {
  const [openDiagnosisId, setOpenDiagnosisId] = useState(null);

  if (!appointments || appointments.length === 0) {
    return <EmptyState icon={<Calendar size={40} style={{ display: 'block', margin: '0 auto' }} />} text="No appointments found" />;
  }

  return (
    <div>
      {appointments.map((apt) => (
        <div key={apt._id} style={{ border: '1px solid #e2e8f0', borderRadius: '0.625rem', padding: '1rem 1.25rem', marginBottom: '0.75rem', backgroundColor: '#fafafa' }}>
          {/* Appointment header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>
                {apt.department}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: '#64748b' }}>
                  <Calendar size={12} /> {new Date(apt.appointmentDate).toLocaleDateString('en-IN')}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: '#64748b' }}>
                  <Clock size={12} /> {apt.appointmentTime}
                </span>
              </div>
            </div>
            <span style={{
              fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.65rem', borderRadius: '9999px',
              backgroundColor: statusColor[apt.status]?.bg || '#f1f5f9',
              color: statusColor[apt.status]?.color || '#475569',
            }}>
              {apt.status}
            </span>
          </div>

          <p style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', color: '#475569' }}>
            <strong>Reason:</strong> {apt.reasonForVisit}
          </p>

          {/* Existing diagnosis summary */}
          {apt.diagnosis && (
            <div style={{ backgroundColor: '#f0fdf4', borderRadius: '0.375rem', padding: '0.5rem 0.75rem', marginBottom: '0.5rem' }}>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#166534' }}>
                <strong>Diagnosis:</strong> {apt.diagnosis}
              </p>
            </div>
          )}
          {apt.prescription && (
            <div style={{ backgroundColor: '#eff6ff', borderRadius: '0.375rem', padding: '0.5rem 0.75rem', marginBottom: '0.5rem' }}>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#1d4ed8' }}>
                <strong>Prescription:</strong> {apt.prescription}
              </p>
            </div>
          )}
          {apt.medicines?.length > 0 && (
            <div style={{ backgroundColor: '#fefce8', borderRadius: '0.375rem', padding: '0.5rem 0.75rem', marginBottom: '0.5rem' }}>
              <p style={{ margin: '0 0 0.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#92400e' }}>Medicines:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {apt.medicines.map((m, i) => (
                  <span key={i} style={{ fontSize: '0.72rem', backgroundColor: '#fef9c3', color: '#78350f', padding: '0.15rem 0.5rem', borderRadius: '9999px', border: '1px solid #fde68a' }}>
                    {m.name}{m.dosage ? ` — ${m.dosage}` : ''}{m.duration ? ` (${m.duration})` : ''}
                  </span>
                ))}
              </div>
            </div>
          )}
          {apt.charges?.length > 0 && (
            <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.375rem', padding: '0.5rem 0.75rem', marginBottom: '0.5rem', fontSize: '0.78rem', color: '#475569' }}>
              <strong>Charges:</strong>{' '}
              {apt.charges.map((c, i) => (
                <span key={i}>{c.description} (₹{Number(c.amount).toLocaleString('en-IN')}){i < apt.charges.length - 1 ? ', ' : ''}</span>
              ))}
              {' '}— <strong>Total: ₹{apt.charges.reduce((s, c) => s + (Number(c.amount) || 0), 0).toLocaleString('en-IN')}</strong>
            </div>
          )}

          {/* Add / Edit Diagnosis button */}
          {apt.status !== 'Cancelled' && (
            <div style={{ marginTop: '0.5rem' }}>
              {openDiagnosisId === apt._id ? (
                <DiagnosisForm
                  appointment={apt}
                  onSaved={() => { setOpenDiagnosisId(null); onRefresh(); }}
                  onCancel={() => setOpenDiagnosisId(null)}
                />
              ) : (
                <button
                  onClick={() => setOpenDiagnosisId(apt._id)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                    fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                    backgroundColor: apt.diagnosis ? '#f0fdf4' : '#eff6ff',
                    color: apt.diagnosis ? '#166534' : '#2563eb',
                    border: `1px solid ${apt.diagnosis ? '#bbf7d0' : '#bfdbfe'}`,
                    borderRadius: '0.375rem', padding: '0.35rem 0.75rem',
                  }}>
                  <Stethoscope size={13} />
                  {apt.diagnosis ? 'Edit Diagnosis' : 'Add Diagnosis'}
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ─── MedicalRecordsTab ────────────────────────────────────────────────────────
const MedicalRecordsTab = ({ records }) => {
  if (!records || records.length === 0) {
    return <EmptyState icon={<FileText size={40} style={{ display: 'block', margin: '0 auto' }} />} text="No medical records found" />;
  }
  return (
    <div>
      {records.map((rec) => (
        <div key={rec._id} style={{ border: '1px solid #e2e8f0', borderRadius: '0.625rem', padding: '1rem 1.25rem', marginBottom: '0.75rem', backgroundColor: '#fafafa' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>{rec.title}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', backgroundColor: '#f1f5f9', padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>{rec.type}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: '#64748b' }}>
                  <Calendar size={11} /> {new Date(rec.date || rec.createdAt).toLocaleDateString('en-IN')}
                </span>
                {rec.doctor?.user?.name && (
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Dr. {rec.doctor.user.name}</span>
                )}
              </div>
              {rec.prescription && (
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: '#475569' }}>{rec.prescription}</p>
              )}
            </div>
            {rec.fileUrl && rec.fileUrl !== '#' && (
              <a
                href={rec.fileUrl}
                download={rec.title}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.3rem',
                  fontSize: '0.75rem', color: '#0f766e', fontWeight: 600,
                  textDecoration: 'none', backgroundColor: '#f0fdfa',
                  padding: '0.4rem 0.75rem', borderRadius: '0.375rem',
                  flexShrink: 0, marginLeft: '1rem', border: '1px solid #99f6e4',
                }}>
                <Download size={13} /> Download
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── BillsTab ─────────────────────────────────────────────────────────────────
const BillsTab = ({ bills }) => {
  if (!bills || bills.length === 0) {
    return <EmptyState icon={<CreditCard size={40} style={{ display: 'block', margin: '0 auto' }} />} text="No bills found" />;
  }
  return (
    <div>
      {bills.map((bill) => (
        <div key={bill._id} style={{ border: '1px solid #e2e8f0', borderRadius: '0.625rem', padding: '1rem 1.25rem', marginBottom: '0.75rem', backgroundColor: '#fafafa' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>
                {bill.doctor?.user?.name ? `Dr. ${bill.doctor.user.name}` : 'Bill'}
              </p>
              <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                {new Date(bill.createdAt).toLocaleDateString('en-IN')}
                {bill.dueDate && ` · Due: ${new Date(bill.dueDate).toLocaleDateString('en-IN')}`}
              </p>
            </div>
            <span style={{
              fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.65rem', borderRadius: '9999px',
              backgroundColor: billStatusColor[bill.status]?.bg || '#f1f5f9',
              color: billStatusColor[bill.status]?.color || '#475569',
            }}>
              {bill.status}
            </span>
          </div>

          {/* Amount summary */}
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ color: '#64748b' }}>
              Total: <strong style={{ color: '#1e293b' }}>₹{Number(bill.totalAmount).toLocaleString('en-IN')}</strong>
            </span>
            <span style={{ color: '#64748b' }}>
              Paid: <strong style={{ color: '#16a34a' }}>₹{Number(bill.paidAmount).toLocaleString('en-IN')}</strong>
            </span>
            {bill.totalAmount - bill.paidAmount > 0 && (
              <span style={{ color: '#64748b' }}>
                Due: <strong style={{ color: '#dc2626' }}>₹{(bill.totalAmount - bill.paidAmount).toLocaleString('en-IN')}</strong>
              </span>
            )}
          </div>

          {/* Bill items */}
          {bill.items?.length > 0 && (
            <div style={{ fontSize: '0.78rem', color: '#64748b', backgroundColor: '#f1f5f9', borderRadius: '0.375rem', padding: '0.5rem 0.75rem' }}>
              {bill.items.map((it, i) => (
                <span key={i}>
                  {it.description} <strong style={{ color: '#1e293b' }}>₹{Number(it.amount).toLocaleString('en-IN')}</strong>
                  {i < bill.items.length - 1 ? ' · ' : ''}
                </span>
              ))}
            </div>
          )}

          {bill.notes && (
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.78rem', color: '#64748b', fontStyle: 'italic' }}>{bill.notes}</p>
          )}
        </div>
      ))}
    </div>
  );
};

// ─── SendReportTab ────────────────────────────────────────────────────────────
const SendReportTab = ({ patient }) => {
  const { user } = useContext(AuthContext);
  const [file, setFile]           = useState(null);
  const [subject, setSubject]     = useState('');
  const [message, setMessage]     = useState('');
  const [sending, setSending]     = useState(false);
  const [dragOver, setDragOver]   = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleSend = async () => {
    if (!file) { toast.error('Please select a file to send'); return; }
    setSending(true);
    try {
      const formData = new FormData();
      formData.append('report', file);
      formData.append('patientId', patient._id);
      formData.append('patientEmail', patient.email);
      formData.append('patientName', patient.name);
      formData.append('subject', subject || `Medical Report — ${patient.name}`);
      formData.append('message', message);
      await api.post('/reports/send', formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(`Report sent to ${patient.email}`);
      setFile(null);
      setSubject('');
      setMessage('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send report');
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div style={{ backgroundColor: '#eff6ff', borderRadius: '0.5rem', padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Mail size={15} color="#2563eb" />
        <p style={{ margin: 0, fontSize: '0.82rem', color: '#1d4ed8' }}>
          Report will be sent to <strong>{patient.email}</strong>
        </p>
      </div>

      {/* Subject */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={labelStyle}>Subject</label>
        <input
          type="text"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          placeholder={`Medical Report — ${patient.name}`}
          style={inputStyle}
        />
      </div>

      {/* Message */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={labelStyle}>Message (optional)</label>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Add a personal note to accompany the report..."
          rows={3}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>

      {/* File upload */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={labelStyle}>Report File *</label>
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${dragOver ? '#2563eb' : '#cbd5e1'}`,
            borderRadius: '0.5rem',
            padding: '1.5rem',
            textAlign: 'center',
            backgroundColor: dragOver ? '#eff6ff' : '#f8fafc',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onClick={() => document.getElementById('report-file-input').click()}
        >
          <input
            id="report-file-input"
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            style={{ display: 'none' }}
            onChange={e => setFile(e.target.files[0] || null)}
          />
          {file ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <FileText size={20} color="#2563eb" />
              <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }}>{file.name}</span>
              <button
                type="button"
                onClick={e => { e.stopPropagation(); setFile(null); }}
                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.1rem' }}>
                <X size={15} />
              </button>
            </div>
          ) : (
            <div>
              <Upload size={28} color="#94a3b8" style={{ display: 'block', margin: '0 auto 0.5rem' }} />
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
                Drag & drop or <span style={{ color: '#2563eb', fontWeight: 600 }}>browse</span>
              </p>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>PDF, DOC, DOCX, JPG, PNG</p>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={handleSend}
          disabled={sending || !file}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.6rem 1.5rem', borderRadius: '0.375rem', border: 'none',
            backgroundColor: sending || !file ? '#93c5fd' : '#2563eb',
            color: 'white', fontWeight: 600, cursor: sending || !file ? 'not-allowed' : 'pointer',
            fontSize: '0.875rem',
          }}>
          <Upload size={15} />
          {sending ? 'Sending...' : 'Send Report'}
        </button>
      </div>
    </div>
  );
};

// ─── PatientDetailsModal ──────────────────────────────────────────────────────
const PatientDetailsModal = ({ patient, onClose }) => {
  const { user } = useContext(AuthContext);
  const [details, setDetails]           = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(true);
  const [activeTab, setActiveTab]       = useState('Appointments');

  const fetchDetails = async () => {
    setDetailsLoading(true);
    try {
      const { data } = await api.get(`/doctors/patient/${patient._id}/details`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setDetails(data);
    } catch {
      toast.error('Failed to load patient details');
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient._id]);

  const tabCount = (tab) => {
    if (!details) return null;
    if (tab === 'Appointments')    return details.appointments?.length ?? 0;
    if (tab === 'Medical Records') return details.medicalRecords?.length ?? 0;
    if (tab === 'Bills')           return details.bills?.length ?? 0;
    return null;
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      backgroundColor: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '1rem',
    }}>
      <div style={{
        backgroundColor: 'white', borderRadius: '0.75rem',
        width: '100%', maxWidth: '800px', maxHeight: '92vh',
        overflowY: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.18)',
        display: 'flex', flexDirection: 'column',
      }}>

        {/* ── Modal Header ── */}
        <div style={{
          padding: '1.25rem 1.75rem', borderBottom: '1px solid #e2e8f0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{
              width: '46px', height: '46px', borderRadius: '50%',
              backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <User size={22} color="#2563eb" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 'bold', color: '#1e293b' }}>{patient.name}</h2>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                Patient since {new Date(patient.createdAt).toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '0.25rem' }}>
            <X size={22} />
          </button>
        </div>

        {/* ── Patient Info Strip ── */}
        <div style={{ padding: '1rem 1.75rem', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
            {[
              { icon: <Mail size={13} />, label: 'Email',       value: patient.email },
              { icon: <Phone size={13} />, label: 'Phone',      value: patient.phone || 'N/A' },
              { icon: <Droplet size={13} />, label: 'Blood Group', value: patient.bloodGroup || 'N/A' },
            ].map((item, i) => (
              <div key={i} style={{ backgroundColor: '#f8fafc', borderRadius: '0.5rem', padding: '0.65rem 0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#94a3b8', fontSize: '0.68rem', marginBottom: '0.2rem' }}>
                  {item.icon} {item.label}
                </div>
                <p style={{ margin: 0, fontWeight: 600, color: '#1e293b', fontSize: '0.82rem', wordBreak: 'break-all' }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div style={{ padding: '0 1.75rem', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: 0, overflowX: 'auto' }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.875rem 1.1rem', border: 'none', background: 'none', cursor: 'pointer',
                fontWeight: 600, fontSize: '0.82rem', whiteSpace: 'nowrap',
                color: activeTab === tab ? '#2563eb' : '#64748b',
                borderBottom: activeTab === tab ? '2px solid #2563eb' : '2px solid transparent',
                marginBottom: '-1px',
              }}>
              {tab}
              {tabCount(tab) !== null && (
                <span style={{
                  marginLeft: '0.35rem', fontSize: '0.68rem',
                  backgroundColor: activeTab === tab ? '#dbeafe' : '#f1f5f9',
                  color: activeTab === tab ? '#1d4ed8' : '#64748b',
                  padding: '0.1rem 0.4rem', borderRadius: '9999px',
                }}>
                  {tabCount(tab)}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Tab Content ── */}
        <div style={{ padding: '1.5rem 1.75rem', flex: 1 }}>
          {detailsLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              <Activity size={32} style={{ display: 'block', margin: '0 auto 0.75rem', opacity: 0.4 }} />
              Loading patient details...
            </div>
          ) : !details ? null : (
            <>
              {activeTab === 'Appointments' && (
                <AppointmentsTab appointments={details.appointments} onRefresh={fetchDetails} />
              )}
              {activeTab === 'Medical Records' && (
                <MedicalRecordsTab records={details.medicalRecords} />
              )}
              {activeTab === 'Bills' && (
                <BillsTab bills={details.bills} />
              )}
              {activeTab === 'Send Report' && (
                <SendReportTab patient={patient} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── DoctorPatients (main page) ───────────────────────────────────────────────
const DoctorPatients = () => {
  const { user } = useContext(AuthContext);
  const [patients, setPatients]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [searchTerm, setSearchTerm]   = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data } = await api.get('/doctors/my-patients', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setPatients(data);
      } catch {
        toast.error('Failed to load patients');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchPatients();
  }, [user]);

  const filtered = patients.filter(pt =>
    pt.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pt.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pt.phone?.includes(searchTerm)
  );

  // ── Stats ──
  const totalPatients  = patients.length;
  const withBloodGroup = patients.filter(p => p.bloodGroup).length;
  const withPhone      = patients.filter(p => p.phone).length;

  const statCards = [
    {
      label: 'TOTAL PATIENTS',
      value: totalPatients,
      icon: <Users size={20} color="#2563eb" />,
      iconBg: '#eff6ff',
    },
    {
      label: 'WITH BLOOD GROUP',
      value: withBloodGroup,
      icon: <Droplet size={20} color="#dc2626" />,
      iconBg: '#fee2e2',
    },
    {
      label: 'WITH PHONE',
      value: withPhone,
      icon: <Phone size={20} color="#16a34a" />,
      iconBg: '#dcfce7',
    },
  ];

  return (
    <div className="dashboard-layout">
      <DoctorSidebar activeId="patients" />

      <main className="dashboard-content">
        {/* ── Page Header ── */}
        <header style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1e293b', margin: '0 0 0.25rem' }}>My Patients</h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '1rem' }}>View and manage all patients assigned to you</p>
        </header>

        {/* ── Stat Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '1.75rem' }}>
          {statCards.map((s, i) => (
            <div key={i} style={{
              backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.25rem 1.5rem',
              border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <p style={{ margin: '0 0 0.4rem', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
                <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#1e293b' }}>{loading ? '—' : s.value}</p>
              </div>
              <div style={{ width: '44px', height: '44px', borderRadius: '0.5rem', backgroundColor: s.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {s.icon}
              </div>
            </div>
          ))}
        </div>

        {/* ── Patient Table Card ── */}
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>

          {/* Search bar */}
          <div style={{ padding: '1.25rem', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ position: 'relative' }}>
              <Search size={17} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search patients by name, email or phone..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  width: '100%', padding: '0.65rem 1rem 0.65rem 2.6rem',
                  borderRadius: '0.5rem', border: '1px solid #e2e8f0',
                  outline: 'none', color: '#1e293b', fontSize: '0.875rem',
                  backgroundColor: '#f8fafc', boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {['Patient', 'Blood Group', 'Contact', 'Registered', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '1rem 1.25rem' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                      Loading patients...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                      {searchTerm ? 'No patients match your search.' : 'No patients found.'}
                    </td>
                  </tr>
                ) : filtered.map((pt, i) => (
                  <tr key={pt._id} style={{ borderBottom: i === filtered.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                    {/* Name */}
                    <td style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '38px', height: '38px', borderRadius: '50%',
                          backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <User size={18} color="#2563eb" />
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: 600, color: '#1e293b', fontSize: '0.9rem' }}>{pt.name}</p>
                        </div>
                      </div>
                    </td>

                    {/* Blood Group */}
                    <td style={{ padding: '1.25rem' }}>
                      {pt.bloodGroup ? (
                        <span style={{
                          fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem',
                          borderRadius: '9999px', backgroundColor: '#fee2e2', color: '#ef4444',
                        }}>
                          {pt.bloodGroup}
                        </span>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>N/A</span>
                      )}
                    </td>

                    {/* Contact */}
                    <td style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569', fontSize: '0.78rem', marginBottom: '0.3rem' }}>
                        <Mail size={12} color="#94a3b8" /> {pt.email}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569', fontSize: '0.78rem' }}>
                        <Phone size={12} color="#94a3b8" /> {pt.phone || 'N/A'}
                      </div>
                    </td>

                    {/* Registered */}
                    <td style={{ padding: '1.25rem', color: '#64748b', fontSize: '0.82rem' }}>
                      {new Date(pt.createdAt).toLocaleDateString('en-IN')}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '1.25rem' }}>
                      <button
                        onClick={() => setSelectedPatient(pt)}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                          backgroundColor: '#eff6ff', color: '#2563eb',
                          border: 'none', borderRadius: '0.375rem',
                          padding: '0.45rem 0.9rem', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                        }}>
                        <FileText size={13} /> View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {!loading && filtered.length > 0 && (
            <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #f1f5f9', textAlign: 'right', fontSize: '0.78rem', color: '#94a3b8' }}>
              Showing {filtered.length} of {patients.length} patient{patients.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </main>

      {/* ── Patient Details Modal ── */}
      {selectedPatient && (
        <PatientDetailsModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
};

export default DoctorPatients;
