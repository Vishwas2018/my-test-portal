import './styles/global.css';
import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Footer, Header } from './components/layout';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import React from 'react';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Fixed route to use the actual login page component */}
            <Route path="/login" element={<LoginPage />} />
            {/* Use the same login page for signup with a prop to show signup form */}
            <Route path="/signup" element={<LoginPage initialForm="register" />} />
            <Route path="/features" element={<div className="container page-content">Features Page (Coming Soon)</div>} />
            <Route path="/pricing" element={<div className="container page-content">Pricing Page (Coming Soon)</div>} />
            <Route path="/about" element={<div className="container page-content">About Page (Coming Soon)</div>} />
            <Route path="/dashboard" element={<div className="container page-content">Dashboard (Coming Soon)</div>} />
            <Route path="/demo" element={<div className="container page-content">Demo Page (Coming Soon)</div>} />
            <Route path="*" element={<div className="container page-content">Page Not Found</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;