import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <h1 className="hero-title">Your Health,<br />Our Priority</h1>
          <p className="hero-description">
            Experience world-class healthcare with our team of expert doctors and state-of-the-art facilities. Book your appointment today and take the first step towards a healthier you.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-white">
              Get Started <ArrowRight size={18} className="ml-2" />
            </button>
            <button className="btn btn-outline">Learn More</button>
          </div>
        </div>
        <div className="hero-image-wrapper">
          <img 
            src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=2073&auto=format&fit=crop" 
            alt="Modern Hospital Building" 
            className="hero-image"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
