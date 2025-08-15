import React, { useState, useCallback, useEffect } from 'react';
import {
  CloseOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import '../../styles/FreeTrialForm.scss';

// IMPORTANT: Replace with the access key you get from web3forms.com
const WEB3FORMS_ACCESS_KEY = "YOUR_ACCESS_KEY_HERE";

const FreeTrialForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyWebsite: '',
    workEmail: '',
    companyName: '',
    phoneNumber: '',
    skype: '',
    hearAboutUs: '',
    businessType: 'brands'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isSubmitting]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  const handleBusinessTypeChange = useCallback((type) => {
    setFormData((prev) => ({
      ...prev,
      businessType: type
    }));
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.workEmail.trim()) {
      newErrors.workEmail = 'Work email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.workEmail)) {
      newErrors.workEmail = 'Please enter a valid email address';
    }
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[\+]?[0-9\s\-\(\)]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    if (!formData.hearAboutUs) newErrors.hearAboutUs = 'Please select how you heard about us';
    if (formData.companyWebsite && !/^https?:\/\/.+/.test(formData.companyWebsite)) {
      newErrors.companyWebsite = 'Please enter a valid URL (e.g., https://example.com)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    const payload = {
      ...formData,
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `New Free Trial Request from ${formData.companyName}`,
      from_name: "Your Website",
      replyto: formData.workEmail
    };

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.success) {
        setSubmitStatus('success');
        setTimeout(() => {
          resetForm();
          onClose();
          setSubmitStatus(null);
        }, 2000);
      } else {
        console.error("Web3Forms Error:", result.message);
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Submission Error:", error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '', lastName: '', companyWebsite: '', workEmail: '',
      companyName: '', phoneNumber: '', skype: '', hearAboutUs: '',
      businessType: 'brands'
    });
    setErrors({});
  };

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      onClose();
      setSubmitStatus(null);
      setErrors({});
    }
  }, [isSubmitting, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="free-trial-overlay" onClick={handleOverlayClick}>
      <div className="free-trial-modal">
        <div className="free-trial-content">
          <div className="free-trial-header">
            <div className="header-text">
              <h2 className="main-title">30 Days Free Trial</h2>
              <h3 className="sub-title">
                Make Data-Driven Decisions with Powerful Affiliate Marketing Software
              </h3>
              <ul className="feature-list">
                <li className="feature-item"><span className="bullet-point"></span>Track and analyze affiliate campaigns</li>
                <li className="feature-item"><span className="bullet-point"></span>Get real-time unified reports</li>
                <li className="feature-item"><span className="bullet-point"></span>Maximize profits with smarter strategies</li>
              </ul>
            </div>
            <button
              onClick={handleClose}
              className="close-button"
              disabled={isSubmitting}
              aria-label="Close modal"
            >
              <CloseOutlined className="close-icon" />
            </button>
          </div>
          <div className="form-container">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="name-fields">
                <div className="input-group">
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First Name*" className={`form-input ${errors.firstName ? 'error' : ''}`} disabled={isSubmitting} autoComplete="given-name" />
                  {errors.firstName && <p className="error-message">{errors.firstName}</p>}
                </div>
                <div className="input-group">
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name*" className={`form-input ${errors.lastName ? 'error' : ''}`} disabled={isSubmitting} autoComplete="family-name" />
                  {errors.lastName && <p className="error-message">{errors.lastName}</p>}
                </div>
              </div>
              <div className="input-group">
                <input type="url" name="companyWebsite" value={formData.companyWebsite} onChange={handleInputChange} placeholder="Company Website (optional)" className={`form-input ${errors.companyWebsite ? 'error' : ''}`} disabled={isSubmitting} autoComplete="url" />
                {errors.companyWebsite && <p className="error-message">{errors.companyWebsite}</p>}
              </div>
              <div className="input-group">
                <input type="email" name="workEmail" value={formData.workEmail} onChange={handleInputChange} placeholder="Work Email*" className={`form-input ${errors.workEmail ? 'error' : ''}`} disabled={isSubmitting} autoComplete="email" />
                {errors.workEmail && <p className="error-message">{errors.workEmail}</p>}
              </div>
              <div className="input-group">
                <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Company Name*" className={`form-input ${errors.companyName ? 'error' : ''}`} disabled={isSubmitting} autoComplete="organization" />
                {errors.companyName && <p className="error-message">{errors.companyName}</p>}
              </div>
              <div className="input-group">
                <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="Phone Number*" className={`form-input ${errors.phoneNumber ? 'error' : ''}`} disabled={isSubmitting} autoComplete="tel" />
                {errors.phoneNumber && <p className="error-message">{errors.phoneNumber}</p>}
              </div>
              <div className="input-group">
                <select name="hearAboutUs" value={formData.hearAboutUs} onChange={handleInputChange} className={`form-select ${errors.hearAboutUs ? 'error' : ''}`} disabled={isSubmitting}>
                  <option value="">Where did you hear about us?*</option>
                  <option value="google">Google Search</option>
                  <option value="social-media">Social Media</option>
                  <option value="referral">Referral</option>
                  <option value="advertising">Online Advertising</option>
                  <option value="event">Event/Conference</option>
                  <option value="other">Other</option>
                </select>
                {errors.hearAboutUs && <p className="error-message">{errors.hearAboutUs}</p>}
              </div>
              <div className="business-type-container">
                <p className="business-type-label">Business Type</p>
                <div className="radio-group">
                  <label className="radio-option">
                    <input type="radio" name="businessType" value="brands" checked={formData.businessType === 'brands'} onChange={() => handleBusinessTypeChange('brands')} className="radio-input" disabled={isSubmitting} />
                    <span className="radio-custom"></span><span className="radio-label">For Brands</span>
                  </label>
                  <label className="radio-option">
                    <input type="radio" name="businessType" value="agencies" checked={formData.businessType === 'agencies'} onChange={() => handleBusinessTypeChange('agencies')} className="radio-input" disabled={isSubmitting} />
                    <span className="radio-custom"></span><span className="radio-label">For Ad Agencies / Networks</span>
                  </label>
                </div>
              </div>
              <div className="submit-container">
                <button type="button" onClick={handleSubmit} disabled={isSubmitting} className={`submit-button ${isSubmitting ? 'disabled' : ''}`}>
                  {isSubmitting ? (<span className="loading-content"><LoadingOutlined className="loading-icon" /> Submitting...</span>) : ('Start Free Trial')}
                </button>
              </div>
              {submitStatus === 'success' && (
                <div className="status-message success">
                  <CheckCircleOutlined className="status-icon" />
                  <span>Successfully submitted! We'll contact you soon.</span>
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="status-message error">
                  <ExclamationCircleOutlined className="status-icon" />
                  <span>Submission failed. Please try again.</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeTrialForm;