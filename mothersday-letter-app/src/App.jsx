// src/App.jsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import HomePage from './components/HomePage';
import LetterPage from './components/LetterPage';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <Heart className="navbar-icon" size={24} />
            <span>Heartfelt Letters</span>
          </Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/letter/:id" element={<LetterPage />} />
      </Routes>

      <footer className="footer">
        <div className="footer-content">
          <p className="footer-text">Send love with a handwritten touch 💌</p>
          <p className="footer-copyright">© {new Date().getFullYear()} Heartfelt Letters</p>
        </div>
      </footer>
    </div>
  );
}

export default App;