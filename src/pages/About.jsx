import React from 'react';
import { Target, Eye, Heart, Trophy, Users, ShieldCheck } from 'lucide-react';

const About = () => {
  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', backgroundColor: '#f8fafc', paddingBottom: '4rem' }}>
      
      {/* Hero Section */}
      <div style={{ backgroundColor: 'white', padding: '4rem 2rem 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>About Our Hospital</h1>
        <p style={{ color: '#64748b', fontSize: '1.125rem', maxWidth: '800px', margin: '0 auto 4rem auto', lineHeight: 1.6 }}>
          Committed to providing exceptional healthcare services with compassion, innovation, and excellence since 1995.
        </p>

        <div style={{ maxWidth: '1200px', margin: '0 auto', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)' }}>
          <img 
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Medical Team" 
            style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '500px', objectFit: 'cover' }}
          />
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem 0' }}>
        
        {/* Mission & Vision */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          
          <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '3rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '3rem', height: '3rem', backgroundColor: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Target size={24} color="#3b82f6" />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>Our Mission</h2>
            <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.7 }}>
              To deliver patient-centered healthcare of the highest quality, combining advanced medical technology with compassionate care. We strive to improve health outcomes and enhance the well-being of every individual we serve.
            </p>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '3rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '3rem', height: '3rem', backgroundColor: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Eye size={24} color="#3b82f6" />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>Our Vision</h2>
            <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.7 }}>
              To be recognized as a leading healthcare institution, known for excellence in patient care, medical innovation, and community service. We envision a healthier future where quality healthcare is accessible to all.
            </p>
          </div>

        </div>

        {/* Core Values */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', textAlign: 'center', marginBottom: '3rem' }}>Our Core Values</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '4rem', height: '4rem', backgroundColor: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Heart size={28} color="#ef4444" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.75rem' }}>Compassion</h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6 }}>Caring for patients with empathy and kindness.</p>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '4rem', height: '4rem', backgroundColor: '#fefce8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Trophy size={28} color="#eab308" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.75rem' }}>Excellence</h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6 }}>Striving for the highest standards in everything we do.</p>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '4rem', height: '4rem', backgroundColor: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Users size={28} color="#3b82f6" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.75rem' }}>Teamwork</h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6 }}>Collaborating to provide comprehensive care.</p>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '4rem', height: '4rem', backgroundColor: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <ShieldCheck size={28} color="#22c55e" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.75rem' }}>Integrity</h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6 }}>Upholding honesty and ethical practices.</p>
            </div>
          </div>
        </div>

        {/* Our Journey */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', textAlign: 'center', marginBottom: '3rem' }}>Our Journey</h2>
          <div style={{ backgroundColor: 'white', borderRadius: '1.5rem', padding: '3rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              <div style={{ display: 'flex', gap: '2rem' }}>
                <div style={{ color: '#2563eb', fontWeight: 'bold', fontSize: '1.125rem', width: '60px', flexShrink: 0, textAlign: 'right' }}>1995</div>
                <div style={{ flex: 1, paddingLeft: '2rem', borderLeft: '2px solid #e2e8f0', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '-5px', top: '6px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563eb' }}></div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>Foundation</h3>
                  <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Hospital established with 50 beds and basic medical services.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '2rem' }}>
                <div style={{ color: '#2563eb', fontWeight: 'bold', fontSize: '1.125rem', width: '60px', flexShrink: 0, textAlign: 'right' }}>2005</div>
                <div style={{ flex: 1, paddingLeft: '2rem', borderLeft: '2px solid #e2e8f0', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '-5px', top: '6px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563eb' }}></div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>Expansion</h3>
                  <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Added specialized departments and increased capacity to 200 beds.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '2rem' }}>
                <div style={{ color: '#2563eb', fontWeight: 'bold', fontSize: '1.125rem', width: '60px', flexShrink: 0, textAlign: 'right' }}>2015</div>
                <div style={{ flex: 1, paddingLeft: '2rem', borderLeft: '2px solid #e2e8f0', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '-5px', top: '6px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563eb' }}></div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>Modernization</h3>
                  <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Introduced advanced medical technology and digital health records.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '2rem' }}>
                <div style={{ color: '#2563eb', fontWeight: 'bold', fontSize: '1.125rem', width: '60px', flexShrink: 0, textAlign: 'right' }}>2026</div>
                <div style={{ flex: 1, paddingLeft: '2rem', borderLeft: '2px solid transparent', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '-5px', top: '6px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563eb' }}></div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>Digital Transformation</h3>
                  <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Launched online appointment system and telemedicine services.</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Our Facilities */}
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', textAlign: 'center', marginBottom: '3rem' }}>Our Facilities</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            
            <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>Advanced ICU</h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6 }}>24/7 intensive care with state-of-the-art monitoring systems.</p>
            </div>
            
            <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>Modern Operation Theaters</h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6 }}>Equipped with the latest surgical technology and equipment.</p>
            </div>
            
            <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>Diagnostic Center</h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6 }}>Complete diagnostic services including MRI, CT, and lab facilities.</p>
            </div>
            
            <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>Emergency Department</h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6 }}>Round-the-clock emergency care with rapid response team.</p>
            </div>
            
            <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>Pharmacy</h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6 }}>In-house pharmacy with comprehensive medication availability.</p>
            </div>
            
            <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>Patient Rooms</h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6 }}>Comfortable private and semi-private rooms with modern amenities.</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
