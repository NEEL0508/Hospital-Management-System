import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, Stethoscope, AlertCircle, Calendar, Clock, Star, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Sidebar from '../components/Sidebar';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const FindDoctors = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [expandedDoctor, setExpandedDoctor] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/doctors');
        setDoctors(data);
        setFilteredDoctors(data);
        setError(null);
      } catch (err) {
        setError('Failed to load doctor database. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    let results = doctors;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(doc =>
        doc.user?.name?.toLowerCase().includes(term) ||
        doc.specialization?.toLowerCase().includes(term)
      );
    }
    if (selectedDept !== 'All Departments') {
      results = results.filter(doc => doc.specialization === selectedDept);
    }
    setFilteredDoctors(results);
  }, [searchTerm, selectedDept, doctors]);

  const departments = ['All Departments', ...new Set(doctors.map(doc => doc.specialization).filter(Boolean))];

  const handleBookAppointment = (doc) => {
    // Navigate to book appointment with doctor pre-selected
    navigate('/book-appointment', { state: { doctorId: doc._id, department: doc.specialization } });
  };

  const toggleExpand = (docId) => {
    setExpandedDoctor(expandedDoctor === docId ? null : docId);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar activeId="find-doctors" />

      <main className="dashboard-content" style={{ backgroundColor: '#f8fafc', padding: '2rem' }}>
        <header style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.25rem' }}>Find a Doctor</h1>
          <p style={{ color: '#64748b' }}>Search for specialists and book appointments instantly</p>
        </header>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {/* Search & Filter */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input type="text" placeholder="Search by doctor name or specialty..."
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', backgroundColor: 'white', outline: 'none', color: '#1e293b' }} />
          </div>
          <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)}
            style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#1e293b', outline: 'none', minWidth: '180px' }}>
            {departments.map((dept, i) => <option key={i} value={dept}>{dept}</option>)}
          </select>
        </div>

        {/* Stats bar */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.875rem', color: '#64748b', backgroundColor: 'white', padding: '0.4rem 0.875rem', borderRadius: '9999px', border: '1px solid #e2e8f0' }}>
            {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} found
          </span>
          {selectedDept !== 'All Departments' && (
            <span style={{ fontSize: '0.875rem', color: '#2563eb', backgroundColor: '#eff6ff', padding: '0.4rem 0.875rem', borderRadius: '9999px', border: '1px solid #bfdbfe' }}>
              {selectedDept}
            </span>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading doctors...</div>
        ) : filteredDoctors.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
            <Search size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem', display: 'block' }} />
            <h3 style={{ color: '#475569' }}>No Doctors Found</h3>
            <p style={{ color: '#94a3b8' }}>Try a different search term or department.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredDoctors.map((doc) => {
              const availableDays = [...new Set((doc.availability || []).map(s => s.day))];
              const isExpanded = expandedDoctor === doc._id;

              return (
                <div key={doc._id} style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', overflow: 'hidden', transition: 'box-shadow 0.2s' }}>
                  {/* Main Card Row */}
                  <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                    {/* Avatar */}
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Stethoscope size={28} color="#2563eb" />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                        <h3 style={{ margin: 0, fontWeight: 700, color: '#1e293b', fontSize: '1.1rem' }}>Dr. {doc.user?.name}</h3>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '9999px', backgroundColor: '#eff6ff', color: '#2563eb' }}>
                          {doc.specialization}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.8rem', color: '#64748b' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Star size={13} color="#f59e0b" fill="#f59e0b" /> {doc.experience}+ yrs experience
                        </span>
                        {doc.user?.email && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Mail size={13} /> {doc.user.email}
                          </span>
                        )}
                        {doc.user?.phone && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Phone size={13} /> {doc.user.phone}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Fee + Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem', flexShrink: 0 }}>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>Consultation Fee</p>
                        <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#16a34a' }}>₹{doc.feesPerConsultation?.toLocaleString('en-IN')}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => toggleExpand(doc._id)}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.5rem 0.875rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#475569', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                          <Clock size={13} /> {isExpanded ? 'Hide' : 'Schedule'}
                        </button>
                        <button onClick={() => handleBookAppointment(doc)}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', backgroundColor: '#2563eb', color: 'white', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
                          <Calendar size={13} /> Book Appointment <ChevronRight size={13} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Schedule */}
                  {isExpanded && (
                    <div style={{ borderTop: '1px solid #f1f5f9', padding: '1.25rem 1.5rem', backgroundColor: '#f8fafc' }}>
                      <p style={{ margin: '0 0 0.875rem', fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Weekly Schedule
                      </p>
                      {availableDays.length === 0 ? (
                        <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8' }}>Schedule not set yet.</p>
                      ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
                          {DAYS.map(day => {
                            const slots = (doc.availability || []).filter(s => s.day === day);
                            const isAvail = slots.length > 0;
                            return (
                              <div key={day} style={{ textAlign: 'center', padding: '0.625rem 0.25rem', borderRadius: '0.5rem', backgroundColor: isAvail ? '#dcfce7' : '#f1f5f9', border: `1px solid ${isAvail ? '#86efac' : '#e2e8f0'}` }}>
                                <p style={{ margin: '0 0 0.25rem', fontSize: '0.7rem', fontWeight: 700, color: isAvail ? '#166534' : '#94a3b8' }}>{day.slice(0, 3)}</p>
                                {isAvail ? slots.map((s, i) => (
                                  <p key={i} style={{ margin: 0, fontSize: '0.65rem', color: '#16a34a', fontWeight: 500 }}>{s.startTime}–{s.endTime}</p>
                                )) : (
                                  <p style={{ margin: 0, fontSize: '0.65rem', color: '#cbd5e1' }}>Off</p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default FindDoctors;
