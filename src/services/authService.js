// src/services/authService.js
/**
 * Authentication service for handling user registration and login
 * Improved with better security practices
 */
import { STORAGE_KEYS } from '../utils/constants';

/**
 * Simple hash function for password obfuscation
 * Note: This is NOT secure enough for production, just a demo improvement
 * In production, use a proper backend with secure authentication
 * @param {string} str - String to hash
 * @returns {string} Hashed string
 */
const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16); // Convert to hex string
};

/**
 * Get all registered users from localStorage
 * @returns {Array} Array of user objects
 */
const getUsers = () => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

/**
 * Save users array to localStorage
 * @param {Array} users - Array of user objects
 */
const saveUsers = (users) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

/**
 * Find a user by username
 * @param {string} username - Username to search for
 * @returns {Object|null} User object if found, null otherwise
 */
const findUserByUsername = (username) => {
  const users = getUsers();
  return users.find(user => user.username.toLowerCase() === username.toLowerCase());
};

/**
 * Find a user by email
 * @param {string} email - Email to search for
 * @returns {Object|null} User object if found, null otherwise
 */
const findUserByEmail = (email) => {
  const users = getUsers();
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
};

/**
 * Register a new user
 * @param {Object} userData - User data (username, email, password)
 * @returns {Object} Result object with success status and message
 */
const register = (userData) => {
  const { username, email, password, fullName } = userData;
  
  // Check if username or email already exists
  if (findUserByUsername(username)) {
    return { success: false, message: 'Username already exists' };
  }
  
  if (findUserByEmail(email)) {
    return { success: false, message: 'Email already exists' };
  }
  
  // Create new user object with hashed password
  const newUser = {
    id: Date.now().toString(), // Simple ID generation
    username,
    email,
    fullName: fullName || username,
    passwordHash: simpleHash(password), // Store hash instead of plain text
    createdAt: new Date().toISOString(),
  };
  
  // Add to users array
  const users = getUsers();
  users.push(newUser);
  saveUsers(users);
  
  // Return success with user data (excluding password hash)
  const { passwordHash: _, ...userWithoutPassword } = newUser;
  
  // Set current user in localStorage
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));
  
  return {
    success: true,
    message: 'Registration successful',
    user: userWithoutPassword
  };
};

/**
 * Login a user
 * @param {Object} credentials - Login credentials (username/email and password)
 * @returns {Object} Result object with success status and message
 */
const login = (credentials) => {
  const { username, password } = credentials;
  
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
  if (user.passwordHash !== simpleHash(password)) {
    return { success: false, message: 'Incorrect password' };
  }
  
  // Save current user to localStorage (without password hash)
  const { passwordHash: _, ...userWithoutPassword } = user;
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));
  
  return {
    success: true,
    message: 'Login successful',
    user: userWithoutPassword
  };
};

/**
 * Get the currently logged in user
 * @returns {Object|null} User object if logged in, null otherwise
 */
const getCurrentUser = () => {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

/**
 * Logout the current user
 */
const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  return { success: true, message: 'Logout successful' };
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is logged in, false otherwise
 */
const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  isAuthenticated
};

export default authService;