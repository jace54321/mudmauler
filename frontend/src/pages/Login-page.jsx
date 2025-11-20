<<<<<<< HEAD
import React, { useState } from "react";
=======
import React from "react";
>>>>>>> b8e8b76b1724d908a9d8e94b7871206260e7b1e8
import { useNavigate } from "react-router-dom";
import "../styles/login-page.css";
import tire from '../assets/tire-img.png'; // Update the path as needed

<<<<<<< HEAD
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

            if (response.ok) {
                setIsSignedIn(true); // Update state in App, which updates Navbar!
                setSuccess("Login successful!");
                navigate('/');
            } else {
                const data = await response.json();
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Error connecting to server');
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
                        <input type="email" placeholder="Enter your email" required value={email} onChange={e => setEmail(e.target.value)} />
                        <label>Password</label>
                        <input type="password" placeholder="Enter your password" required value={password} onChange={e => setPassword(e.target.value)} />
                        <div className="login-options">
                            <label>
                                <input type="checkbox" /> Remember me
                            </label>
                            <span className="forgot-pwd">Forgot Password?</span>
                        </div>
                        <button type="submit" className="login-btn">Login</button>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {success && <p style={{ color: 'green' }}>{success}</p>}
                    </form>
                    <div className="signup-link">
                        Don't have an account? <a href="/register">Sign Up</a>
                    </div>
                </div>
            </div>
=======
const LoginPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can add authentication here
    navigate("/dashboard");
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div
          className="tire-bg"
          style={{ backgroundImage: `url(${tire})` }}
        ></div>
        <div className="bg-overlay"></div>
        <div className="mudmauler-text">MUDMAULER</div>
        <div className="login-left-welcome">
          WELCOME <span className="highlight">BACK!</span>
>>>>>>> b8e8b76b1724d908a9d8e94b7871206260e7b1e8
        </div>
      </div>
      <div className="login-right">
        <div className="login-card">
          <h1 className="login-title">LOGIN</h1>
          <p className="login-desc">
            Enter your credentials to access your account
          </p>
          <form className="login-form" onSubmit={handleSubmit}>
            <label>Email address</label>
            <input type="email" placeholder="Enter your email" required />
            <label>Password</label>
            <input type="password" placeholder="Enter your password" required />
            <div className="login-options">
              <label>
                <input type="checkbox" />
                Remember me
              </label>
              <span className="forgot-pwd">Forgot Password?</span>
            </div>
            <button className="login-btn" type="submit">
              Login
            </button>
          </form>
          <div className="signup-link">
            Don't have an account? <span>Sign Up</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
