// src/pages/CheckoutPage.jsx (FIXED for Cart Reflection)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Checkout-page.css"; // Ensure this uses your latest professional CSS

// --- Payment Method Data ---
const paymentMethods = [
    { id: 'visa', name: 'Visa', logo: 'Visa' },
    { id: 'mastercard', name: 'Mastercard', logo: 'MC' },
    { id: 'gcash', name: 'GCash', logo: 'G' },
];

// Helper to format currency (Moved out of component for cleanliness)
const formatPHP = (amount) =>
    amount.toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2
    });

// --- Data Fetching and Calculation Functions ---

// 1. Function to fetch cart items from localStorage
const getCartItems = () => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
};

// 2. Function to calculate totals (matches Carts.jsx logic exactly)
const calculateCartTotals = (cartItems) => {
    const SHIPPING_FEE = 0.00; // MUST match Carts.jsx implied shipping
    const TAX_RATE = 0.08;    // MUST match Carts.jsx (0.08)

    const subtotal = cartItems.reduce((acc, item) =>
        acc + (item.price * item.quantity), 0
    );

    // Note: We don't use .toFixed(2) here for the intermediate calculation to keep it numeric
    const taxAmount = subtotal * TAX_RATE;

    const total = subtotal + SHIPPING_FEE + taxAmount;

    return {
        subtotal: subtotal,
        shipping: SHIPPING_FEE,
        taxRate: TAX_RATE,
        tax: taxAmount,
        total: total,
    };
};

// Function to get the user's default shipping address (Mock, remains the same)
const getMockShippingAddress = () => {
    return {
        name: "Joseph",
        address: "7XJ+QFR, Natalio B. Bacalso Ave, Cebu City, 6000 Cebu"
    };
};

// --- Checkout Page Component ---

export default function CheckoutPage() {
    const navigate = useNavigate();

    // State to hold calculated totals
    const [totals, setTotals] = useState(calculateCartTotals(getCartItems()));
    const [shippingAddress] = useState(getMockShippingAddress());
    const [selectedPayment, setSelectedPayment] = useState("visa");

    // Optional: Recalculate if the cart *might* change while on this page
    useEffect(() => {
        // This ensures the totals are fresh when the page loads
        setTotals(calculateCartTotals(getCartItems()));
    }, []);

    const handlePlaceOrder = () => {
        if (totals.total === 0) {
            alert("Cannot place an empty order!");
            return;
        }
        // Ideally, here you'd call a payment API, clear the cart in localStorage, and navigate.
        alert(`Order Total: ${formatPHP(totals.total)} placed successfully!`);

        // Mock success steps:
        localStorage.removeItem("cart");
        navigate("/order-confirmation");
    };

    return (
        <div className="checkout-page-container">
            <div className="checkout-main-card">

                <div className="checkout-content">

                    {/* Left Column: Payment and Shipping */}
                    <div className="checkout-left-column">

                        {/* -------------------- PAYMENT METHOD SECTION -------------------- */}
                        <div className="checkout-section payment-section">
                            <h2 className="section-title">1. Select Payment Method</h2>
                            <div className="payment-options">
                                {paymentMethods.map((method) => (
                                    <div
                                        key={method.id}
                                        className={`payment-card ${selectedPayment === method.id ? 'selected' : ''}`}
                                        onClick={() => setSelectedPayment(method.id)}
                                    >
                                        <div className="payment-logo-placeholder" data-logo={method.logo}>
                                        </div>
                                        <p className="payment-name">{method.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* -------------------- SHIPPING ADDRESS SECTION -------------------- */}
                        <div className="checkout-section shipping-section">
                            <h2 className="section-title">2. Shipping Address</h2>
                            <div className="address-details-box">
                                <p className="address-text">{shippingAddress.address}</p>
                                <button className="change-address-btn">CHANGE</button>
                            </div>
                        </div>

                    </div> {/* End Left Column */}


                    {/* Right Column: Order Summary */}
                    <div className="checkout-right-column">

                        {/* -------------------- ORDER SUMMARY SECTION -------------------- */}
                        <div className="order-summary-section">
                            <h3 className="summary-header">Order Summary</h3>

                            <div className="summary-details">
                                <div className="summary-item">
                                    <span>Sub-total</span>
                                    <span>{formatPHP(totals.subtotal)}</span>
                                </div>
                                <div className="summary-item">
                                    <span>Shipping</span>
                                    <span>{formatPHP(totals.shipping)}</span>
                                </div>
                                <div className="summary-item summary-tax">
                                    <span>Estimated Tax ({totals.taxRate * 100}%)</span>
                                    <span>{formatPHP(totals.tax)}</span>
                                </div>
                            </div>

                            <div className="summary-total">
                                <span>TOTAL</span>
                                {/* Rounding the final total for display, matching Carts.jsx behavior */}
                                <span>{formatPHP(totals.total)}</span>
                            </div>

                            <div className="checkout-actions">
                                <button
                                    className="place-order-btn"
                                    onClick={handlePlaceOrder}
                                    disabled={totals.total === 0}
                                >
                                    Place Order
                                </button>
                                <button
                                    className="cancel-btn"
                                    onClick={() => navigate('/cart')}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div> {/* End Right Column */}

                </div> {/* End checkout-content */}
            </div> {/* End checkout-main-card */}
        </div>
    );
}