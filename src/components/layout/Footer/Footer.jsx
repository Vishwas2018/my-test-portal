import './Footer.css';

import { Link } from 'react-router-dom';
// src/components/layout/Footer/Footer.jsx
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

  // Helper function to render link columns
  const renderLinkColumn = (title, links) => (
    <div className="footer-section">
      <h4 className="footer-heading">{title}</h4>
      <ul className="footer-links">
        {links.map((link) => (
          <li key={link.path}>
            <Link to={link.path}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-grid">
          <div className="footer-section footer-brand">
            <h3 className="footer-title">Portal</h3>
            <p className="footer-description">
              Your all-in-one web solution for modern businesses.
            </p>
            {/* Social media links could go here */}
          </div>

          {renderLinkColumn('Company', footerLinks.company)}
          {renderLinkColumn('Product', footerLinks.product)}
          {renderLinkColumn('Resources', footerLinks.resources)}
        </div>

        <div className="footer-bottom">
          <p className="copyright">© {currentYear} Portal. All rights reserved.</p>
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