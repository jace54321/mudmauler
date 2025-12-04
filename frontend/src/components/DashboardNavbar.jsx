import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import "../styles/DashboardNavbar.css";

const MergedNavbar = ({ onMenuOpen, setIsSignedIn }) => {
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

        {/* Links */}
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
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

        {/* Right Icons */}
        <div className="nav-actions" ref={dropdownRef}>

          {/* Cart */}
          <button className="cart-btn" onClick={() => navigate("/cart")}>
            <FaShoppingCart size={20} color="white" />
          </button>

          {/* Profile with Dropdown */}
          <button
            className="profile-btn"
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-label="Profile"
          >
            <FaUserCircle size={36} color="white" />
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="profile-dropdown">
              <button className="dropdown-item" onClick={() => navigate("/settings")}>
                Settings
              </button>

              <button
                className="dropdown-item logout"
                onClick={() => {
                  setIsSignedIn(false);
                  setDropdownOpen(false);
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
};

export default MergedNavbar;
