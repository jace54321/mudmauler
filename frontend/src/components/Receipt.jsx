// src/components/Receipt.jsx
import React, { useRef, useEffect } from 'react';

// Placeholder data (Keep this or replace with real props)
const MOCK_RECEIPT_DATA = {
  orderId: 'ORD-20251211-54321',
  date: new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
  items: [
    { name: 'Vintage T-Shirt:', price: 25.99, quantity: 1 },
    { name: 'Minimalist Sneakers:', price: 89.99, quantity: 1 },
    { name: 'Leather Wallet:    ', price: 45.00, quantity: 2 },
  ],
  subtotal: 205.98,
  shipping: 5.00,
  tax: 15.45,
  total: 226.43,
};

// RECEIPT COMPONENT
const Receipt = ({ receiptData = MOCK_RECEIPT_DATA, onElementReady }) => {
  const { orderId, date, items, subtotal, shipping, tax, total } = receiptData;
  const receiptRef = useRef(null); // Ref to target the div

  const formatCurrency = (amount) => `$${amount.toFixed(2)}`;

  useEffect(() => {
      // Once the component (and its DOM element) is mounted,
      // pass the DOM reference and Order ID up to the modal
      if (onElementReady && receiptRef.current) {
          onElementReady(receiptRef.current, orderId);
      }
  }, [onElementReady, orderId]); // Re-run if props change

  return (
    // Attach the ref to the root element you want to capture
    <div className="receipt-card" ref={receiptRef}>
      {/* ... Existing Receipt JSX Structure ... */}
      <h2>🧾 Order Receipt</h2>

      <div className="receipt-header">
        <p><strong>Order ID:</strong> {orderId}</p>
        <p><strong>Date:</strong> {date}</p>
      </div>

      <hr />
      {/* Itemized List */}
      <div className="receipt-items">
        <div className="item-row header-row">
          <span>Item</span>
          <span className="right-align">Qty</span>
          <span className="right-align">Price</span>
        </div>
        {items.map((item, index) => (
          <div key={index} className="item-row">
            <span className="item-name">{item.name}</span>
            <span className="right-align">{item.quantity}</span>
            <span className="right-align">
              {formatCurrency(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>
      <hr />
      {/* Totals Section */}
      <div className="receipt-totals">
        <div className="total-row">
          <span>Subtotal:</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="total-row">
          <span>Shipping:</span>
          <span>{formatCurrency(shipping)}</span>
        </div>
        <div className="total-row">
          <span>Tax:</span>
          <span>{formatCurrency(tax)}</span>
        </div>
        <div className="total-row grand-total">
          <strong>Total Paid:</strong>
          <strong>{formatCurrency(total)}</strong>
        </div>
      </div>
    </div>
  );
};

export default Receipt;