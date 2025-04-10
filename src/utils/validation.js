// src/utils/validation.js
/**
 * Utility functions for form validation
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {Object} Validation result with isValid and message
   */
  export const validatePassword = (password) => {
    if (!password) {
      return { isValid: false, message: 'Password is required' };
    }
    
    if (password.length < 6) {
      return { isValid: false, message: 'Password must be at least 6 characters' };
    }
    
    // Add more complex validation if needed
    // const hasUpperCase = /[A-Z]/.test(password);
    // const hasLowerCase = /[a-z]/.test(password);
    // const hasNumber = /\d/.test(password);
    // const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return { isValid: true, message: '' };
  };
  
  /**
   * Validate username
   * @param {string} username - Username to validate
   * @returns {Object} Validation result with isValid and message
   */
  export const validateUsername = (username) => {
    if (!username) {
      return { isValid: false, message: 'Username is required' };
    }
    
    if (username.length < 3) {
      return { isValid: false, message: 'Username must be at least 3 characters' };
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return { 
        isValid: false, 
        message: 'Username can only contain letters, numbers, and underscores' 
      };
    }
    
    return { isValid: true, message: '' };
  };
  
  /**
   * Validate login form
   * @param {Object} data - Form data
   * @returns {Object} Validation result with isValid and errors
   */
  export const validateLoginForm = (data) => {
    const errors = {};
    
    if (!data.username) {
      errors.username = 'Username or email is required';
    }
    
    if (!data.password) {
      errors.password = 'Password is required';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  /**
   * Validate registration form
   * @param {Object} data - Form data
   * @returns {Object} Validation result with isValid and errors
   */
  export const validateRegisterForm = (data) => {
    const errors = {};
    
    // Validate username
    const usernameValidation = validateUsername(data.username);
    if (!usernameValidation.isValid) {
      errors.username = usernameValidation.message;
    }
    
    // Validate email
    if (!data.email) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(data.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Validate password
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.message;
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };