import './AuthForms.css';
import './toggle-box.css';

import React, { useState } from 'react';

// Social Media Icons
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" fill="#4285F4"/>
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
  </svg>
);

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

export const AuthForms = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);

  const toggleForm = () => {
    setIsLoginForm(!isLoginForm);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {isLoginForm ? (
          <>
            <div className="auth-left blue-side">
              <h2>Hello, Welcome!</h2>
              <p>Don't have an account?</p>
              <button className="auth-secondary-btn" onClick={toggleForm}>
                Register
              </button>
            </div>
            <div className="auth-right">
              <h2>Login</h2>
              <form>
                <div className="form-group">
                  <div className="input-icon">
                    <UserIcon />
                  </div>
                  <input type="text" placeholder="Username" />
                </div>
                <div className="form-group">
                  <div className="input-icon">
                    <LockIcon />
                  </div>
                  <input type="password" placeholder="Password" />
                </div>
                <div className="form-link">
                  <a href="#">Forgot Password?</a>
                </div>
                <button className="auth-primary-btn">Login</button>
                <div className="social-login">
                  <p>or login with social platforms</p>
                  <div className="social-icons">
                    <button className="social-icon-btn">
                      <GoogleIcon />
                    </button>
                    <button className="social-icon-btn">
                      <FacebookIcon />
                    </button>
                    <button className="social-icon-btn">
                      <GithubIcon />
                    </button>
                    <button className="social-icon-btn">
                      <LinkedInIcon />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </>
        ) : (
          <>
            <div className="auth-left">
              <h2>Registration</h2>
              <form>
                <div className="form-group">
                  <div className="input-icon">
                    <UserIcon />
                  </div>
                  <input type="text" placeholder="Username" />
                </div>
                <div className="form-group">
                  <div className="input-icon">
                    <EmailIcon />
                  </div>
                  <input type="email" placeholder="Email" />
                </div>
                <div className="form-group">
                  <div className="input-icon">
                    <LockIcon />
                  </div>
                  <input type="password" placeholder="Password" />
                </div>
                <button className="auth-primary-btn">Register</button>
                <div className="social-login">
                  <p>or register with social platforms</p>
                  <div className="social-icons">
                    <button className="social-icon-btn">
                      <GoogleIcon />
                    </button>
                    <button className="social-icon-btn">
                      <FacebookIcon />
                    </button>
                    <button className="social-icon-btn">
                      <GithubIcon />
                    </button>
                    <button className="social-icon-btn">
                      <LinkedInIcon />
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="auth-right blue-side">
              <h2>Welcome Back!</h2>
              <p>Already have an account?</p>
              <button className="auth-secondary-btn" onClick={toggleForm}>
                Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthForms;