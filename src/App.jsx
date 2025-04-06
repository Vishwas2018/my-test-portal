import './styles/global.css';
import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Footer, Header } from './components/layout'; // lowercase 'c'

import HomePage from './pages/HomePage';
// src/App.js
import React from 'react';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Add more routes as you develop additional pages */}
            <Route path="/login" element={<div className="container page-content">Login Page (Coming Soon)</div>} />
            <Route path="/signup" element={<div className="container page-content">Signup Page (Coming Soon)</div>} />
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