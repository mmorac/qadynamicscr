import React from 'react';

import '../home/home.css'; // Reuse card styling from home page

const socialLinks = [
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/company/qadynamicscr/',
    iconClass: 'fa fa-linkedin',
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/profile.php?id=61574145175406',
    iconClass: 'fa fa-facebook',
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/qadynamicscr/',
    iconClass: 'fa fa-instagram',
  },
];

export default function Contact() {
  return (
    <div className="container contact-center-container">
      <div className="card contact-card">
        <div className="card-body text-center">
          <h3 className="card-title mb-4">Contact Us</h3>
          <p className="mb-3">
            <i className="fa fa-envelope contact-email-icon" aria-label="Email"></i>
            Email: <a href="mailto:info@qadynamicscr.com" className="contact-email-link">info@qadynamicscr.com</a>
          </p>
          {/* Font Awesome is now loaded via public/index.html */}
          <div className="d-flex justify-content-center gap-4 mb-2">
            {socialLinks.map(link => (
              <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" title={link.name} style={{ display: 'inline-block' }}>
                <span className={`social-icon-wrapper social-btn social-${link.name.toLowerCase()}`}> 
                  <i className={link.iconClass + ' contact-social-icon'} aria-label={link.name}></i>
                </span>
              </a>
            ))}
          </div>
          <p className="text-muted">Follow us on social media!</p>
        </div>
      </div>
    </div>
  );
}
