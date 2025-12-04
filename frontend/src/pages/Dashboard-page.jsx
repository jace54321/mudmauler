import React, { useState, useEffect } from "react";
import "../styles/Dashboard-page.css";

import heroTireImage from "../assets/hero-tire-1.jpg";
import DashboardNavbar from "../components/DashboardNavbar";

const DashboardPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const slides = [
    {
      title: "ULTIMATE TRACTION",
      subtitle: "PERFORMANCE",
      productName: "MX PRO 500",
      description: "Superior grip on all terrains.",
      image: heroTireImage,
    },
    {
      title: "EXTREME DURABILITY",
      subtitle: "ENDURANCE",
      productName: "TRAIL MASTER X",
      description: "Built for rough and extreme off-road use.",
      image: heroTireImage,
    },
    {
      title: "PREMIUM COMFORT",
      subtitle: "LUXURY",
      productName: "SILENT GRIP",
      description: "Low noise, high comfort for long road trips.",
      image: heroTireImage,
    },
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <div className="dashboard-container">

      {/* NAVBAR COMPONENT */}
      <DashboardNavbar onMenuOpen={() => setSidebarOpen(true)} />

      {/* HERO SECTION */}
      <div className="hero-section">
        <img src={slide.image} className="hero-image" />
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <h2 className="hero-title">{slide.title}</h2>
          <h3 className="hero-subtitle">{slide.subtitle}</h3>
          <h1 className="hero-product">{slide.productName}</h1>
          <p className="hero-description">{slide.description}</p>
          <button className="hero-btn">DISCOVER MORE</button>
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

        {/* Dots */}
        <div className="dots">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`dot ${currentSlide === i ? "active" : ""}`}
              onClick={() => setCurrentSlide(i)}
            ></div>
          ))}
        </div>
      </div>

      {/* SIDEBAR */}
      {sidebarOpen && (
        <>
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />

          <div className="sidebar">
            <div className="sidebar-header">
              <span className="sidebar-title">MENU</span>
              <button className="close-btn" onClick={() => setSidebarOpen(false)}>
                ✕
              </button>
            </div>

            <div className="sidebar-profile">
              <img src="https://i.pravatar.cc/150" className="sidebar-pic" />
            </div>

            <div className="sidebar-links">
              <a href="/profile">Profile</a>
              <a href="/services">Services</a>
              <a href="/settings">Settings</a>
              <a href="/support">Support</a>
            </div>

            <button className="logout-btn">Logout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
