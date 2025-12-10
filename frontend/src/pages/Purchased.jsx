// src/pages/Purchased.jsx
import React from 'react';
import { Link } from 'react-router-dom';
// Ensure this path is correct for your project structure
import '../styles/Purchased.css';

const Purchased = () => {
  return (
    <div className="purchased-container">
      <div className="success-card">

        {/* Success Icon */}
        <div className="checkmark-circle">
          <span className="success-icon">✓</span>
        </div>

        <h1>THANK YOU!</h1>
        <p>Your purchase was successful.</p>

        {/* Button to go to shop */}
        <Link to="/shop" className="btn-shop">
          Return to Shop
        </Link>

      </div>
    </div>
  );
};

export default Purchased;