import React from "react";
import { Link } from "react-router-dom"; // Import Link
import "../styles/shop.css";

export default function Footer() {
  return (
    <footer className="shop-footer">
      <div className="footer-content">

        {/* Column 1: Brand */}
        <div className="footer-column brand-column">
          <div className="footer-logo-wrapper">
            <h2 className="footer-logo">MUDMAULER</h2>
            <span className="footer-sublogo">PERFORMANCE TIRES</span>
          </div>
          <p className="footer-tagline">Conquering every terrain since 2010.</p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-column">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/shop">Our Tires</Link></li>
          </ul>
        </div>

        {/* Column 3: Products */}
        <div className="footer-column">
          <h3>Products</h3>
          <ul>
            {/* Replaced href="#" with valid Link to="/shop" placeholders */}
            <li><Link to="/shop">Mud Terrain Tires</Link></li>
            <li><Link to="/shop">All-Terrain Tires</Link></li>
            <li><Link to="/shop">Highway Tires</Link></li>
            <li><Link to="/shop">Commercial Tires</Link></li>
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div className="footer-column">
          <h3>Contact</h3>
          <ul className="contact-list">
            <li>info@mudmauler.com</li>
            <li>+1 (555) 123-4567</li>
            <li>1234 Off-Road Drive</li>
            <li>Adventure City, AC 12345</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Mudmauler Performance Tires. All rights reserved.</p>
      </div>
    </footer>
  );
}