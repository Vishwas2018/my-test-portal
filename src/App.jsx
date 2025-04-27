import './styles/global.css';
import './App.css';

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Footer, Header } from './components/layout';

import AboutPage from './pages/AboutPage';
import { AuthProvider } from './contexts/AuthContext';
import DashboardPage from './pages/DashboardPage';
import ErrorBoundary from './components/common/ErrorBoundary';
import ExamPage from './pages/ExamPage/ExamPage';
import { ExamProvider } from './contexts/ExamContext';
import Exams from './pages/Exams/Exams'; // New unified Exams component
import FeaturesPage from './pages/FeaturesPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import PricingPage from './pages/PricingPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import React from 'react';
import ResultsPage from './pages/ResultsPage';
import SignupPage from './pages/SignupPage';
import TrialSignup from './pages/TrialSignup';
import UserProfilePage from './pages/UserProfilePage';
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
          <BrowserRouter future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}>
            <div className="app">
              <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              <main className="main-content">
                <ErrorBoundary>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/features" element={<FeaturesPage />} />
                    <Route path="/trial-signup" element={<TrialSignup />} />

                    {/* New unified Exams route */}
                    <Route path="/exams" element={<Exams />} />

                    {/* Exam taking route */}
                    <Route path="/exam/:subjectId" element={<ExamPage />} />

                    {/* Redirects from old routes to new Exams page */}
                    <Route path="/activities" element={<Navigate to="/exams" replace />} />
                    <Route path="/sample-test/:examType" element={<Navigate to="/exams" replace />} />
                    <Route path="/sample-test/:examType/year-:grade" element={<Navigate to="/exams" replace />} />
                    <Route path="/sample-test/:examType/year-:grade/:subject" element={<Navigate to="/exams" replace />} />

                    {/* Protected routes */}
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
                          <UserProfilePage />
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

                    {/* Placeholder routes */}
                    <Route
                      path="/demo"
                      element={<div className="container page-content">Demo Page (Coming Soon)</div>}
                    />
                    <Route
                      path="/contact"
                      element={<div className="container page-content">Contact Page (Coming Soon)</div>}
                    />

                    {/* Catch-all route */}
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