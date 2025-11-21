import React, { useState } from "react";
import Navbar from "./components/Navbar";
import { Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "./pages/Landing-page.jsx";
import LoginPage from "./pages/Login-page.jsx";
import RegisterPage from "./pages/Register-page.jsx";
import ShopPage from "./pages/Shop.jsx";

function App() {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const location = useLocation();

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
                <Route path="/shop" element={<ShopPage />} />
            </Routes>
        </>
    );
}

export default App;