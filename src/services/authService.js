/**
 * Enhanced authentication service with better security and error handling
 * 
 * This module provides authentication utilities including user registration, 
 * login, logout, and session management.
 */
import { STORAGE_KEYS } from '../utils/constants';

/**
 * More secure hash function for password protection
 * Note: This is still not production-ready, use a backend service with proper hashing
 * 
 * @param {string} str - String to hash
 * @param {string} [salt] - Optional salt to add to the hash
 * @returns {string} Hashed string
 */
const secureHash = (str, salt = '') => {
  // Use a more comprehensive algorithm than simple string manipulation
  let hash = 0;
  const combinedStr = str + salt;
  
  for (let i = 0; i < combinedStr.length; i++) {
    const char = combinedStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Add timestamp to make it harder to reverse
  const timestamp = Date.now().toString(36);
  const hexHash = Math.abs(hash).toString(16);
  
  return `${hexHash}${timestamp}`;
};

/**
 * Generate a random session token
 * 
 * @returns {string} Random session token
 */
const generateSessionToken = () => {
  // Create a random token for the session
  const randomPart = Math.random().toString(36).substring(2, 15);
  const timestampPart = Date.now().toString(36);
  return `${randomPart}${timestampPart}`;
};

/**
 * Get all registered users from localStorage
 * 
 * @returns {Array} Array of user objects
 * @throws {Error} If localStorage is not available or data is corrupted
 */
const getUsers = () => {
  try {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Failed to retrieve users from storage:', error);
    throw new Error('User data could not be retrieved. Storage may be corrupted.');
  }
};

/**
 * Save users array to localStorage
 * 
 * @param {Array} users - Array of user objects
 * @throws {Error} If localStorage is not available or data cannot be saved
 */
const saveUsers = (users) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (error) {
    console.error('Failed to save users to storage:', error);
    throw new Error('User data could not be saved. Storage may be full or unavailable.');
  }
};

/**
 * Safely store the current user in localStorage
 * 
 * @param {Object} user - User object without sensitive data
 * @param {string} token - Session token
 * @throws {Error} If localStorage is not available or data cannot be saved
 */
const setCurrentUser = (user, token) => {
  try {
    // Create a session object with user data and token
    const sessionData = {
      user,
      token,
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days from now
    };
    
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sessionData));
  } catch (error) {
    console.error('Failed to save current user to storage:', error);
    throw new Error('Session data could not be saved. Storage may be full or unavailable.');
  }
};

/**
 * Find a user by username (case insensitive)
 * 
 * @param {string} username - Username to search for
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
 * @param {string} email - Email to search for
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
 * @param {Object} userData - User data (username, email, password)
 * @returns {Object} Result object with success status and message
 * @throws {Error} If registration fails due to storage issues
 */
const register = (userData) => {
  try {
    const { username, email, password, fullName } = userData;
    
    // Validate required fields
    if (!username || !email || !password) {
      return { 
        success: false, 
        message: 'Username, email, and password are required' 
      };
    }
    
    // Check if username or email already exists
    if (findUserByUsername(username)) {
      return { success: false, message: 'Username already exists' };
    }
    
    if (findUserByEmail(email)) {
      return { success: false, message: 'Email already exists' };
    }
    
    // Generate a unique salt for this user
    const salt = Date.now().toString(36);
    
    // Create new user object with hashed password
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      fullName: fullName || username,
      passwordHash: secureHash(password, salt),
      salt, // Store salt for future password validation
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to users array
    const users = getUsers();
    users.push(newUser);
    saveUsers(users);
    
    // Generate session token
    const token = generateSessionToken();
    
    // Return success with user data (excluding password hash and salt)
    const { passwordHash, salt: userSalt, ...userWithoutSensitiveData } = newUser;
    
    // Set current user in localStorage
    setCurrentUser(userWithoutSensitiveData, token);
    
    return {
      success: true,
      message: 'Registration successful',
      user: userWithoutSensitiveData,
      token
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error('Registration failed. Please try again later.');
  }
};

/**
 * Login a user
 * 
 * @param {Object} credentials - Login credentials (username/email and password)
 * @returns {Object} Result object with success status and message
 * @throws {Error} If login fails due to storage issues
 */
const login = (credentials) => {
  try {
    const { username, password } = credentials;
    
    if (!username || !password) {
      return { 
        success: false, 
        message: 'Username/email and password are required' 
      };
    }
    
    // Try to find user by username (could be email)
    let user = findUserByUsername(username);
    
    // If not found by username, try email
    if (!user) {
      user = findUserByEmail(username);
    }
    
    // Check if user exists
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    
    // Verify password by comparing hashes
    const passwordHash = secureHash(password, user.salt);
    if (user.passwordHash !== passwordHash) {
      return { success: false, message: 'Incorrect password' };
    }
    
    // Generate session token
    const token = generateSessionToken();
    
    // Save current user to localStorage (without password hash and salt)
    const { passwordHash: _, salt: _salt, ...userWithoutSensitiveData } = user;
    
    // Set current user in localStorage
    setCurrentUser(userWithoutSensitiveData, token);
    
    return {
      success: true,
      message: 'Login successful',
      user: userWithoutSensitiveData,
      token
    };
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Login failed. Please try again later.');
  }
};

/**
 * Get the currently logged in user
 * 
 * @returns {Object|null} User object if logged in, null otherwise
 */
const getCurrentUser = () => {
  try {
    const sessionData = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!sessionData) return null;
    
    const session = JSON.parse(sessionData);
    
    // Check if session has expired
    if (session.expiresAt && Date.now() > session.expiresAt) {
      // Session expired, clear it
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      return null;
    }
    
    return session.user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Get the current session information including token and expiry
 * 
 * @returns {Object|null} Session object if logged in, null otherwise
 */
const getCurrentSession = () => {
  try {
    const sessionData = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!sessionData) return null;
    
    const session = JSON.parse(sessionData);
    
    // Check if session has expired
    if (session.expiresAt && Date.now() > session.expiresAt) {
      // Session expired, clear it
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Error getting current session:', error);
    return null;
  }
};

/**
 * Logout the current user
 * 
 * @returns {Object} Result object with success status and message
 */
const logout = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    return { success: true, message: 'Logout successful' };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, message: 'Logout failed' };
  }
};

/**
 * Check if user is authenticated
 * 
 * @returns {boolean} True if user is logged in, false otherwise
 */
const isAuthenticated = () => {
  const session = getCurrentSession();
  return !!session && !!session.user && !!session.token;
};

/**
 * Refresh the user session
 * 
 * @returns {Object} Result object with success status and message
 */
const refreshSession = () => {
  try {
    const session = getCurrentSession();
    if (!session || !session.user) {
      return { success: false, message: 'No active session to refresh' };
    }
    
    // Generate new token and expiry
    const token = generateSessionToken();
    const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days from now
    
    // Update session
    const updatedSession = {
      ...session,
      token,
      expiresAt
    };
    
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedSession));
    
    return { success: true, message: 'Session refreshed successfully' };
  } catch (error) {
    console.error('Session refresh error:', error);
    return { success: false, message: 'Failed to refresh session' };
  }
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  getCurrentSession,
  isAuthenticated,
  refreshSession
};

export default authService;