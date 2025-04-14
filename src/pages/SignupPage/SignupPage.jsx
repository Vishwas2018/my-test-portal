import './SignupPage.css';

import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

import GlassContainer from '../../components/common/GlassContainer/GlassContainer';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { validateRegisterForm } from '../../utils/validation';

// Styled components for SignupPage
const SignupPageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: var(--off-white);
  background-image: 
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%237ED957' fill-opacity='0.1'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"),
    radial-gradient(circle at 15% 50%, rgba(126, 217, 87, 0.15), transparent 25%),
    radial-gradient(circle at 85% 30%, rgba(110, 207, 255, 0.15), transparent 25%);
`;

const SignupContent = styled.div`
  width: 100%;
  max-width: 520px;
`;

const SignupHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const SignupTitle = styled.h1`
  font-size: 2.5rem;
  color: var(--dark);
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: var(--gradient-fun);
    border-radius: var(--radius-full);
  }
`;

const SignupSubtitle = styled.p`
  font-size: 1.1rem;
  color: var(--dark-gray);
  margin-bottom: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--dark);
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--light-gray);
  border-radius: var(--radius-md);
  font-size: 1rem;
  transition: var(--transition-normal);
  background-color: ${props => props.dark ? 'rgba(36, 40, 46, 0.1)' : 'rgba(255, 255, 255, 0.8)'};
  
  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(110, 207, 255, 0.3);
    outline: none;
  }
`;

const FormError = styled.div`
  color: var(--error);
  font-size: 0.875rem;
  margin-top: 0.5rem;
  font-weight: 500;
`;

const FormButton = styled.button`
  width: 100%;
  padding: 0.875rem;
  border: none;
  border-radius: var(--radius-full);
  background: var(--gradient-fun);
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: var(--transition-bounce);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 1rem;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 0px 0 rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: translateY(0);
  }
`;

const FormDivider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  
  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: var(--light-gray);
  }
  
  span {
    padding: 0 1rem;
    color: var(--dark-gray);
    font-size: 0.875rem;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem;
`;

const CheckboxInput = styled.input`
  margin-top: 0.25rem;
  margin-right: 0.75rem;
  flex-shrink: 0;
`;

const CheckboxLabel = styled.label`
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--dark-gray);
  
  a {
    color: var(--primary);
    font-weight: 600;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const SocialLoginButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const SocialButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--white);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
  transition: var(--transition-bounce);
  color: var(--dark-gray);
  
  &:hover {
    transform: translateY(-3px) rotate(8deg);
    box-shadow: var(--shadow-md);
    color: var(--primary);
  }
`;

const HelperLinks = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.95rem;
`;

const StyledLink = styled(Link)`
  color: var(--primary);
  font-weight: 600;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const StatusMessage = styled.div`
  padding: 1rem;
  border-radius: var(--radius-md);
  margin-bottom: 1.5rem;
  font-weight: 600;
  font-size: 0.95rem;
  text-align: center;
  
  &.error {
    background-color: rgba(229, 62, 62, 0.1);
    color: #e53e3e;
    border-left: 4px solid #e53e3e;
  }
  
  &.success {
    background-color: rgba(72, 187, 120, 0.1);
    color: #48bb78;
    border-left: 4px solid #48bb78;
  }
  
  &.info {
    background-color: rgba(66, 153, 225, 0.1);
    color: #4299e1;
    border-left: 4px solid #4299e1;
  }
`;

const TwoColumnForm = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
`;

// Icons for social signup buttons
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
  </svg>
);

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Basic validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    // Use the validation from utils
    const registerValidation = validateRegisterForm({
      username: formData.username,
      email: formData.email,
      password: formData.password
    });
    
    // Merge errors
    Object.assign(newErrors, registerValidation.errors);
    
    // Additional validations
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const isValid = validateForm();
    if (!isValid) {
      return;
    }
    
    // Clear status and show loading
    setStatus({ type: '', message: '' });
    setLoading(true);
    
    try {
      // Register the user
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName
      });
      
      if (!result.success) {
        setStatus({
          type: 'error',
          message: result.message || 'Registration failed. Please try again.'
        });
        setLoading(false);
        return;
      }
      
      // Show success message
      setStatus({
        type: 'success',
        message: 'Registration successful! Redirecting to login...'
      });
      
      // Redirect to login page after delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'An unexpected error occurred. Please try again.'
      });
      setLoading(false);
    }
  };

  const handleSocialSignup = (provider) => {
    // For demo purposes, show a message
    setStatus({
      type: 'info',
      message: `${provider} signup is not implemented yet.`
    });
  };

  return (
    <SignupPageContainer>
      <div className="star star1"></div>
      <div className="star star2"></div>
      <div className="star star3"></div>
      
      <SignupContent className="signup-content">
        <SignupHeader>
          <SignupTitle>Join the Adventure!</SignupTitle>
          <SignupSubtitle>Create your account and start exploring</SignupSubtitle>
        </SignupHeader>
        
        <GlassContainer padding="2.5rem" borderRadius="var(--radius-xl)">
          {status.message && (
            <StatusMessage className={status.type}>
              {status.message}
            </StatusMessage>
          )}
          
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <FormLabel htmlFor="fullName">Full Name</FormLabel>
              <FormInput
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                disabled={loading}
              />
              {errors.fullName && <FormError>{errors.fullName}</FormError>}
            </FormGroup>
            
            <TwoColumnForm>
              <FormGroup>
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormInput
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  disabled={loading}
                />
                {errors.email && <FormError>{errors.email}</FormError>}
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="username">Username</FormLabel>
                <FormInput
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  disabled={loading}
                />
                {errors.username && <FormError>{errors.username}</FormError>}
              </FormGroup>
            </TwoColumnForm>
            
            <TwoColumnForm>
              <FormGroup>
                <FormLabel htmlFor="password">Password</FormLabel>
                <FormInput
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  disabled={loading}
                />
                {errors.password && <FormError>{errors.password}</FormError>}
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                <FormInput
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  disabled={loading}
                />
                {errors.confirmPassword && <FormError>{errors.confirmPassword}</FormError>}
              </FormGroup>
            </TwoColumnForm>
            
            <CheckboxContainer>
              <CheckboxInput
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                disabled={loading}
              />
              <CheckboxLabel htmlFor="agreeTerms">
                I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
                {errors.agreeTerms && <FormError>{errors.agreeTerms}</FormError>}
              </CheckboxLabel>
            </CheckboxContainer>
            
            <FormButton type="submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </FormButton>
          </form>
          
          <FormDivider>
            <span>OR SIGN UP WITH</span>
          </FormDivider>
          
          <SocialLoginButtons>
            <SocialButton
              type="button"
              onClick={() => handleSocialSignup('Google')}
              aria-label="Sign up with Google"
            >
              <GoogleIcon />
            </SocialButton>
            <SocialButton
              type="button"
              onClick={() => handleSocialSignup('Facebook')}
              aria-label="Sign up with Facebook"
            >
              <FacebookIcon />
            </SocialButton>
            <SocialButton
              type="button"
              onClick={() => handleSocialSignup('GitHub')}
              aria-label="Sign up with GitHub"
            >
              <GithubIcon />
            </SocialButton>
          </SocialLoginButtons>
          
          <HelperLinks>
            Already have an account? <StyledLink to="/login">Log in</StyledLink>
          </HelperLinks>
        </GlassContainer>
      </SignupContent>
    </SignupPageContainer>
  );
};

export default SignupPage;