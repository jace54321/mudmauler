import React from "react";
import { Link, useNavigate } from "react-router-dom";
// import { FaShoppingCart } from "react-icons/fa"; // Uncomment if you use the icon

const Navbar = ({ isSignedIn, setIsSignedIn }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        setIsSignedIn(false);
        navigate("/login"); // Redirect to login page after logout
    };

    return (
        <nav className="navbar">
            <div className="logo">MUDMAULER</div>
            <ul className="nav-links">
                <li><Link to="/shop">Shop</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact</Link></li>
            </ul>
            <div className="nav-actions">
                <button className="cart-btn">
                    {/* <FaShoppingCart size={20} /> */}
                    🛒
                    <span className="cart-count">0</span>
                </button>
                {!isSignedIn ? (
                    <Link to="/login" className="quote-btn">Login</Link>
                ) : (
                    <button className="quote-btn" onClick={handleLogout}>Logout</button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
