import React from 'react';
import { SquarePlus, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo logo-white">
              <div className="logo-icon">
                <SquarePlus size={20} color="white" strokeWidth={2.5} />
              </div>
              <span className="logo-text text-white">Hospital</span>
            </div>
            <p className="footer-desc">
              Providing quality healthcare services with advanced medical technology and experienced professionals.
            </p>
          </div>
          
          <div className="footer-links">
            <h4 className="footer-title">Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Login</a></li>
              <li><Link to="/register">Register</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4 className="footer-title">Services</h4>
            <ul>
              <li><a href="#">Cardiology</a></li>
              <li><a href="#">Neurology</a></li>
              <li><a href="#">Pediatrics</a></li>
              <li><a href="#">Orthopedics</a></li>
              <li><a href="#">Emergency Care</a></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4 className="footer-title">Contact Us</h4>
            <ul>
              <li>
                <MapPin size={16} className="contact-icon" />
                <span>123 Medical Center Dr, New York, NY 10001</span>
              </li>
              <li>
                <Phone size={16} className="contact-icon" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li>
                <Mail size={16} className="contact-icon" />
                <span>info@hospital.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2026 Hospital Management System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
