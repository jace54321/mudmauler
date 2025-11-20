import React, { useState } from "react";
// import { FaShoppingCart } from "react-icons/fa"; // Uncomment when using this icon

const Navbar = () => {
    // Simulate authentication state (replace with your real logic/context/auth hook)
    const [isSignedIn, setIsSignedIn] = useState(false);

    // Simulate logout (replace with your real logout logic)
    const handleLogout = () => {
        setIsSignedIn(false); // Remove token, call backend, etc.
        // Optionally redirect to home
    };

    return (
        <nav className="navbar">
            <div className="logo">MUDMAULER</div>
            <ul className="nav-links">
                <li><a href="/shop">Shop</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
            <div className="nav-actions">
                <button className="cart-btn">
                    {/* <FaShoppingCart size={20} /> */}
                    🛒
                    <span className="cart-count">0</span>
                </button>
                {!isSignedIn ? (
                    <>
                        <a href="/login" className="quote-btn">Login</a>
                    </>
                ) : (
                    // Show Logout if signed in
                    <button className="quote-btn" onClick={handleLogout}>Logout</button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
