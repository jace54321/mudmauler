// src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Checkout-page.css"; // Ensure this style file exists and is updated

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
    return stored ? JSON.parse(stored).map(item => ({
        ...item,
        price: parseFloat(item.price)
    })) : [];
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

    const [cartItems] = useState(getCartItems());
    const [totals, setTotals] = useState(calculateCartTotals(cartItems));

    // Shipping Address state
    const [shippingAddress, setShippingAddress] = useState(getMockShippingAddress());
    const [selectedPayment, setSelectedPayment] = useState("visa");

    // NEW STATE for inline editing
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [tempAddress, setTempAddress] = useState(shippingAddress);

    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    useEffect(() => {
        setTotals(calculateCartTotals(cartItems));
    }, [cartItems]);


    // Function to handle saving the new address
    const handleSaveAddress = () => {
        if (!tempAddress.name.trim() || !tempAddress.address.trim()) {
            alert('Name and address fields cannot be empty.');
            return;
        }

        // Update the permanent state
        setShippingAddress(tempAddress);
        // Exit editing mode
        setIsEditingAddress(false);
        // Optionally, save to local storage or API here
    };

    const handlePlaceOrder = async () => {
        if (totals.total === 0) {
            alert("Cannot place an empty order!");
            return;
        }
        if (isEditingAddress) {
            alert("Please save or cancel the address changes before placing the order.");
            return;
        }

        // 1. Get Session ID (Matches your Backend Controller)
        const sessionId = localStorage.getItem("sessionId");
        if (!sessionId) {
            alert("Please log in to place an order");
            navigate("/login");
            return;
        }

        setIsPlacingOrder(true);

        try {
            // 2. Prepare payload exactly as Backend expects (CreateOrderRequest)
            const orderPayload = {
                items: cartItems.map(item => ({
                    productId: item.id,
                    quantity: item.quantity
                }))
            };

            const response = await fetch('http://localhost:8080/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Session-Id': sessionId  // Sending the session ID header
                },
                body: JSON.stringify(orderPayload)
            });

            const data = await response.json();

            if (response.ok) {
                // --- Success! Backend has already deducted stock ---

                // Prepare receipt data
                const receiptData = {
                    orderId: `ORD-${data.orderId}`, // Use ID from backend response
                    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                    items: cartItems.map(item => ({
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity
                    })),
                    subtotal: totals.subtotal,
                    shipping: totals.shipping,
                    tax: totals.tax,
                    total: totals.total, // Or use data.totalAmount from backend to be safe
                    paymentMethod: paymentMethods.find(m => m.id === selectedPayment).name,
                    shippingAddress: shippingAddress.address,
                    taxRate: totals.taxRate
                };

                // Clear cart locally
                localStorage.removeItem("cart");

                // Navigate to success page
                navigate("/purchased", { state: { receiptData: receiptData } });

            } else {
                // --- Failure (e.g., Insufficient Stock) ---
                alert(`Failed to place order: ${data.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Error connecting to server. Please try again.");
        } finally {
            setIsPlacingOrder(false);
        }
    };

    const handleEditClick = () => {
        // When clicking CHANGE, initialize temp state with current address
        setTempAddress(shippingAddress);
        setIsEditingAddress(true);
    };

    const handleCancelEdit = () => {
        // Discard temp changes
        setIsEditingAddress(false);
    };

    // Helper function to update temp state for input changes
    const handleTempInputChange = (e) => {
        const { name, value } = e.target;
        setTempAddress(prev => ({ ...prev, [name]: value }));
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

                        {/* -------------------- SHIPPING ADDRESS SECTION (Inline Editing) -------------------- */}
                        <div className="checkout-section shipping-section">
                            <h2 className="section-title">2. Shipping Address</h2>

                            {isEditingAddress ? (
                                // --- EDITING VIEW ---
                                <div className="address-edit-box">
                                    <div className="form-group">
                                        <label htmlFor="recipient-name">Recipient Name</label>
                                        <input
                                            id="recipient-name"
                                            name="name"
                                            type="text"
                                            value={tempAddress.name}
                                            onChange={handleTempInputChange}
                                            className="address-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="full-address">Full Address</label>
                                        <textarea
                                            id="full-address"
                                            name="address"
                                            rows="3"
                                            value={tempAddress.address}
                                            onChange={handleTempInputChange}
                                            className="address-textarea"
                                        />
                                    </div>
                                    <div className="address-actions">
                                        <button className="btn-cancel-edit" onClick={handleCancelEdit}>
                                            Cancel
                                        </button>
                                        <button className="btn-save-address" onClick={handleSaveAddress}>
                                            Save Address
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // --- VIEWING MODE ---
                                <div className="address-details-box">
                                    <p className="address-recipient-name">Recipient: {shippingAddress.name}</p>
                                    <p className="address-text">{shippingAddress.address}</p>
                                    <button
                                        className="change-address-btn"
                                        onClick={handleEditClick}
                                    >
                                        CHANGE
                                    </button>
                                </div>
                            )}

                        </div> {/* End Shipping Address Section */}


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
                                    // Disable placing order if editing is active
                                    disabled={totals.total === 0 || isPlacingOrder || isEditingAddress}
                                >
                                    {isPlacingOrder ? "Placing Order..." : (isEditingAddress ? "Save Address First" : "Place Order")}
                                </button>
                                <button
                                    className="cancel-btn"
                                    onClick={() => navigate('/cart')}
                                    disabled={isEditingAddress}
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