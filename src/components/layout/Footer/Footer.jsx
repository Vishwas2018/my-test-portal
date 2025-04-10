import './Footer.css';

import { Link } from 'react-router-dom';
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { path: '/about', label: 'About Us' },
      { path: '/careers', label: 'Careers' },
      { path: '/blog', label: 'Blog' },
      { path: '/contact', label: 'Contact' }
    ],
    product: [
      { path: '/features', label: 'Features' },
      { path: '/pricing', label: 'Pricing' },
      { path: '/roadmap', label: 'Roadmap' },
      { path: '/documentation', label: 'Documentation' }
    ],
    resources: [
      { path: '/help', label: 'Help Center' },
      { path: '/tutorials', label: 'Tutorials' },
      { path: '/support', label: 'Support' },
      { path: '/faq', label: 'FAQ' }
    ],
    legal: [
      { path: '/privacy', label: 'Privacy Policy' },
      { path: '/terms', label: 'Terms of Service' },
      { path: '/cookies', label: 'Cookie Policy' },
      { path: '/security', label: 'Security' }
    ]
  };

  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-grid">
          <div className="footer-section footer-brand">
            <h3 className="footer-title">Wonderlearn</h3>
            <p className="footer-description">
              Your playful learning platform designed for young explorers and curious minds.
            </p>
            {/* Social media links */}
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Products</h4>
            <ul className="footer-links">
              {footerLinks.product.map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Resources</h4>
            <ul className="footer-links">
              {footerLinks.resources.map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Contact</h4>
            <ul className="contact-info">
              <li>
                <i className="fas fa-envelope"></i>
                <a href="mailto:hello@wonderlearn.com">hello@wonderlearn.com</a>
              </li>
              <li>
                <i className="fas fa-phone"></i>
                <a href="tel:+15551234567">+1 (555) 123-4567</a>
              </li>
              <li>
                <i className="fas fa-map-marker-alt"></i>
                <span>123 Learning Lane, Discovery City</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">© {currentYear} Wonderlearn. All rights reserved.</p>
          <div className="legal-links">
            {footerLinks.legal.map((link, index) => (
              <React.Fragment key={link.path}>
                <Link to={link.path}>{link.label}</Link>
                {index < footerLinks.legal.length - 1 && (
                  <span className="divider">•</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;