import React from "react";
import {
  TwitterOutlined,
  LinkedinOutlined,
  FacebookOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ArrowRightOutlined,
  GlobalOutlined,
  SecurityScanOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { Input, Button, Divider } from "antd";
import moscot3 from "../../assets/moscot3.png";
import "../../styles/Footer.scss";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = {
    platform: {
      title: "Platform",
      links: [
        { label: "Traffic & Market", href: "/platform/traffic-market" },
        { label: "SEO Tools", href: "/platform/seo" },
        { label: "Local Marketing", href: "/platform/local" },
        { label: "Content Analytics", href: "/platform/content" },
        { label: "AI Marketing", href: "/platform/ai" },
        { label: "Social Media", href: "/platform/social" },
        { label: "Advertising", href: "/platform/advertising" },
      ],
    },

    resources: {
      title: "Resources",
      links: [
        { label: "Blog", href: "/blog" },
        { label: "Case Studies", href: "/case-studies" },
        { label: "Webinars", href: "/webinars" },
        { label: "White Papers", href: "/white-papers" },
        { label: "API Documentation", href: "/api-docs" },
        { label: "Help Center", href: "/help" },
        { label: "Video Tutorials", href: "/tutorials" },
      ],
    },
    company: {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Press Kit", href: "/press" },
        { label: "Partners", href: "/partners" },
        { label: "Contact Us", href: "/contact" },
        { label: "Events", href: "/events" },
      ],
    },
  };

  const socialLinks = [
    {
      icon: <TwitterOutlined />,
      href: "https://twitter.com/afftrex",
      label: "Twitter",
    },
    {
      icon: <LinkedinOutlined />,
      href: "https://linkedin.com/company/afftrex",
      label: "LinkedIn",
    },
    {
      icon: <FacebookOutlined />,
      href: "https://facebook.com/afftrex",
      label: "Facebook",
    },
    {
      icon: <InstagramOutlined />,
      href: "https://instagram.com/afftrex",
      label: "Instagram",
    },
    {
      icon: <YoutubeOutlined />,
      href: "https://youtube.com/afftrex",
      label: "YouTube",
    },
  ];

  const contactInfo = [
    {
      icon: <MailOutlined />,
      text: "hello@afftrex.com",
      href: "mailto:hello@afftrex.com",
    },
    {
      icon: <PhoneOutlined />,
      text: "+1 (555) 123-4567",
      href: "tel:+15551234567",
    },
    { icon: <EnvironmentOutlined />, text: "San Francisco, CA", href: "#" },
  ];

  const certifications = [
    { icon: <SecurityScanOutlined />, text: "SOC 2 Certified" },
    { icon: <SafetyCertificateOutlined />, text: "GDPR Compliant" },
    { icon: <GlobalOutlined />, text: "ISO 27001" },
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Newsletter subscription submitted");
  };

  return (
    <footer className="afftrex-footer">
      {/* Newsletter Section */}
      <div className="newsletter-section">
        <div className="newsletter-container">
          <div className="newsletter-content">
            <h3 className="newsletter-title">Stay ahead of the curve</h3>
            <p className="newsletter-description">
              Get the latest marketing insights, product updates, and industry
              trends delivered to your inbox.
            </p>
          </div>

          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <div className="newsletter-input-group">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="newsletter-input"
                prefix={<MailOutlined />}
                required
              />
              <Button
                type="primary"
                htmlType="submit"
                className="newsletter-submit"
                icon={<ArrowRightOutlined />}
              >
                Subscribe
              </Button>
            </div>
            <p className="newsletter-privacy">
              By subscribing, you agree to our Privacy Policy and Terms of
              Service.
            </p>
          </form>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="footer-container">
          {/* Company Info */}
          <div className="footer-brand">
            <div className="footer-logo">
              <h2 className="logo-text">AFFTREX</h2>
              <p className="logo-tagline">Partner Marketing Platform</p>
            </div>

            <p className="brand-description">
              Empowering marketers with comprehensive analytics and automation
              tools to drive performance and maximize ROI across all channels.
            </p>

            <div className="contact-info">
              {contactInfo.map((contact, index) => (
                <div key={index} className="contact-item">
                  <span className="contact-icon">{contact.icon}</span>
                  <a href={contact.href} className="contact-link">
                    {contact.text}
                  </a>
                </div>
              ))}
            </div>

            <div className="social-links">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          <div className="footer-links">
            {Object.entries(footerSections).map(([key, section]) => (
              <div key={key} className="footer-section">
                <h4 className="section-title">{section.title}</h4>
                <ul className="section-links">
                  {section.links.map((link, index) => (
                    <li key={index}>
                      <a href={link.href} className="footer-link">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        {/* Mascot positioned absolutely */}
        <div className="mascot-container">
          <img
            src={moscot3}
            height={200}
            alt="Mascot"
            className="mascot-image"
          />
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="footer-bottom-content">
            <div className="footer-legal">
              <p className="copyright">
                © {currentYear} Afftrex. All rights reserved.
              </p>
              <div className="legal-links">
                <a href="/privacy" className="legal-link">
                  Privacy Policy
                </a>
                <a href="/terms" className="legal-link">
                  Terms of Service
                </a>
                <a href="/cookies" className="legal-link">
                  Cookie Policy
                </a>
                <a href="/security" className="legal-link">
                  Security
                </a>
              </div>
            </div>

            <div className="footer-certifications">
              {certifications.map((cert, index) => (
                <div key={index} className="certification-item">
                  <span className="cert-icon">{cert.icon}</span>
                  <span className="cert-text">{cert.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;