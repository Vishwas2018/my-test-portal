/**
 * Authentication Service
 * 
 * Handles user authentication operations including registration, login, and logout.
 * Uses localStorage for persistence in this demo but could be adapted for API calls.
 */

import { STORAGE_KEYS } from '../utils/constants';

/**
 * Securely hash a string (for demo purposes only)
 * Note: In production, use a proper backend service with secure hashing
 * 
 * @param {string} str - String to hash
 * @returns {string} - Hashed string
 */
const secureHash = (str) => {
  let hash = 0;
  if (!str || str.length === 0) return hash.toString(16);
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash &= hash; // Convert to 32bit integer
  }
  
  return hash.toString(16);
};

/**
 * Get all registered users from storage
 * 
 * @returns {Array} Array of user objects
 */
const getUsers = () => {
  try {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

/**
 * Save users to storage
 * 
 * @param {Array} users - Array of user objects to save
 */
const saveUsers = (users) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users:', error);
    throw new Error('Failed to save user data');
  }
};

/**
 * Find a user by username (case insensitive)
 * 
 * @param {string} username - Username to find
 * @returns {Object|null} User object if found, null otherwise
 */
const findUserByUsername = (username) => {
  if (!username) return null;
  const users = getUsers();
  return users.find(user => 
    user.username.toLowerCase() === username.toLowerCase()
  );
};

/**
 * Find a user by email (case insensitive)
 * 
 * @param {string} email - Email to find
 * @returns {Object|null} User object if found, null otherwise
 */
const findUserByEmail = (email) => {
  if (!email) return null;
  const users = getUsers();
  return users.find(user => 
    user.email.toLowerCase() === email.toLowerCase()
  );
};

/**
 * Register a new user
 * 
 * @param {Object} userData - User data including username, email, password
 * @returns {Object} Result with success status, message, and user data
 */
const register = (userData) => {
  const { username, email, password, fullName } = userData;
  
  // Validation
  if (!username || !email || !password) {
    return { 
      success: false, 
      message: 'Username, email, and password are required' 
    };
  }
  
  // Check for existing user
  if (findUserByUsername(username)) {
    return { success: false, message: 'Username already exists' };
  }
  
  if (findUserByEmail(email)) {
    return { success: false, message: 'Email already exists' };
  }
  
  try {
    // Create new user with hashed password
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      fullName: fullName || username,
      passwordHash: secureHash(password),
      createdAt: new Date().toISOString(),
    };
    
    // Add to users
    const users = getUsers();
    users.push(newUser);
    saveUsers(users);
    
    // Return success with user data (excluding passwordHash)
    const { passwordHash, ...userWithoutPassword } = newUser;
    
    // Set current user in localStorage
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));
    
    return {
      success: true,
      message: 'Registration successful',
      user: userWithoutPassword
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      message: error.message || 'Registration failed'
    };
  }
};

/**
 * Login a user
 * 
 * @param {Object} credentials - Login credentials with username/email and password
 * @returns {Object} Result with success status, message, and user data
 */
const login = (credentials) => {
  const { username, password } = credentials;
  
  // Validation
  if (!username || !password) {
    return { 
      success: false, 
      message: 'Username/email and password are required' 
    };
  }
  
  try {
    // Try to find user by username or email
    let user = findUserByUsername(username);
    
    if (!user) {
      // Try with email if username search failed
      user = findUserByEmail(username);
    }
    
    // Check if user exists
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    
    // Verify password
    if (user.passwordHash !== secureHash(password)) {
      return { success: false, message: 'Incorrect password' };
    }
    
    // Create user data without password
    const { passwordHash, ...userWithoutPassword } = user;
    
    // Save current user to localStorage
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));
    
    return {
      success: true,
      message: 'Login successful',
      user: userWithoutPassword
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: error.message || 'Login failed'
    };
  }
};

/**
 * Get the currently logged in user
 * 
 * @returns {Object|null} User object if logged in, null otherwise
 */
const getCurrentUser = () => {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Logout the current user
 * 
 * @returns {Object} Result with success status and message
 */
const logout = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    return { success: true, message: 'Logout successful' };
  } catch (error) {
    console.error('Logout error:', error);
    return { 
      success: false, 
      message: error.message || 'Logout failed' 
    };
  }
};

/**
 * Check if user is authenticated
 * 
 * @returns {boolean} True if user is logged in, false otherwise
 */
const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

// Export the authentication service
const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  isAuthenticated
};

export default authService;