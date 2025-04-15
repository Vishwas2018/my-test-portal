import './styles/global.css';
import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Footer, Header } from './components/layout';
import React, { useEffect, useState } from 'react';

import { AuthProvider } from './contexts/AuthContext';
import DashboardPage from './pages/DashboardPage';
import ExamPage from './pages/ExamPage';
import { ExamProvider } from './contexts/ExamContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ResultsPage from './pages/ResultsPage';
import SignupPage from './pages/SignupPage';
import TrialSignup from './pages/TrialSignup';

function App() {
  // State to track dark mode
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage or system preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return savedMode === 'true';
    }
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark mode class to document when darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    // Save preference to localStorage
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e) => {
      // Only change if user hasn't explicitly set a preference
      if (localStorage.getItem('darkMode') === null) {
        setDarkMode(e.matches);
      }
    };

    // Add listener for system preference changes
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Older browsers
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <AuthProvider>
      <ExamProvider>
        <BrowserRouter>
          <div className="app">
            <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/features" element={<div className="container page-content">Features Page (Coming Soon)</div>} />
                <Route path="/pricing" element={<div className="container page-content">Pricing Page (Coming Soon)</div>} />
                <Route path="/about" element={<div className="container page-content">About Page (Coming Soon)</div>} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/exam/:subjectId"
                  element={
                    <ProtectedRoute>
                      <ExamPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/results/:subjectId/:timestamp"
                  element={
                    <ProtectedRoute>
                      <ResultsPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/trial-signup" element={<TrialSignup />} />
                <Route path="/demo" element={<div className="container page-content">Demo Page (Coming Soon)</div>} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </ExamProvider>
    </AuthProvider>
  );
}

export default App;