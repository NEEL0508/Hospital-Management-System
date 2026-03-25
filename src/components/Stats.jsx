import React from 'react';
import { Users, Heart, Award, Clock } from 'lucide-react';

const stats = [
  {
    icon: <Users size={32} strokeWidth={1.5} />,
    value: "50+",
    label: "Expert Doctors"
  },
  {
    icon: <Heart size={32} strokeWidth={1.5} />,
    value: "10k+",
    label: "Happy Patients"
  },
  {
    icon: <Award size={32} strokeWidth={1.5} />,
    value: "25+",
    label: "Awards Won"
  },
  {
    icon: <Clock size={32} strokeWidth={1.5} />,
    value: "24/7",
    label: "Emergency Care"
  }
];

const Stats = () => {
  return (
    <section className="stats">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">
                {stat.icon}
              </div>
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
