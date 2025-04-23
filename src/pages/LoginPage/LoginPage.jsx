import './LoginPage.css';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import GlassContainer from '../../components/common/GlassContainer/GlassContainer';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import useErrorHandler from '../../hooks/useErrorHandler';
import useForm from '../../hooks/useForm';
import { validateLoginForm } from '../../utils/validation';

// Styled components for LoginPage
const LoginPageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: var(--off-white);
  background-image: 
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%236ECFFF' fill-opacity='0.1'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"),
    radial-gradient(circle at 15% 50%, rgba(110, 207, 255, 0.15), transparent 25%),
    radial-gradient(circle at 85% 30%, rgba(126, 217, 87, 0.15), transparent 25%);
`;

const LoginContent = styled.div`
  width: 100%;
  max-width: 480px;
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const LoginTitle = styled.h1`
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

const LoginSubtitle = styled.p`
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
  border: 2px solid ${props => props.$hasError ? 'var(--error)' : 'var(--light-gray)'};
  border-radius: var(--radius-md);
  font-size: 1rem;
  transition: var(--transition-normal);
  background-color: ${props => props.$dark ? 'rgba(36, 40, 46, 0.1)' : 'rgba(255, 255, 255, 0.8)'};
  
  &:focus {
    border-color: ${props => props.$hasError ? 'var(--error)' : 'var(--primary)'};
    box-shadow: 0 0 0 3px ${props => props.$hasError 
      ? 'rgba(229, 62, 62, 0.3)' 
      : 'rgba(110, 207, 255, 0.3)'};
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
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.1);
  }
  
  &:active:not(:disabled) {
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
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
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

// Icons for social login buttons
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

const LoginPage = () => {
  const [status, setStatus] = useState({ type: '', message: '' });
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { error, handleAsyncError } = useErrorHandler();

  // Get redirect path if coming from a protected route
  const from = location.state?.from || '/dashboard';

  // Initialize form with useForm hook and validation
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    validateForm
  } = useForm(
    { username: '', password: '' },
    (values) => {
      const validation = validateLoginForm(values);
      return validation.errors;
    }
  );

  // Show error from error handler if present
  useEffect(() => {
    if (error) {
      setStatus({
        type: 'error',
        message: error.message || 'An unexpected error occurred. Please try again.'
      });
    }
  }, [error]);

  const performLogin = async () => {
    // Clear status before attempting login
    setStatus({ type: '', message: '' });
    
    // Attempt to login with auth service
    const result = await login(values);
    
    if (!result.success) {
      setStatus({
        type: 'error',
        message: result.message || 'Login failed. Please check your credentials.'
      });
      return;
    }
    
    // Show success message briefly before redirecting
    setStatus({
      type: 'success',
      message: 'Login successful! Redirecting...'
    });
    
    // Redirect after a short delay
    setTimeout(() => {
      navigate(from, { replace: true });
    }, 1000);
  };

  const handleSocialLogin = (provider) => {
    // For demo purposes, show a message
    setStatus({
      type: 'info',
      message: `${provider} login is not implemented yet.`
    });
  };

  return (
    <LoginPageContainer>
      <LoginContent>
        <LoginHeader>
          <LoginTitle>Welcome Back!</LoginTitle>
          <LoginSubtitle>Log in to continue your learning adventure</LoginSubtitle>
        </LoginHeader>
        
        <GlassContainer padding="2.5rem" borderRadius="var(--radius-xl)">
          {status.message && (
            <StatusMessage className={status.type}>
              {status.message}
            </StatusMessage>
          )}
          
          <form onSubmit={handleSubmit(performLogin)}>
            <FormGroup>
              <FormLabel htmlFor="username">Username or Email</FormLabel>
              <FormInput
                type="text"
                id="username"
                name="username"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your username or email"
                disabled={isSubmitting}
                $hasError={touched.username && errors.username}
              />
              {touched.username && errors.username && (
                <FormError>{errors.username}</FormError>
              )}
            </FormGroup>
            
            <FormGroup>
              <FormLabel htmlFor="password">Password</FormLabel>
              <FormInput
                type="password"
                id="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your password"
                disabled={isSubmitting}
                $hasError={touched.password && errors.password}
              />
              {touched.password && errors.password && (
                <FormError>{errors.password}</FormError>
              )}
            </FormGroup>
            
            <FormButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Log In'}
            </FormButton>
          </form>
          
          <FormDivider>
            <span>OR CONTINUE WITH</span>
          </FormDivider>
          
          <SocialLoginButtons>
            <SocialButton
              type="button"
              onClick={() => handleSocialLogin('Google')}
              aria-label="Sign in with Google"
            >
              <GoogleIcon />
            </SocialButton>
            <SocialButton
              type="button"
              onClick={() => handleSocialLogin('Facebook')}
              aria-label="Sign in with Facebook"
            >
              <FacebookIcon />
            </SocialButton>
            <SocialButton
              type="button"
              onClick={() => handleSocialLogin('GitHub')}
              aria-label="Sign in with GitHub"
            >
              <GithubIcon />
            </SocialButton>
          </SocialLoginButtons>
          
          <HelperLinks>
            <div>
              <StyledLink to="/forgot-password">Forgot your password?</StyledLink>
            </div>
            <div>
              Don't have an account? <StyledLink to="/signup">Sign up</StyledLink>
            </div>
          </HelperLinks>
        </GlassContainer>
      </LoginContent>
    </LoginPageContainer>
  );
};

export default LoginPage;