import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/Landing-page.jsx";
import LoginPage from "./pages/Login-page.jsx";
import RegisterPage from "./pages/Register-page.jsx";
import DashboardPage from "./pages/Dashboard-page.jsx";
import ShopPage from "./pages/Shop.jsx";

function App() {
    // Tracks signed-in state based on sessionId
    const [isSignedIn, setIsSignedIn] = useState(
        !!localStorage.getItem("sessionId")
    );

    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
                path="/login"
                element={<LoginPage setIsSignedIn={setIsSignedIn} />}
            />

            {/* Dashboard (Protected Route) */}
            <Route
                path="/dashboard"
                element={
                    isSignedIn ? (
                        <DashboardPage />
                    ) : (
                        <LoginPage setIsSignedIn={setIsSignedIn} />
                    )
                }
            />

            {/* ⭐ REQUIRED FOR TIRES LINK */}
            {/* /shop loads Shop.jsx */}
            <Route path="/shop" element={<ShopPage />} />
        </Routes>
    );
}

export default App;
