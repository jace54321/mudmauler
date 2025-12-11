// src/pages/Purchased.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation
import ReceiptModal from '../components/ReceiptModal';
import '../styles/Purchased.css';

const Purchased = () => {
  const location = useLocation();

  // Retrieve the receiptData passed from CheckoutPage, or fallback
  const checkoutReceiptData = location.state ? location.state.receiptData : null;

  // Fallback data structure for safety
  const receiptDataToUse = checkoutReceiptData || {
      orderId: 'N/A',
      date: 'N/A',
      items: [],
      subtotal: 0,
      shipping: 0,
      tax: 0,
      total: 0,
      paymentMethod: 'Unknown',
      shippingAddress: 'N/A',
      taxRate: 0
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="purchased-container">
      <div className="success-card-single">

        {/* Success Icon */}
        <div className="checkmark-circle">
          <span className="success-icon">✓</span>
        </div>

        <h1>THANK YOU!</h1>
        <p>Your purchase was successful. Click the button below to view and download your receipt.</p>

        {/* Button to open Modal */}
        <button
          className="btn-view-receipt"
          onClick={() => setIsModalOpen(true)}
        >
          View / Download Receipt
        </button>

        {/* Button to go to shop */}
        <Link to="/shop" className="btn-shop">
          Return to Shop
        </Link>
      </div>

      {/* The Modal Component - Pass the dynamic data */}
      <ReceiptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        receiptData={receiptDataToUse} // Pass the dynamic data
      />
    </div>
  );
};

export default Purchased;