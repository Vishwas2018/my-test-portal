// src/utils/constants.js
/**
 * Application constants to reduce hard-coded values
 */

// Local Storage Keys
export const STORAGE_KEYS = {
  USERS: 'portal_users',
  CURRENT_USER: 'portal_current_user',
  EXAM_RESULTS: 'exam_results',
  EXAM_PAPERS: 'exam_papers',
  STREAK_DATA: 'streak_data',
  TRIAL_INFO: 'trial_info',
  USER_SETTINGS: 'user_settings',
  AUTH_TOKEN: 'auth_token'
};

// Authentication
export const AUTH = {
  MIN_PASSWORD_LENGTH: 6,
  MIN_USERNAME_LENGTH: 3,
  TRIAL_DAYS: 7
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  EXAM: '/exam',
  RESULTS: '/results',
  TRIAL_SIGNUP: '/trial-signup',
  FEATURES: '/features',
  ABOUT: '/about',
  PRICING: '/pricing'
};

// Exam related constants
export const EXAM = {
  DEFAULT_TIME_LIMIT: 30, // minutes
  WARNING_TIMES: [300, 120, 60, 30], // seconds remaining when warnings should show
  QUESTION_TYPES: {
    MULTIPLE_CHOICE: 'multipleChoice',
    TRUE_FALSE: 'trueFalse',
    FILL_IN_BLANK: 'fillInBlank'
  }
};

// UI Constants
export const UI = {
  ANIMATION_DURATION: 300, // ms
  TOAST_DURATION: 5000, // ms
  MAX_TOASTS: 5,
  CONFETTI_DURATION: 5000, // ms
  SUCCESS_THRESHOLD: 80, // score percentage for success animation
};

// API Endpoints (for future use)
export const API = {
  BASE_URL: 'https://api.example.com',
  ENDPOINTS: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    EXAMS: '/exams'
  }
};

// Exam types with metadata
export const EXAM_TYPES = [
  { 
    id: 'naplan', 
    name: 'NAPLAN',
    description: 'Australian National Assessment Program - preparing students for literacy and numeracy testing',
    icon: '🏫'
  },
  { 
    id: 'icas', 
    name: 'ICAS',
    description: 'International Competitions and Assessments for Schools - comprehensive assessment for high achievers',
    icon: '🎓'
  },
  { 
    id: 'icas_all_stars', 
    name: 'ICAS All Stars',
    description: 'Advanced ICAS with comprehensive topics - challenging content for talented students',
    icon: '⭐'
  }
];

// Year levels
export const YEAR_LEVELS = [2, 3, 4, 5, 6, 7, 8, 9];