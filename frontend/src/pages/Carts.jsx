import React, { useState } from "react";

// Demo initial cart matches new PHP-based pricing
const initialCart = [
    {
        id: 1,
        name: "MAULER MX-PRO",
        price: 20581,
        category: "Mud Terrain",
        image: "/wheels/geolandar.png",
        quantity: 1,
        description: "Short Description of the item and its use"
    },
    {
        id: 2,
        name: "TRAILBLAZER AT",
        price: 17021,
        category: "All-Terrain",
        image: "/wheels/geolandar2.png",
        quantity: 1,
        description: "Short Description of the item and its use"
    },
    {
        id: 3,
        name: "MUDSLAYER XL",
        price: 23561,
        category: "Mud Terrain",
        image: "/wheels/geolandar.png",
        quantity: 1,
        description: "Short Description of the item and its use"
    }
];

// PHP currency formatter
const formatPHP = (amount) =>
    amount.toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2
    });

function Cart() {
    const [cart, setCart] = useState(initialCart);

    const increaseQty = id =>
        setCart(cart =>
            cart.map(item =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    const decreaseQty = id =>
        setCart(cart =>
            cart
                .map(item =>
                    item.id === id
                        ? { ...item, quantity: Math.max(1, item.quantity - 1) }
                        : item
                )
                .filter(item => item.quantity > 0)
        );
    const removeItem = id =>
        setCart(cart => cart.filter(item => item.id !== id));

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 0;
    const estTax = +(subtotal * 0.08).toFixed(2);
    const total = +(subtotal + shipping + estTax).toFixed(2);

    return (
        <section className="shopping-cart-section" style={{ maxWidth: 1200, margin: "auto", paddingTop: 30 }}>
            <h1 style={{ fontSize: "2.3em", fontWeight: 800, marginBottom: 0 }}>SHOPPING CART</h1>
            <p style={{ color: "#888" }}>{cart.length} items in your cart</p>
            <div className="cart-content-row" style={{ display: "flex", gap: 32 }}>
                {/* Cart items */}
                <div className="cart-items" style={{ flex: 1, display: "flex", flexDirection: "column", gap: 22 }}>
                    {cart.map(item => (
                        <div
                            className="cart-item-card"
                            key={item.id}
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                background: "#fff",
                                borderRadius: "10px",
                                boxShadow: "0 1px 9px #1112",
                                padding: "18px 20px",
                                gap: 18,
                                position: "relative"
                            }}
                        >
                            <img
                                src={item.image}
                                alt={item.name}
                                style={{
                                    width: 90,
                                    height: 90,
                                    objectFit: "contain",
                                    borderRadius: 7,
                                    background: "#f7f8fb"
                                }}
                            />
                            <div
                                className="cart-item-details"
                                style={{
                                    flex: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 8,
                                    position: "relative"
                                }}
                            >
                                <div>
                                    <h3 style={{ margin: 0, fontSize: "1.1em", fontWeight: "bold" }}>
                                        {item.name}
                                    </h3>
                                    <div className="cart-item-label" style={{ color: "#666", fontSize: "1em", marginTop: 2 }}>
                                        {item.category}
                                    </div>
                                    <span style={{ color: "#c00", fontWeight: 700, fontSize: "1.2em" }}>
                    {formatPHP(item.price)}
                  </span>
                                    <span className="cart-unit" style={{ marginLeft: 4, color: "#444" }}>per tire</span>
                                </div>
                                <div className="cart-item-controls" style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                                    <button
                                        onClick={() => decreaseQty(item.id)}
                                        disabled={item.quantity <= 1}
                                        style={{
                                            padding: "0 11px",
                                            borderRadius: 4,
                                            border: "1px solid #ccc",
                                            background: "#f2f2f2",
                                            color: "#333",
                                            fontWeight: "bold",
                                            fontSize: "1.1em",
                                            cursor: "pointer"
                                        }}
                                    >−</button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() => increaseQty(item.id)}
                                        style={{
                                            padding: "0 11px",
                                            borderRadius: 4,
                                            border: "1px solid #ccc",
                                            background: "#f2f2f2",
                                            color: "#333",
                                            fontWeight: "bold",
                                            fontSize: "1.1em",
                                            cursor: "pointer"
                                        }}
                                    >+</button>
                                </div>
                                <button
                                    className="cart-remove-btn"
                                    onClick={() => removeItem(item.id)}
                                    aria-label="Remove item"
                                    style={{
                                        position: "absolute",
                                        top: 2,
                                        right: 5,
                                        background: "none",
                                        border: "none",
                                        fontSize: "1.7em",
                                        color: "#c00",
                                        cursor: "pointer",
                                        fontWeight: "bold"
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                            <div className="cart-item-subtotal" style={{ textAlign: "right", fontSize: "1em", fontWeight: 500, color: "#222" }}>
                                Subtotal<br />
                                <span style={{ color: "#113", fontSize: "1.1em", fontWeight: 700 }}>{formatPHP(item.price * item.quantity)}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order summary */}
                <aside
                    className="cart-summary"
                    style={{
                        flexBasis: 330,
                        background: "#fff",
                        borderRadius: 10,
                        boxShadow: "0 0 7px #1221",
                        padding: "28px 28px 18px 28px",
                        height: "fit-content"
                    }}
                >
                    <h2 style={{ fontSize: "1.35em", fontWeight: 700, marginBottom: 13 }}>
                        ORDER SUMMARY
                    </h2>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 9 }}>
                        <span>Subtotal</span>
                        <span>{formatPHP(subtotal)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 9 }}>
                        <span>Shipping</span>
                        <span style={{ color: "#c00", fontWeight: 700 }}>FREE</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 9 }}>
                        <span>Estimated Tax</span>
                        <span>{formatPHP(estTax)}</span>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 14,
                            fontWeight: "bold",
                            color: "#c00",
                            fontSize: "1.15em",
                            borderTop: "2px solid #e3e3e3",
                            paddingTop: 8,
                            marginTop: 11
                        }}
                    >
                        <span>Total</span>
                        <span>{formatPHP(total)}</span>
                    </div>
                    <button
                        className="primary-btn"
                        style={{
                            fontSize: "1rem",
                            border: "none",
                            borderRadius: 6,
                            padding: "0.6em 2em",
                            marginTop: 7,
                            cursor: "pointer",
                            fontWeight: 600,
                            background: "#c00",
                            color: "#fff",
                            marginBottom: 8
                        }}
                    >
                        PROCEED TO CHECKOUT
                    </button>
                    <button
                        className="secondary-btn"
                        style={{
                            fontSize: "1rem",
                            borderRadius: 6,
                            padding: "0.6em 2em",
                            color: "#c00",
                            background: "#fff",
                            border: "2px solid #c00",
                            fontWeight: 600,
                            cursor: "pointer"
                        }}
                    >
                        CONTINUE SHOPPING
                    </button>
                </aside>
            </div>
        </section>
    );
}

export default Cart;
