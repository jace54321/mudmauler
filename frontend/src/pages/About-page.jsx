import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User, ArrowRight } from "lucide-react";
import "../styles/About-page.css";
import heroBanner from "../assets/magic.png";
import tireProduct from "../assets/tire-product.png";

const AboutPage = () => {
  return (
    <div className="about-page">
      {/* Header section removed */}

      {/* Hero Banner */}
      <section className="hero-banner">
        <img src={heroBanner} alt="Off-road vehicles" className="hero-image" />
        <div className="hero-overlay" />
        <div className="hero-gradient" />
        <div className="hero-content">
          <div className="hero-title-box">
            <h1 className="hero-title">About Us</h1>
          </div>
        </div>
      </section>

      {/* Company Profile */}
      <section className="section section-dark">
        <div className="container">
          <div className="grid-two-col">
            <div className="fade-in">
              <h2 className="section-title">Company Profile</h2>
              <div className="text-content">
                <p>
                  Mudmauler Performance Tires is a premier manufacturer and distributor
                  of high-performance off-road tires, serving adventure enthusiasts and
                  commercial operators across the nation.
                </p>
                <p>
                  Our complete product line includes mud terrain, all-terrain, and
                  highway tires designed for passenger vehicles, light trucks,
                  commercial trucks, and heavy-duty applications.
                </p>
                <p>
                  Since our establishment in 2010, Mudmauler has built an extensive
                  dealer network throughout the country, partnering with trusted
                  tire dealers and automotive specialists in every major region.
                </p>
                <p>
                  We are also a trusted supplier of original equipment tires to
                  vehicle manufacturers and fleet operators nationwide.
                </p>
              </div>
            </div>
            <div className="fade-in delay-1">
              <img src={tireProduct} alt="Mudmauler tire" className="product-image" />
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="section section-darker">
        <div className="container">
          <div className="philosophy-content fade-in">
            <h2 className="section-title">Our Philosophy</h2>
            <p className="philosophy-text">
              Mudmauler aims to be the leading off-road tire brand, known for our
              exceptional quality products, unwavering commitment to customer
              satisfaction, and deep understanding of what adventurers and
              professionals truly need. We don't just meet expectations—we exceed them.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section section-dark">
        <div className="container">
          <div className="values-grid">
            {[
              {
                title: "Quality",
                description: "Every tire undergoes rigorous testing to ensure maximum durability and performance in the toughest conditions."
              },
              {
                title: "Innovation",
                description: "We continuously invest in R&D to develop cutting-edge tread patterns and rubber compounds."
              },
              {
                title: "Trust",
                description: "Built on decades of reliability, our reputation speaks through every mile our customers travel."
              }
            ].map((item, index) => (
              <div key={item.title} className={`value-card fade-in delay-${index + 1}`}>
                <h3 className="value-title">{item.title}</h3>
                <p className="value-description">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Team CTA */}
      <section className="section section-darker cta-section">
        <div className="container">
          <h2 className="cta-title fade-in">Be Part of Our Team</h2>
          <p className="cta-text fade-in delay-1">
            Join the Mudmauler family and help us push the boundaries of off-road
            performance. We're always looking for passionate individuals.
          </p>
          <button className="cta-button fade-in delay-2">
            View Job Openings
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link to="/" className="logo">
                <span className="logo-text">MUDMAULER</span>
                <span className="logo-tagline">PERFORMANCE TIRES</span>
              </Link>
              <p className="footer-tagline">Conquering every terrain since 2010.</p>
            </div>

            <div className="footer-links">
              <h4 className="footer-heading">Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/tires">Our Tires</Link></li>
              </ul>
            </div>

            <div className="footer-links">
              <h4 className="footer-heading">Products</h4>
              <ul>
                <li>Mud Terrain Tires</li>
                <li>All-Terrain Tires</li>
                <li>Highway Tires</li>
                <li>Commercial Tires</li>
              </ul>
            </div>

            <div className="footer-links">
              <h4 className="footer-heading">Contact</h4>
              <ul>
                <li>info@mudmauler.com</li>
                <li>+1 (555) 123-4567</li>
                <li>1234 Off-Road Drive</li>
                <li>Adventure City, AC 12345</li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2024 Mudmauler Performance Tires. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;