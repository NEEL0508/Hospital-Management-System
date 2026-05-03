import React, { useState, useEffect } from 'react';
import { Star, Quote, Users, ThumbsUp } from 'lucide-react';
import api from '../api';

const StarDisplay = ({ value, size = 16 }) => (
  <div style={{ display: 'flex', gap: '2px' }}>
    {[1, 2, 3, 4, 5].map(s => (
      <Star key={s} size={size}
        fill={s <= Math.round(value) ? '#f59e0b' : 'none'}
        color={s <= Math.round(value) ? '#f59e0b' : '#cbd5e1'}
        strokeWidth={1.5} />
    ))}
  </div>
);

const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({ totalReviews: 0, avgRating: 0, fiveStars: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/ratings/all');
        setReviews(data);
        if (data.length > 0) {
          const avg = data.reduce((s, r) => s + r.rating, 0) / data.length;
          const fiveStars = data.filter(r => r.rating === 5).length;
          setSummary({
            totalReviews: data.length,
            avgRating: avg.toFixed(1),
            fiveStars,
          });
        }
      } catch {
        // silently fail — reviews are optional on home page
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return null;
  if (reviews.length === 0) return null;

  return (
    <section style={{ backgroundColor: '#f8fafc', padding: '5rem 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#fef9c3', color: '#92400e', padding: '0.4rem 1rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem' }}>
            <Star size={14} fill="#f59e0b" color="#f59e0b" /> Patient Reviews
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', margin: '0 0 0.75rem' }}>
            What Our Patients Say
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '500px', margin: '0 auto' }}>
            Real experiences from real patients who trusted us with their health.
          </p>
        </div>

        {/* Summary Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
          {[
            { icon: <Star size={22} fill="#f59e0b" color="#f59e0b" />, value: summary.avgRating, label: 'Average Rating', bg: '#fef9c3', color: '#92400e' },
            { icon: <Users size={22} color="#2563eb" />, value: summary.totalReviews, label: 'Total Reviews', bg: '#eff6ff', color: '#1d4ed8' },
            { icon: <ThumbsUp size={22} color="#16a34a" />, value: `${summary.fiveStars}`, label: '5-Star Reviews', bg: '#f0fdf4', color: '#166534' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                {s.icon}
              </div>
              <p style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: s.color }}>{s.value}</p>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: '#64748b' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Review Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {reviews.slice(0, 6).map((review) => (
            <div key={review._id} style={{
              backgroundColor: 'white', borderRadius: '0.875rem', padding: '1.5rem',
              border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Quote icon */}
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', opacity: 0.08 }}>
                <Quote size={40} color="#2563eb" />
              </div>

              {/* Stars */}
              <div style={{ marginBottom: '0.875rem' }}>
                <StarDisplay value={review.rating} size={18} />
              </div>

              {/* Review text */}
              {review.review && (
                <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 1.25rem', fontStyle: 'italic' }}>
                  "{review.review}"
                </p>
              )}

              {/* Patient + Doctor info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '0.875rem' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, color: '#1e293b', fontSize: '0.875rem' }}>
                    {review.patient?.name || 'Anonymous'}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
                    {new Date(review.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
                {review.doctor?.user?.name && (
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Reviewed</p>
                    <p style={{ margin: '2px 0 0', fontSize: '0.78rem', fontWeight: 600, color: '#2563eb' }}>
                      Dr. {review.doctor.user.name}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {reviews.length > 6 && (
          <p style={{ textAlign: 'center', marginTop: '2rem', color: '#64748b', fontSize: '0.875rem' }}>
            Showing 6 of {reviews.length} reviews
          </p>
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;
