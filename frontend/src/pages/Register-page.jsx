import React, { useState } from 'react';
import '../styles/register-page.css';
import tire from '../assets/tire-img.png';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    username: formData.username,
                    password: formData.password
                }),
            });

            if (response.ok) {
                setSuccess("Registration successful! Please login.");
                setFormData({ email: '', username: '', password: '', confirmPassword: '' });
            } else {
                const data = await response.json();
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Error connecting to server');
        }
    };

    return (
        <div className="register-bg" style={{ backgroundImage: `url(${tire})` }}>
            <div className="bg-overlay"></div>

            <div className="register-header">
                <div className="mudmauler-text">MUDMAULER</div>
                <div className="welcome-banner">
                    WELCOME TO YOUR <span className="highlight">ADVENTURE!</span>
                </div>
            </div>

            <div className="register-center">
                <div className="register-card">
                    <h1 className="register-title">REGISTER</h1>
                    <p className="register-desc">Create your account to get started</p>

                    <form className="register-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                placeholder="Choose a username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Repeat your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className="register-btn">Register</button>

                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {success && <p style={{ color: 'green' }}>{success}</p>}

                        <div className="signup-link">
                            Already have an account? <a href="/login">Login</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
