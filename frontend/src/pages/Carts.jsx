import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/carts.css";

const formatPHP = (amount) =>
    amount.toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2
    });

export default function Cart() {
    const navigate = useNavigate();

    // FIXED: Load data immediately inside useState (Lazy Initialization).
    // This prevents the cart from being overwritten with [] on the first render.
    const [cart, setCart] = useState(() => {
        const stored = localStorage.getItem("cart");
        return stored ? JSON.parse(stored) : [];
    });

    // Save to localStorage whenever the cart state changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const increaseQty = (id) =>
        setCart((items) =>
            items.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );

    const decreaseQty = (id) =>
        setCart((items) =>
            items
                .map((item) =>
                    item.id === id
                        ? { ...item, quantity: Math.max(1, item.quantity - 1) }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );

    const removeItem = (id) =>
        setCart((items) => items.filter((item) => item.id !== id));

    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const estTax = +(subtotal * 0.08).toFixed(2);
    const total = subtotal + estTax;

    const handleCheckout = () => {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }
        navigate("/checkout", { state: { cart, total } });
    };

    return (
        <section className="shopping-cart-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>SHOPPING CART</h1>
                <button
                    className="secondary-btn"
                    style={{ width: 'auto', padding: '0.5em 1.5em' }}
                    onClick={() => navigate("/shop")}
                >
                    Back to Shop
                </button>
            </div>

            <p>{cart.length} items in your cart</p>

            <div className="cart-content-row">

                <div className="cart-items">
                    {cart.length === 0 && (
                        <p style={{ padding: "20px", color: "#777" }}>
                            Your cart is empty.
                        </p>
                    )}

                    {cart.map((item) => (
                        <div className="cart-item-card" key={item.id}>
                            <img src={item.image} alt={item.name} />

                            <div className="cart-item-details">
                                <h3>{item.name}</h3>
                                <div className="cart-item-label">{item.category}</div>

                                <span className="cart-item-price">
                                    {formatPHP(item.price)}
                                </span>
                                <span className="cart-unit">per tire</span>

                                <div className="cart-item-controls">
                                    <button
                                        onClick={() => decreaseQty(item.id)}
                                        disabled={item.quantity <= 1}
                                    >
                                        –
                                    </button>

                                    <span>{item.quantity}</span>

                                    <button onClick={() => increaseQty(item.id)}>
                                        +
                                    </button>
                                </div>

                                <button
                                    className="cart-remove-btn"
                                    onClick={() => removeItem(item.id)}
                                >
                                    ×
                                </button>
                            </div>

                            <div className="cart-item-subtotal">
                                Subtotal<br />
                                <span>{formatPHP(item.price * item.quantity)}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <aside className="cart-summary">
                    <h2>ORDER SUMMARY</h2>

                    <div className="cart-summary-row">
                        <span>Subtotal</span>
                        <span>{formatPHP(subtotal)}</span>
                    </div>

                    <div className="cart-summary-row">
                        <span>Estimated Tax</span>
                        <span>{formatPHP(estTax)}</span>
                    </div>

                    <div className="cart-total-row">
                        <span>Total</span>
                        <span>{formatPHP(total)}</span>
                    </div>

                    <button className="primary-btn" onClick={handleCheckout}>
                        PROCEED TO CHECKOUT
                    </button>

                    <button
                        className="secondary-btn"
                        onClick={() => navigate("/shop")}
                    >
                        CONTINUE SHOPPING
                    </button>
                </aside>

            </div>
        </section>
    );
}