import React, { useState, useRef, useCallback, useEffect } from "react";
import "../styles/landing-page.css";
import heroBg from "../assets/hero-bg.jpg"; // optional fallback if you want
import e1 from "../assets/e1.png";
import e2 from "../assets/e2.png";
import e3 from "../assets/e3.png";
import { Link } from "react-router-dom";

const DraggableCard = ({ image, title, description, index }) => {
  const cardRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
  }, [position]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
  }, [isDragging, startPos]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setStartPos({ x: touch.clientX - position.x, y: touch.clientY - position.y });
  }, [position]);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setPosition({ x: touch.clientX - startPos.x, y: touch.clientY - startPos.y });
  }, [isDragging, startPos]);

  const handleTouchEnd = useCallback(() => setIsDragging(false), []);

  return (
    <div
      ref={cardRef}
      className={`draggable-card ${isDragging ? 'dragging' : ''}`}
      style={{ transform: `translate(${position.x}px, ${position.y}px)`, animationDelay: `${index * 0.15}s` }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <img src={image} alt={title} className="card-image" draggable={false} />
      <div className="card-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const slides = [e1, e2, e3]; // hero carousel images
  const [activeSlide, setActiveSlide] = useState(0);

  // autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % slides.length);
    }, 4000); // 4s
    return () => clearInterval(interval);
  }, [slides.length]);

  const goTo = (index) => setActiveSlide((index + slides.length) % slides.length);
  const prev = () => goTo(activeSlide - 1);
  const next = () => goTo(activeSlide + 1);

  const cards = [
    { image: e1, title: "GEOLANDAR A/T4", description: "All-terrain performance for every adventure. Engineered grip for any surface." },
    { image: e2, title: "EXTREME OFF-ROAD", description: "Conquer the most challenging terrain with unmatched durability and traction." },
    { image: e3, title: "DESERT WARRIOR", description: "Built for sand, rock, and everything in between. Maximum endurance." },
  ];

  return (
    <div className="landing-container">
      <nav className="main-navbar">
        <h2 className="navbar-logo">MUDMAULER</h2>
        <div className="navbar-right">
          <Link to="/" className="navbar-link">Home</Link>
          <Link to="/about" className="navbar-link">About</Link>
          <Link to="/tires" className="navbar-link">Tires</Link>
          <Link to="/login" className="navbar-link">Login</Link>
          <Link to="/register" className="navbar-btn">Sign Up</Link>
        </div>
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <div></div><div></div><div></div>
        </div>
      </nav>

      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-link" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/about" className="mobile-link" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/tires" className="mobile-link" onClick={() => setMenuOpen(false)}>Tires</Link>
          <Link to="/login" className="mobile-link" onClick={() => setMenuOpen(false)}>Login</Link>
          <Link to="/register" className="mobile-btn" onClick={() => setMenuOpen(false)}>Sign Up</Link>
        </div>
      )}

      <section className="hero">
        {/* carousel slides (background images) */}
        <div className="hero-slider" aria-hidden="true">
          {slides.map((src, idx) => (
            <div
              key={idx}
              className={`slide ${activeSlide === idx ? "active" : ""}`}
              style={{ backgroundImage: `url(${src})` }}
            />
          ))}
        </div>

        {/* overlay and content */}
        <div className="overlay"></div>

        <button className="slider-arrow prev" onClick={prev} aria-label="Previous slide">&lt;</button>
        <button className="slider-arrow next" onClick={next} aria-label="Next slide">&gt;</button>

        <div className="hero-text animate-fade-in">
          <h1>MUDMAULER</h1>
          <h2>DOMINATE THE DIRT</h2>
          <p>Premium off-road tires engineered for extreme terrain. When the path ends, your adventure begins.</p>
          <div className="hero-cta">
            <a href="/shop" className="shop-btn">Shop Tires</a>
            <a href="#features" className="learn-btn">Learn More</a>
          </div>
          <div className="hero-carousel">
            {slides.map((_, dot) => (
              <span
                key={dot}
                className={`carousel-dot ${activeSlide === dot ? 'active' : ''}`}
                onClick={() => goTo(dot)}
                aria-label={`Go to slide ${dot + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="features-section" id="features">
        <h2 className="features-title">BUILT FOR MUD JUNKIES</h2>
        <p className="features-subtitle">Premium quality tires designed to conquer the most challenging off-road conditions. Drag the cards to explore!</p>
        <div className="features-grid">
          {cards.map((card, index) => (
            <DraggableCard key={index} image={card.image} title={card.title} description={card.description} index={index} />
          ))}
        </div>
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} MUDMAULER. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
};

export default LandingPage;