import React, { useState } from "react";
import "../styles/Dashboard-page.css";
import avatar from "../assets/prof.png"; //

const DashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-root">
      {/* Overlay for the sidebar */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <img className="sidebar-logo" src="https://placehold.co/170x38?text=MUDMAULER" alt="Logo" />
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>&times;</button>
        </div>
        <div className="sidebar-profile">
          <img className="sidebar-avatar" src={avatar} alt="Profile" />
        </div>
        <nav className="sidebar-links">
          <a href="/profile">Profile</a>
          <a href="#">Services</a>
          <a href="#">Expertise</a>
          <a href="#">Setting</a>
        </nav>
        <button className="sidebar-logout">Logout</button>
      </aside>

      {/* Main page content */}
      <div className="dashboard-container">
        {/* Top Navbar */}
        <nav className="dashboard-navbar">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
            <span className="menu-icon"></span>
          </button>
          <span className="dashboard-logo">MUDMAULER</span>
          <ul className="dashboard-nav-links">
            <li><a href="/">HOME</a></li>
            <li><a href="/about">ABOUT</a></li>
            <li><a href="/tires">TIRES</a></li>
          </ul>
          <div className="dashboard-nav-actions">
            <input className="dashboard-search" type="text" placeholder="search" />
            <button className="cart-btn">
              <span className="cart-icon">&#128722;</span>
            </button>
          </div>
        </nav>
        {/* Main content */}
        <main className="dashboard-main">
          <section className="dashboard-hero">
            <div className="hero-placeholder">
              <div className="carousel-dots">
                <span className="dot active"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          </section>
          <section className="dashboard-cards-row">
            <div className="dashboard-card card-1"></div>
            <div className="dashboard-card card-2"></div>
            <div className="dashboard-card card-3"></div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
