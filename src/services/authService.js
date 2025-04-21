// src/services/authService.js
import { STORAGE_KEYS } from '../utils/constants';

/**
 * Securely hash a string (for demo purposes only)
 * In production, use a proper backend service with secure hashing
 */
const secureHash = (str) => {
  if (!str) return '';
  
  // Simple hash for demonstration purposes only
  return Array.from(str)
    .reduce((hash, char) => (hash << 5) - hash + char.charCodeAt(0), 0)
    .toString(16);
};

/**
 * Storage utility functions with error handling
 */
const storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error retrieving ${key} from storage:`, error);
      return defaultValue;
    }
  },
  
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error saving ${key} to storage:`, error);
      return false;
    }
  },
  
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
      return false;
    }
  }
};

/**
 * User operations
 */
const userOperations = {
  getUsers() {
    return storage.get(STORAGE_KEYS.USERS, []);
  },
  
  saveUsers(users) {
    return storage.set(STORAGE_KEYS.USERS, users);
  },
  
  findUserByUsername(username) {
    if (!username) return null;
    const users = this.getUsers();
    return users.find(user => 
      user.username.toLowerCase() === username.toLowerCase()
    );
  },
  
  findUserByEmail(email) {
    if (!email) return null;
    const users = this.getUsers();
    return users.find(user => 
      user.email.toLowerCase() === email.toLowerCase()
    );
  },
  
  getCurrentUser() {
    return storage.get(STORAGE_KEYS.CURRENT_USER);
  },
  
  setCurrentUser(user) {
    return storage.set(STORAGE_KEYS.CURRENT_USER, user);
  },
  
  clearCurrentUser() {
    return storage.remove(STORAGE_KEYS.CURRENT_USER);
  }
};

/**
 * Authentication Service
 */
const authService = {
  /**
   * Register a new user
   */
  register(userData) {
    const { username, email, password, fullName } = userData;
    
    // Validation
    if (!username || !email || !password) {
      return { 
        success: false, 
        message: 'Username, email, and password are required' 
      };
    }
    
    // Check for existing user
    if (userOperations.findUserByUsername(username)) {
      return { success: false, message: 'Username already exists' };
    }
    
    if (userOperations.findUserByEmail(email)) {
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
      const users = userOperations.getUsers();
      users.push(newUser);
      userOperations.saveUsers(users);
      
      // Return success with user data (excluding passwordHash)
      const { passwordHash, ...userWithoutPassword } = newUser;
      
      // Set current user in localStorage
      userOperations.setCurrentUser(userWithoutPassword);
      
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
  },
  
  /**
   * Login a user
   */
  login(credentials) {
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
      let user = userOperations.findUserByUsername(username) || 
                userOperations.findUserByEmail(username);
      
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
      userOperations.setCurrentUser(userWithoutPassword);
      
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
  },
  
  /**
   * Get the currently logged in user
   */
  getCurrentUser() {
    return userOperations.getCurrentUser();
  },
  
  /**
   * Logout the current user
   */
  logout() {
    try {
      userOperations.clearCurrentUser();
      return { success: true, message: 'Logout successful' };
    } catch (error) {
      console.error('Logout error:', error);
      return { 
        success: false, 
        message: error.message || 'Logout failed' 
      };
    }
  },
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.getCurrentUser();
  }
};

export default authService;