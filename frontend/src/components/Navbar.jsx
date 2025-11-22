import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";

const Navbar = ({ isSignedIn, setIsSignedIn }) => {
    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <div className="logo">MUDMAULER</div>
            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/shop">Shop</Link></li>
            </ul>
            <div className="nav-actions">
                <button
                    className="cart-btn"
                    onClick={() => navigate("/cart")}
                    aria-label="Cart"
                >
                    <FaShoppingCart size={20} />
                </button>
                {!isSignedIn ? (
                    <Link to="/login" className="quote-btn">Login</Link>
                ) : (
                    <>
                        <button
                            className="profile-btn"
                            onClick={() => navigate("/profile")}
                            aria-label="Profile"
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                marginLeft: "10px"
                            }}
                        >
                            <FaUserCircle size={22} />
                        </button>
                        <button
                            className="quote-btn"
                            onClick={() => {
                                setIsSignedIn(false);
                                navigate("/login");
                            }}
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
