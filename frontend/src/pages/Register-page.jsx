    import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import '../styles/register-page.css';
    import tire from '../assets/tire-img.png';

    const RegisterPage = () => {
        const [formData, setFormData] = useState({
            email: '',
            firstName: '',
            lastName: '',
            phone: '',
            address: '',
            password: '',
            confirmPassword: ''
        });

        const [error, setError] = useState('');
        const [success, setSuccess] = useState('');
        const navigate = useNavigate();

        const handleChange = (e) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
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
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        phone: formData.phone,
                        address: formData.address,
                        password: formData.password
                    }),
                });

                if (response.ok) {

                    // STORE PROFILE INFO LOCALLY — FIXED
                    localStorage.setItem("userFirst", formData.firstName);
                    localStorage.setItem("userLast", formData.lastName);
                    localStorage.setItem("userEmail", formData.email);
                    localStorage.setItem("userPhone", formData.phone);
                    localStorage.setItem("userAddress", formData.address);
                    localStorage.setItem("userAvatar", "");
                    localStorage.setItem("sessionId", "active");

                    setSuccess("Registration successful! Redirecting...");
                    setTimeout(() => navigate("/login"), 1000);

                } else {
                    const data = await response.json();
                    setError(data.message || "Registration failed");
                }
            } catch (err) {
                setError("Error connecting to server");
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
                                <label>Email Address</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                            </div>

                            <div className="name-row">
                                <div className="form-group half">
                                    <label>First Name</label>
                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                                </div>

                                <div className="form-group half">
                                    <label>Last Name</label>
                                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Phone Number</label>
                                <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <label>Address</label>
                                <input type="text" name="address" value={formData.address} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <label>Confirm Password</label>
                                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                            </div>

                            <button type="submit" className="register-btn">Register</button>

                            {error && <p className="error">{error}</p>}
                            {success && <p className="success">{success}</p>}

                            <div className="signup-link">Already have an account? <a href="/login">Login</a></div>
                        </form>
                    </div>
                </div>
            </div>
        );
    };

    export default RegisterPage;
