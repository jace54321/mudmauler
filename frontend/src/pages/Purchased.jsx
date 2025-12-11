// src/pages/Purchased.jsx
import React, { useState } from 'react'; // Import useState
import { Link } from 'react-router-dom';
import ReceiptModal from '../components/ReceiptModal'; // Import the new modal
import '../styles/Purchased.css';

const Purchased = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Define the mock data here so it can be passed to the modal
  const MOCK_RECEIPT_DATA = {
    orderId: 'ORD-20251211-54321',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    items: [
        { name: 'Vintage T-Shirt', price: 25.99, quantity: 1 },
        { name: 'Minimalist Sneakers', price: 89.99, quantity: 1 },
        { name: 'Leather Wallet', price: 45.00, quantity: 2 },
    ],
    subtotal: 205.98,
    shipping: 5.00,
    tax: 15.45,
    total: 226.43,
  };


  return (
    <div className="purchased-container">
      <div className="success-card-single"> {/* Adjusted class for single column */}

        {/* Success Icon */}
        <div className="checkmark-circle">
          <span className="success-icon">✓</span>
        </div>

        <h1>THANK YOU!</h1>
        <p>Your purchase was successful. Click the button below to view and download your receipt.</p>

        {/* NEW BUTTON TO OPEN MODAL */}
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

      {/* The Modal Component */}
      <ReceiptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        receiptData={MOCK_RECEIPT_DATA}
      />
    </div>
  );
};

export default Purchased;