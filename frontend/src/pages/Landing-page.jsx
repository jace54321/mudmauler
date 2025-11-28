import React, { useState } from "react";
import "../styles/landing-page.css";
import hero from "../assets/hero-bg.jpg";
import { Link } from "react-router-dom";

function LandingPage() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="landing-container">

            {/* NAVBAR */}
            <nav className="main-navbar">
                <h2 className="navbar-logo">MUDMAULER</h2>

                {/* Desktop Links */}
                <div className="navbar-right">
                    <Link to="/" className="navbar-link">Home</Link>
                    <Link to="/login" className="navbar-link">Login</Link>
                    <Link to="/register" className="navbar-btn">Sign Up</Link>
                </div>

                {/* Hamburger Menu Icon */}
                <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="mobile-menu">
                    <Link to="/" className="mobile-link" onClick={() => setMenuOpen(false)}>Home</Link>
                    <Link to="/login" className="mobile-link" onClick={() => setMenuOpen(false)}>Login</Link>
                    <Link to="/register" className="mobile-btn" onClick={() => setMenuOpen(false)}>Sign Up</Link>
                </div>
            )}

            {/* HERO */}
            <section className="hero" style={{ backgroundImage: `url(${hero})` }}>
                <div className="overlay"></div>
                <div className="hero-text">
                    <h1>MUDMAULER</h1>
                    <h2>DOMINATE THE DIRT</h2>
                    <p>
                        Premium off-road tires engineered for extreme terrain. When the path ends, your adventure begins.
                    </p>
                    <div className="hero-cta">
                        <a href="/shop" className="shop-btn">Shop Tires</a>
                        <a href="#feature" className="learn-btn">Learn More</a>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="mudjunkies-section" id="feature">
                <h2 className="mudjunkies-title">BUILT FOR MUD JUNKIES</h2>
                <p className="mudjunkies-subtitle">
                    Premium quality tires designed to conquer the most challenging off-road conditions
                </p>

                <div className="mudjunkies-cards">
                    <div className="mudjunkies-card">
                        <svg height="54" width="54" fill="none">
                            <circle cx="27" cy="27" r="27" fill="#f6ebeb"/>
                            <path d="M17 27h20l2 10H15l2-10zm2-7h16v7H19v-7zm-2 13h20"
                                  stroke="#c72626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <h3>Extreme Terrain</h3>
                        <p>Built for the toughest mud, rocks, and trails</p>
                    </div>

                    <div className="mudjunkies-card">
                        <svg height="54" width="54" fill="none">
                            <circle cx="27" cy="27" r="27" fill="#bd1919"/>
                            <path d="M21 33l6.5-13 6.5 13H21z"
                                  stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
                        </svg>
                        <h3>All-Season Performance</h3>
                        <p>Reliable grip in any weather condition</p>
                    </div>

                    <div className="mudjunkies-card">
                        <svg height="54" width="54" fill="none">
                            <circle cx="27" cy="27" r="27" fill="#f6ebeb"/>
                            <path d="M21 28l7-11-3 9h8l-7 11 3-9h-8z"
                                  stroke="#c72626" strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
                        </svg>
                        <h3>Maximum Durability</h3>
                        <p>Engineered to outlast the competition</p>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="footer">
                <p>© {new Date().getFullYear()} MUDMAULER. ALL RIGHTS RESERVED.</p>
            </footer>
        </div>
    );
}

export default LandingPage;
