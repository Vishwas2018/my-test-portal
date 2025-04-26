// src/styles/index.js
// Main stylesheet entry point - imports all necessary styles

// Import global styles - this will import all other necessary stylesheets
import './global.css';

// Export anything that might need to be accessed from JavaScript
export const themeColors = {
  primary: '#6ECFFF',
  secondary: '#FF9E80',
  accent: '#7ED957',
  highlight: '#FFDE59',
  dark: '#4B5D67'
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1400px'
};