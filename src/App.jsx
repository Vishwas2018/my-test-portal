import './styles/global.css';
import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Footer, Header } from './components/layout';

import AboutPage from './pages/AboutPage';
import ActivitiesPage from './pages/ActivitiesPage/ActivitiesPage';
import { AuthProvider } from './contexts/AuthContext';
import DashboardPage from './pages/DashboardPage';
import ErrorBoundary from './components/common/ErrorBoundary';
import ExamPage from './pages/ExamPage';
import { ExamProvider } from './contexts/ExamContext';
import ExamSelection from './pages/ExamSelection';
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
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/features" element={<div className="container page-content">Features Page (Coming Soon)</div>} />
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
                    {/* Add this exam route */}
                    <Route
                      path="/exam/:subjectId"
                      element={<ExamPage />}
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

                    {/* Contact Page for subscription inquiries */}
                    <Route path="/contact" element={<div className="container page-content">Contact Page (Coming Soon)</div>} />

                    {/* Sample Test Routes */}
                    <Route path="/sample-test/:examType" element={<ExamSelection isSampleTest={true} />} />
                    <Route path="/sample-test/:examType/year-:grade" element={<ExamSelection isSampleTest={true} />} />
                    <Route path="/sample-test/:examType/year-:grade/:subject" element={<ExamSelection isSampleTest={true} />} />

                    {/* Exam Selection Routes */}
                    <Route path="/exam-selection" element={<ExamSelection />} />
                    <Route path="/activities" element={<ActivitiesPage />} />
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