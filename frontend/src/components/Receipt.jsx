// src/components/Receipt.jsx
import React, { useRef, useEffect } from 'react';

// RECEIPT COMPONENT
const Receipt = ({ receiptData, onElementReady }) => {
  // Destructure all expected fields, including the new ones
  const {
    orderId, date, items, subtotal, shipping, tax, total,
    paymentMethod, shippingAddress, taxRate
  } = receiptData;

  const receiptRef = useRef(null);

  // Use the same PHP formatting function from the checkout page
  const formatCurrency = (amount) =>
    amount.toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2
    });

  useEffect(() => {
      if (onElementReady && receiptRef.current) {
          onElementReady(receiptRef.current, orderId);
      }
  }, [onElementReady, orderId]);

  return (
    <div className="receipt-card" ref={receiptRef}>
      <h2>🧾 Order Receipt</h2>

      <div className="receipt-header">
        <p><strong>Order ID:</strong> {orderId}</p>
        <p><strong>Date:</strong> {date}</p>
      </div>

      {/* NEW: Payment and Shipping Details */}
      <div className="receipt-details-section">
          <p><strong>Paid Via:</strong> {paymentMethod || 'Credit/Debit Card'}</p>
          <p className="shipping-address-text">
            <strong>Ship To:</strong> {shippingAddress || 'Address not recorded'}
          </p>
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
          <div key={index} className="item-row" data-name={item.name}>
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
          <span>Sub-total</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="total-row">
          <span>Shipping</span>
          <span>{formatCurrency(shipping)}</span>
        </div>
        <div className="total-row">
          <span>Tax ({Math.round(taxRate * 100)}%)</span>
          <span>{formatCurrency(tax)}</span>
        </div>
        <div className="total-row grand-total">
          <strong>Total Paid</strong>
          <strong>{formatCurrency(total)}</strong>
        </div>
      </div>
    </div>
  );
};

export default Receipt;