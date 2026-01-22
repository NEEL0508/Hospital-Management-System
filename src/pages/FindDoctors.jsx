import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, User as UserIcon, Stethoscope, AlertCircle } from 'lucide-react';
import api from '../api';
import Sidebar from '../components/Sidebar';

const FindDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/doctors');
        setDoctors(data);
        setFilteredDoctors(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError("Failed to load doctor database. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    // Dynamic Filtering
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

  // Extract unique departments for dropdown
  const departments = ['All Departments', ...new Set(doctors.map(doc => doc.specialization))];

  return (
    <div className="dashboard-layout">
      <Sidebar activeId="find-doctors" />

      <main className="dashboard-content">
        <header className="dashboard-welcome">
          <h1 className="welcome-title">Find a Doctor</h1>
          <p className="welcome-subtitle">Search for medical specialists by name or department</p>
        </header>

        {error && (
          <div className="error-alert">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <div className="doctor-filters">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by doctor name or specialty..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="filter-select"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            {departments.map((dept, i) => (
              <option key={i} value={dept}>{dept}</option>
            ))}
          </select>
          <button className="btn btn-search">Search</button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-10 w-10 border-b-2 border-primary mx-auto mb-4 rounded-full"></div>
            <p>Scanning for registered doctors...</p>
          </div>
        ) : filteredDoctors.length > 0 ? (
          <div className="doctors-grid">
            {filteredDoctors.map((doc) => (
              <div key={doc._id} className="doctor-card card-no-image">
                <div className="doctor-info">
                  <div className="doctor-header-row">
                    <div className="doctor-avatar-placeholder">
                      <Stethoscope size={24} className="text-primary" />
                    </div>
                    <div className="doctor-title-block">
                      <h3 className="doctor-name">Dr. {doc.user?.name || 'Doctor'}</h3>
                      <span className="doctor-badge-tag">{doc.specialization}</span>
                    </div>
                  </div>
                  
                  <p className="doctor-title-text mt-2">
                    {doc.experience}+ years of professional experience
                  </p>
                  
                  <div className="doctor-contact mt-4">
                    <div className="doctor-contact-item">
                      <Mail size={14} /> {doc.user?.email || 'N/A'}
                    </div>
                    <div className="doctor-contact-item">
                      <Phone size={14} /> {doc.user?.phone || 'N/A'}
                    </div>
                  </div>


                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state-card mt-8">
            <Search size={48} className="text-gray-300 mb-4" />
            <h3>No Doctors Found</h3>
            <p>We couldn't find any registered specialists matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default FindDoctors;

