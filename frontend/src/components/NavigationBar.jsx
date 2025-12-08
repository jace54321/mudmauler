import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import "../styles/navigation-bar.css";

const MergedNavbar = ({ isSignedIn, setIsSignedIn, onMenuOpen }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
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

        {/* Mobile menu button */}
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
        </div>

        {/* Right side icons */}
        <div className="nav-actions" ref={dropdownRef}>
          {isSignedIn && (
            <button className="cart-btn" onClick={() => navigate("/cart")}>
              <FaShoppingCart size={20} color="white" />
            </button>
          )}

          {isSignedIn ? (
            <>
              {/* Profile icon */}
              <button
                className="profile-btn"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                <FaUserCircle size={36} color="white" />
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="profile-dropdown">

                  {/* FIXED → Go to Profile */}
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      navigate("/profile");
                      setDropdownOpen(false);
                    }}
                  >
                    Settings
                  </button>

                  <button
                    className="dropdown-item logout"
                    onClick={() => {
                        // ❌ DO NOT CLEAR ALL STORAGE
                        // localStorage.clear();

                        // ✅ ONLY REMOVE SESSION ID (logout)
                        localStorage.removeItem("sessionId");

                        // Update signed-in state
                        setIsSignedIn(false);

                        // Close dropdown
                        setDropdownOpen(false);

                        // Redirect to login
                        navigate("/login");
                    }}
                  >
                    Logout
                  </button>


                </div>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default MergedNavbar;
