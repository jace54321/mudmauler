// src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Checkout-page.css";

// --- Payment Method Data ---
const paymentMethods = [
    { id: 'visa', name: 'Visa', logo: 'Visa' },
    { id: 'mastercard', name: 'Mastercard', logo: 'MC' },
    { id: 'gcash', name: 'GCash', logo: 'G' },
];

// Helper to format currency
const formatPHP = (amount) =>
    amount.toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2
    });

// --- Data Fetching and Calculation Functions ---

const getCartItems = () => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
};

const calculateCartTotals = (cartItems) => {
    const SHIPPING_FEE = 0.00;
    const TAX_RATE = 0.08;

    const subtotal = cartItems.reduce((acc, item) =>
        acc + (item.price * item.quantity), 0
    );

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

    // Recalculate if the cart might change while on this page
    useEffect(() => {
        setTotals(calculateCartTotals(getCartItems()));
    }, []);

    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const handlePlaceOrder = async () => {
        if (totals.total === 0) {
            alert("Cannot place an empty order!");
            return;
        }

        const sessionId = localStorage.getItem("sessionId");
        if (!sessionId) {
            alert("Please log in to place an order");
            navigate("/login");
            return;
        }

        setIsPlacingOrder(true);

        try {
            const cartItems = getCartItems();
            const orderItems = cartItems.map(item => ({
                productId: item.id,
                quantity: item.quantity
            }));

            const response = await fetch('http://localhost:8080/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Session-Id': sessionId
                },
                body: JSON.stringify({ items: orderItems })
            });

            if (response.ok) {
                // FIXED: Removed "const data =" to fix unused variable warning
                await response.json();

                // 1. Clear the cart from local storage
                localStorage.removeItem("cart");

                // 2. Navigate to the new Success Page
                navigate("/purchased");

            } else {
                const errorData = await response.json();
                alert(`Failed to place order: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Error connecting to server. Please try again.");
        } finally {
            setIsPlacingOrder(false);
        }
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
                                <span>{formatPHP(totals.total)}</span>
                            </div>

                            <div className="checkout-actions">
                                <button
                                    className="place-order-btn"
                                    onClick={handlePlaceOrder}
                                    disabled={totals.total === 0 || isPlacingOrder}
                                >
                                    {isPlacingOrder ? "Placing Order..." : "Place Order"}
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