import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login-page.css";
import tire from '../assets/tire-img.png';

// IMPORTANT—Add setIsSignedIn as a prop!
const LoginPage = ({ setIsSignedIn }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await fetch('http://localhost:8080/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            let data = {};
            try {
                data = await response.json();
            } catch {
                setError("Invalid server response");
                return;
            }

            // -----------------------------
            //     LOGIN SUCCESS
            // -----------------------------
            if (response.ok) {
                console.log("LOGIN RESPONSE:", data);

                setIsSignedIn(true);

                // SAVE SESSION
                localStorage.setItem("sessionId", data.sessionId);

                // SAVE PROFILE FIELDS
                localStorage.setItem("userFirst", data.firstName || "");
                localStorage.setItem("userLast", data.lastName || "");
                localStorage.setItem("userEmail", data.email || "");
                localStorage.setItem("userPhone", data.phone || "");
                localStorage.setItem("userAddress", data.address || "");
                localStorage.setItem("userRole", data.role || "USER");

                setSuccess("Login successful!");
                // Redirect to admin dashboard if user is admin, otherwise to shop
                if (data.role === "ADMIN") {
                    navigate("/admin");
                } else {
                    navigate("/shop");
                }
                return;
            }

            setError(data.message || "Login failed");

        } catch {
            setError("Error connecting to server");
        }
    };

    return (
        <div className="login-container">
            <div className="login-left">
                <div className="tire-bg" style={{ backgroundImage: `url(${tire})` }}></div>
                <div className="bg-overlay"></div>
                <div className="mudmauler-text">MUDMAULER</div>
                <div className="login-left-welcome">
                    WELCOME <span className="highlight">BACK!</span>
                </div>
            </div>
            <div className="login-right">
                <div className="login-card">
                    <h1 className="login-title">LOGIN</h1>
                    <p className="login-desc">Enter your credentials to access your account</p>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <label>Email address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />

                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />

                        <button type="submit" className="login-btn">Login</button>

                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {success && <p style={{ color: 'green' }}>{success}</p>}
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
