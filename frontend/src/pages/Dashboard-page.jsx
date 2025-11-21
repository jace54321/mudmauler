import React, { useState, useEffect } from 'react';
import '../styles/Dashboard-page.css';

import heroTireImage from '../assets/hero-tire-1.jpg';

const DashboardPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const slides = [
    {
      id: 1,
      title: "ULTIMATE TRACTION",
      subtitle: "PERFORMANCE",
      productName: "MX PRO 500",
      description: "MUDMAULER's exclusive compound delivering superior grip on any terrain.",
      image: heroTireImage,
    },
    {
      id: 2,
      title: "EXTREME DURABILITY",
      subtitle: "ENDURANCE",
      productName: "TRAIL MASTER X",
      description: "Engineered for the toughest off-road conditions and extended lifespan.",
      image: heroTireImage,
    },
    {
      id: 3,
      title: "PREMIUM COMFORT",
      subtitle: "LUXURY",
      productName: "SILENT GRIP",
      description: "Advanced noise reduction technology for a whisper-quiet ride.",
      image: heroTireImage,
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentSlideData = slides[currentSlide];

  return (
    <div className="dashboard-container">

      {/* Navigation */}
      <nav className="dashboard-nav">
        <div className="nav-content">

          {/* Mobile Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(true)}
          >
            <svg width="24" height="24" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          <div className="logo-section">
            <span className="logo-text">MUDMAULER</span>
            <span className="logo-subtitle">PERFORMANCE TIRES</span>
          </div>

          <div className="nav-links">
            <a href="/" className="nav-link active">HOME</a>
            <a href="/about" className="nav-link">ABOUT US</a>
            <a href="/tires" className="nav-link">TIRES</a>
            <a href="/news" className="nav-link">NEWS</a>
            <a href="/dealers" className="nav-link">DEALERS</a>
          </div>

          <div className="search-container">
            <svg className="search-icon" viewBox="0 0 24 24" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input type="search" placeholder="SEARCH ..." className="search-input" />
          </div>

        </div>
      </nav>

      {/* Hero */}
      <div className="hero-section">
        <div className="hero-background">
          <img src={currentSlideData.image} alt="" className="hero-image" />
          <div className="hero-overlay"></div>
        </div>

        <div className="hero-content">
          <div className="hero-text-container">
            <h2 className="hero-title">{currentSlideData.title}</h2>
            <h3 className="hero-subtitle">{currentSlideData.subtitle}</h3>
            <h1 className="hero-product-name">{currentSlideData.productName}</h1>
            <p className="hero-description">{currentSlideData.description}</p>
            <button className="hero-button">DISCOVER MORE</button>
          </div>
        </div>

        <button className="nav-arrow nav-arrow-left" onClick={prevSlide}>
          <svg width="24" height="24" stroke="white" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <button className="nav-arrow nav-arrow-right" onClick={nextSlide}>
          <svg width="24" height="24" stroke="white" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        <div className="dots-indicator">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`dot ${currentSlide === index ? "active" : ""}`}
            ></button>
          ))}
        </div>
      </div>

      {/* SIDEBAR (new clean version) */}
      {sidebarOpen && (
        <>
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />

          <div className="custom-sidebar">
            <div className="custom-sidebar-header">
              <img
                src="https://dummyimage.com/140x60/ffffff/000.png&text=Logo"
                className="custom-logo"
                alt="Logo"
              />

              <button
                className="custom-close-btn"
                onClick={() => setSidebarOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="custom-profile-section">
              <img
                src="https://i.pravatar.cc/300"
                alt="Profile"
                className="custom-profile-img"
              />
            </div>

            <div className="custom-menu-list">
              <a className="custom-menu-item" href="/profile">Profile</a>
              <a className="custom-menu-item" href="/services">Services</a>
              <a className="custom-menu-item" href="/expertise">Expertise</a>
              <a className="custom-menu-item" href="/settings">Setting</a>
            </div>

            <div className="custom-logout-container">
              <button className="custom-logout-btn">Logout</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
