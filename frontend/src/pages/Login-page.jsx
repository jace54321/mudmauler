import React from "react";
import "../styles/login-page.css";
import tire from '../assets/tire-img.png';

const LoginPage = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div className="login-container">

            {/* LEFT SIDE (background + overlay + text) */}
            <div className="login-left">
                <div className="tire-bg" style={{ backgroundImage: `url(${tire})` }}></div>
                <div className="bg-overlay"></div>

                <div className="mudmauler-text">MUDMAULER</div>

                <div className="login-left-welcome">
                    WELCOME <span className="highlight">BACK!</span>
                </div>
            </div>

            {/* RIGHT SIDE WHITE CARD */}
            <div className="login-right">
                <div className="login-card">

                    <h1 className="login-title">LOGIN</h1>
                    <p className="login-desc">Enter your credentials to access your account</p>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <label>Email address</label>
                        <input type="email" placeholder="Enter your email" required />

                        <label>Password</label>
                        <input type="password" placeholder="Enter your password" required />

                        <div className="login-options">
                            <label>
                                <input type="checkbox" /> Remember me
                            </label>
                            <span className="forgot-pwd">Forgot Password?</span>
                        </div>

                        <button className="login-btn">Login</button>
                    </form>

                    <div className="signup-link">
                        Don't have an account? <a href="/register">Sign Up</a>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default LoginPage;
