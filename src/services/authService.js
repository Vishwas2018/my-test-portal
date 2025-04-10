// src/services/authService.js
/**
 * Authentication service for handling user registration and login
 * This is a simple localStorage implementation for demonstration
 * In a real application, you would connect to a backend API
 */

// Key for storing users in localStorage
const USERS_STORAGE_KEY = 'portal_users';
const CURRENT_USER_KEY = 'portal_current_user';

/**
 * Get all registered users from localStorage
 * @returns {Array} Array of user objects
 */
const getUsers = () => {
  const users = localStorage.getItem(USERS_STORAGE_KEY);
  return users ? JSON.parse(users) : [];
};

/**
 * Save users array to localStorage
 * @param {Array} users - Array of user objects
 */
const saveUsers = (users) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
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
  const { username, email, password } = userData;
  
  // Check if username or email already exists
  if (findUserByUsername(username)) {
    return { success: false, message: 'Username already exists' };
  }
  
  if (findUserByEmail(email)) {
    return { success: false, message: 'Email already exists' };
  }
  
  // Create new user object (in a real app, password would be hashed)
  const newUser = {
    id: Date.now().toString(), // Simple ID generation
    username,
    email,
    password, // WARNING: In a real app, never store plain text passwords
    createdAt: new Date().toISOString(),
  };
  
  // Add to users array
  const users = getUsers();
  users.push(newUser);
  saveUsers(users);
  
  // Return success with user data (excluding password)
  const { password: _, ...userWithoutPassword } = newUser;
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
  
  // Check if user exists and password matches
  if (!user) {
    return { success: false, message: 'User not found' };
  }
  
  if (user.password !== password) {
    return { success: false, message: 'Incorrect password' };
  }
  
  // Save current user to localStorage (without password)
  const { password: _, ...userWithoutPassword } = user;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
  
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
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

/**
 * Logout the current user
 */
const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
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