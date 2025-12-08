import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Remove unused Navigate import
import "../styles/carts.css";

const initialCart = [ // Mock cart data. Update with real data later. fetch from backend.
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
    },
    {
        id: 6,
        name: "WINTER WARRIOR",
        price: 21711,
        category: "all-terrain",
        image: "/wheels/geolandar2.png",
        quantity: 1,
        description: "Short Description of the item and its use"
    }
];

const formatPHP = (amount) =>
    amount.toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2
    });

function Cart() {
    const navigate = useNavigate();
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

    const handleCheckout = () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        // Pass cart data to checkout page
        navigate('/checkout', { state: { cart, total } });
    };

    return (
        <section className="shopping-cart-section">
            <h1>SHOPPING CART</h1>
            <p>{cart.length} items in your cart</p>
            <div className="cart-content-row">
                <div className="cart-items">
                    {cart.map(item => (
                        <div className="cart-item-card" key={item.id}>
                            <img
                                src={item.image}
                                alt={item.name}
                            />
                            <div className="cart-item-details">
                                <div>
                                    <h3>{item.name}</h3>
                                    <div className="cart-item-label">{item.category}</div>
                                    <span className="cart-item-price">{formatPHP(item.price)}</span>
                                    <span className="cart-unit">per tire</span>
                                </div>
                                <div className="cart-item-controls">
                                    <button
                                        onClick={() => decreaseQty(item.id)}
                                        disabled={item.quantity <= 1}
                                    >−</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => increaseQty(item.id)}>+</button>
                                </div>
                                <button
                                    className="cart-remove-btn"
                                    onClick={() => removeItem(item.id)}
                                    aria-label="Remove item"
                                >×</button>
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
                    <div className="cart-summary-row shipping">
                        <span>Shipping</span>
                        <span className="value">FREE</span>
                    </div>
                    <div className="cart-summary-row">
                        <span>Estimated Tax</span>
                        <span>{formatPHP(estTax)}</span>
                    </div>
                    <div className="cart-total-row">
                        <span>Total</span>
                        <span>{formatPHP(total)}</span> 
                    </div>
                    <button 
                        className="primary-btn"
                        onClick={handleCheckout}
                    >
                        PROCEED TO CHECKOUT
                    </button>
                    <button 
                        className="secondary-btn"
                        onClick={() => navigate('/shop')}
                    >
                        CONTINUE SHOPPING
                    </button>
                </aside>
            </div>
        </section>
    );
}

export default Cart;
