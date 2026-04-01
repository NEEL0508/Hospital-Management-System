import React from 'react';
import { Check, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const CheckEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "dsodhu498@rku.ac.in"; // Default fallback to match screenshot

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '1rem', width: '100%', maxWidth: '450px', padding: '2.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.02)', textAlign: 'center' }}>
        
        {/* Icon */}
        <div style={{ width: '4rem', height: '4rem', backgroundColor: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
          <Check size={28} color="#16a34a" />
        </div>

        {/* Header */}
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>Check Your Email</h1>
        <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          We've sent a password reset link to <br/>
          <strong style={{ color: '#1e293b' }}>{email}</strong>. Please check your inbox <br/>
          and follow the instructions.
        </p>

        {/* Resend Link */}
        <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '2rem' }}>
          Didn't receive the email? Check your spam folder or <br/>
          <Link to="/forgot-password" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>try again</Link>
        </p>

        {/* Back to Login */}
        <div style={{ marginTop: '1rem' }}>
          <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', margin: '0 auto' }}>
            <ArrowLeft size={16} /> Back to Login
          </button>
        </div>

      </div>
    </div>
  );
};

export default CheckEmail;
