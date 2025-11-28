import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/Landing-page.jsx";
import LoginPage from "./pages/Login-page.jsx";
import RegisterPage from "./pages/Register-page.jsx";
import DashboardPage from "./pages/Dashboard-page.jsx";

function App() {
    // Track login state using sessionId
    const [isSignedIn, setIsSignedIn] = useState(
        !!localStorage.getItem("sessionId")
    );

    return (
        <Routes>
            {/* Landing */}
            <Route path="/" element={<LandingPage />} />

            {/* Register */}
            <Route path="/register" element={<RegisterPage />} />

            {/* Login — pass setIsSignedIn */}
            <Route
                path="/login"
                element={<LoginPage setIsSignedIn={setIsSignedIn} />}
            />

            {/* Dashboard — Protected */}
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
        </Routes>
    );
}

export default App;
