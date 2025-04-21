import './styles/global.css';
import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Footer, Header } from './components/layout';

import { AuthProvider } from './contexts/AuthContext';
import DashboardPage from './pages/DashboardPage';
import ErrorBoundary from './components/common/ErrorBoundary';
import ExamPage from './pages/ExamPage';
import { ExamProvider } from './contexts/ExamContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import React from 'react';
import ResultsPage from './pages/ResultsPage';
import SettingsPage from './pages/SettingsPage/SettingsPage'; // Add this import
import SignupPage from './pages/SignupPage';
import TrialSignup from './pages/TrialSignup';
import { useDarkMode } from './hooks';

/**
 * Main App component that sets up routing and context providers
 */
function App() {
  // Use the improved dark mode hook
  const [darkMode, toggleDarkMode] = useDarkMode();

  return (
    <ErrorBoundary>
      <AuthProvider>
        <ExamProvider>
          <BrowserRouter>
            <div className="app">
              <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              <main className="main-content">
                <ErrorBoundary>
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
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute>
                          <SettingsPage />
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
                </ErrorBoundary>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </ExamProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;