// ✅ Added Link import so navigation works without full page reload
import React from "react";
import { Link } from "react-router-dom";
import "../styles/DashboardNavbar.css";

const DashboardNavbar = ({ onMenuOpen }) => {
  return (
    <nav className="dashboard-nav">
      <div className="nav-content">

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={onMenuOpen}>
          <svg width="24" height="24" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        {/* Logo */}
        <div className="logo-section">
          <span className="logo-text">MUDMAULER</span>
          <span className="logo-subtitle">PERFORMANCE TIRES</span>
        </div>

        {/* Desktop Nav Links */}
        <div className="nav-links">
          {/* ❗ CHANGED <a> TO <Link> (fixes navigation) */}
          <Link to="/dashboard" className="nav-link active">Home</Link>
          <Link to="/about" className="nav-link">About</Link>

          {/* ❗ FIXED: Tires now goes to /shop */}
          <Link to="/shop" className="nav-link">Tires</Link>

          <Link to="/news" className="nav-link">News</Link>
          <Link to="/dealers" className="nav-link">Dealers</Link>
        </div>

        {/* Search */}
        <div className="search-container">
          <svg className="search-icon" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input type="search" placeholder="Search..." className="search-input" />
        </div>

      </div>
    </nav>
  );
};

export default DashboardNavbar;
