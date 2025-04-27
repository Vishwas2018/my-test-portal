// src/contexts/ThemeContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

// Create context with default values
const ThemeContext = createContext({
  isDarkMode: false,
  toggleDarkMode: () => {},
  accessibilitySettings: {},
  updateAccessibilitySettings: () => {}
});

/**
 * ThemeProvider component that manages application theme and accessibility settings
 * Makes these settings available throughout the component tree
 */
export const ThemeProvider = ({ children }) => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Accessibility settings
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    fontSize: 1,
    highContrast: false,
    reduceMotion: false,
    dyslexicFont: false,
    lineHeight: 1.5,
    textSpacing: 0,
    colorMode: 'default'
  });
  
  // Check for saved preferences on initial render
  useEffect(() => {
    // Check for theme preference
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setIsDarkMode(storedTheme === 'dark');
    } else {
      // If no stored preference, check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
    
    // Check for accessibility settings
    const storedAccessibility = localStorage.getItem('accessibilitySettings');
    if (storedAccessibility) {
      try {
        setAccessibilitySettings(JSON.parse(storedAccessibility));
      } catch (error) {
        console.error('Failed to parse stored accessibility settings:', error);
      }
    }
  }, []);
  
  // Apply theme whenever it changes
  useEffect(() => {
    const html = document.documentElement;
    
    if (isDarkMode) {
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);
  
  // Apply accessibility settings when they change
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    
    // Set font size
    if (accessibilitySettings.fontSize) {
      body.style.fontSize = `${accessibilitySettings.fontSize}rem`;
    }
    
    // Set line height
    if (accessibilitySettings.lineHeight) {
      body.style.lineHeight = accessibilitySettings.lineHeight;
    }
    
    // Set word spacing
    if (accessibilitySettings.textSpacing !== undefined) {
      body.style.wordSpacing = `${accessibilitySettings.textSpacing}px`;
    }
    
    // High contrast mode
    if (accessibilitySettings.highContrast) {
      html.classList.add('high-contrast');
    } else {
      html.classList.remove('high-contrast');
    }
    
    // Reduced motion
    if (accessibilitySettings.reduceMotion) {
      html.classList.add('reduce-motion');
    } else {
      html.classList.remove('reduce-motion');
    }
    
    // Dyslexic font
    if (accessibilitySettings.dyslexicFont) {
      body.style.fontFamily = "'OpenDyslexic', sans-serif";
    } else {
      body.style.fontFamily = "";
    }
    
    // Color mode
    if (accessibilitySettings.colorMode) {
      html.setAttribute('data-color-mode', accessibilitySettings.colorMode);
    } else {
      html.removeAttribute('data-color-mode');
    }
    
    // Save settings to localStorage
    localStorage.setItem('accessibilitySettings', JSON.stringify(accessibilitySettings));
  }, [accessibilitySettings]);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };
  
  // Update accessibility settings
  const updateAccessibilitySettings = (newSettings) => {
    setAccessibilitySettings(prevSettings => ({
      ...prevSettings,
      ...newSettings
    }));
  };
  
  // Context value
  const value = {
    isDarkMode,
    toggleDarkMode,
    accessibilitySettings,
    updateAccessibilitySettings
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;