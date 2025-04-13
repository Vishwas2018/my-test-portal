import './TrialSignup.css';

import React, { useState } from 'react';

import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { validateRegisterForm } from '../../utils/validation';

const TrialSignup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData({
      ...formData,
      [name]: newValue
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateRegisterForm({
      username: formData.username,
      email: formData.email,
      password: formData.password
    });
    
    // Add additional validations
    if (!formData.fullName) {
      validation.errors.fullName = 'Full name is required';
      validation.isValid = false;
    }
    
    if (!formData.agreeTerms) {
      validation.errors.agreeTerms = 'You must agree to the terms and conditions';
      validation.isValid = false;
    }
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    // Clear errors and status
    setErrors({});
    setStatusMessage({ type: '', message: '' });
    
    try {
      // Register the user
      const result = await register(formData);
      
      if (!result.success) {
        setStatusMessage({
          type: 'error',
          message: result.message
        });
        return;
      }
      
      // Set up trial information
      const trialInfo = {
        startDate: new Date().toISOString(),
        trialDays: 7
      };
      
      localStorage.setItem('trial_info', JSON.stringify(trialInfo));
      
      setStatusMessage({
        type: 'success',
        message: 'Trial account created successfully! Redirecting to dashboard...'
      });
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      setStatusMessage({
        type: 'error',
        message: 'An unexpected error occurred. Please try again.'
      });
    }
  };

  return (
    <div className="trial-signup-page">
      <div className="container">
        <div className="trial-signup-container">
          <div className="trial-info">
            <h1>Start Your 7-Day Free Trial</h1>
            <p className="trial-description">
              Experience all the magic of WonderLearn with full access to our premium features.
              No credit card required!
            </p>
            
            <div className="trial-benefits">
              <h3>What's Included:</h3>
              <ul className="benefits-list">
                <li>
                  <i className="fas fa-check-circle"></i>
                  <span>Unlimited access to all learning activities</span>
                </li>
                <li>
                  <i className="fas fa-check-circle"></i>
                  <span>Progress tracking and personalized learning paths</span>
                </li>
                <li>
                  <i className="fas fa-check-circle"></i>
                  <span>Interactive games and engaging content</span>
                </li>
                <li>
                  <i className="fas fa-check-circle"></i>
                  <span>Parent dashboard with detailed insights</span>
                </li>
                <li>
                  <i className="fas fa-check-circle"></i>
                  <span>Download and print educational materials</span>
                </li>
              </ul>
            </div>
            
            <div className="trial-guarantee">
              <i className="fas fa-shield-alt"></i>
              <p>
                Your trial automatically ends after 7 days. No credit card required.
                No automatic billing. We'll remind you before your trial ends.
              </p>
            </div>
          </div>
          
          <div className="signup-form-container">
            <div className="signup-form-card">
              <h2>Create Your Trial Account</h2>
              
              {statusMessage.message && (
                <div className={`status-message ${statusMessage.type}`}>
                  {statusMessage.message}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="signup-form">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && <div className="form-error">{errors.fullName}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Choose a username"
                  />
                  {errors.username && <div className="form-error">{errors.username}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                  {errors.email && <div className="form-error">{errors.email}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                  />
                  {errors.password && <div className="form-error">{errors.password}</div>}
                </div>
                
                <div className="form-group checkbox-group">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                  />
                  <label htmlFor="agreeTerms" className="checkbox-label">
                    I agree to the <a href="/terms" target="_blank">Terms of Service</a> and <a href="/privacy" target="_blank">Privacy Policy</a>
                  </label>
                  {errors.agreeTerms && <div className="form-error">{errors.agreeTerms}</div>}
                </div>
                
                <button type="submit" className="signup-button">
                  Start My Free Trial
                </button>
                
                <p className="login-link">
                  Already have an account? <a href="/login">Log in</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrialSignup;