import './styles/global.css';
import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Footer, Header } from './components/layout';

import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import React from 'react';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<LoginPage initialForm="register" />} />
              <Route path="/features" element={<div className="container page-content">Features Page (Coming Soon)</div>} />
              <Route path="/pricing" element={<div className="container page-content">Pricing Page (Coming Soon)</div>} />
              <Route path="/about" element={<div className="container page-content">About Page (Coming Soon)</div>} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <div className="container page-content">
                      <h1>Dashboard</h1>
                      <p>Welcome to your dashboard! This is a protected route.</p>
                    </div>
                  </ProtectedRoute>
                } 
              />
              <Route path="/demo" element={<div className="container page-content">Demo Page (Coming Soon)</div>} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;