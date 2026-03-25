import React from 'react';
import { HeartPulse, Brain, Baby, ArrowRight } from 'lucide-react';

const services = [
  {
    icon: <HeartPulse size={24} className="text-blue-600" />,
    title: "Cardiology",
    description: "Advanced cardiac care with state-of-the-art equipment and experienced cardiologists for heart health.",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  {
    icon: <Brain size={24} className="text-green-600" />,
    title: "Neurology",
    description: "Expert neurological care for disorders of the brain, spine, and nervous system by leading specialists.",
    iconBg: "bg-green-50",
    iconColor: "text-green-600"
  },
  {
    icon: <Baby size={24} className="text-purple-600" />,
    title: "Pediatrics",
    description: "Compassionate care for infants, children, and adolescents with experienced pediatricians and staff.",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600"
  }
];

const Services = () => {
  return (
    <section className="services">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Our Medical Services</h2>
          <p className="section-subtitle">
            Comprehensive healthcare services tailored to your needs by our specialized medical teams.
          </p>
        </div>
        
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className={`service-icon ${service.iconBg} ${service.iconColor}`}>
                {service.icon}
              </div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <a href="#" className="service-link">
                Find Specialists <ArrowRight size={16} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
