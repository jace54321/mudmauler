import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import { Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "./pages/Landing-page.jsx";
import LoginPage from "./pages/Login-page.jsx";
import RegisterPage from "./pages/Register-page.jsx";
import Shop from "./pages/Shop.jsx";
import Carts from "./pages/Carts.jsx";
import Profile from "./pages/Profile-page.jsx";

const AUTH_KEY = "isSignedIn";

function App() {
    // Read initial value from localStorage
    const getInitialSignedIn = () => {
        const stored = localStorage.getItem(AUTH_KEY);
        return stored === "true";
    };

    const [isSignedIn, setIsSignedIn] = useState(getInitialSignedIn());
    const location = useLocation();

    // When isSignedIn changes, update localStorage
    useEffect(() => {
        localStorage.setItem(AUTH_KEY, isSignedIn ? "true" : "false");
    }, [isSignedIn]);

    // Routes where Navbar should be hidden
    const hideNavbarRoutes = ["/login", "/register"];

    return (
        <>
            {!hideNavbarRoutes.includes(location.pathname) && (
                <Navbar isSignedIn={isSignedIn} setIsSignedIn={setIsSignedIn} />
            )}
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage setIsSignedIn={setIsSignedIn} />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/cart" element={<Carts />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </>
    );
}

export default App;
