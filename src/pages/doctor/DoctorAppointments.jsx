import React, { useState } from 'react';
import { Search, ChevronDown, FileText, CheckCircle } from 'lucide-react';
import DoctorSidebar from '../../components/DoctorSidebar';

const DoctorAppointments = () => {
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
                style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', outline: 'none', color: '#475569', backgroundColor: '#f8fafc' }}
              />
            </div>
            <div>
              <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#475569', fontWeight: 500, cursor: 'pointer' }}>
                All Status <ChevronDown size={16} />
              </button>
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
                <tr style={{ borderBottom: '1px solid #f1f5f9', color: '#1e293b' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>John Smith</td>
                  <td style={{ padding: '1rem 1.25rem', color: '#64748b' }}>Regular checkup</td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ fontWeight: 600 }}>2026-02-05</div>
                    <div style={{ color: '#64748b', fontSize: '0.875rem' }}>10:00 AM</div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>approved</span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                      <button style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}><FileText size={20} /></button>
                      <button style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer' }}><CheckCircle size={20} /></button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div style={{ padding: '1.5rem', textAlign: 'center', color: '#cbd5e1', fontSize: '0.875rem' }}>
            ... No more recent appointments ...
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorAppointments;
