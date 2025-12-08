import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import NavigationBar from "./components/NavigationBar.jsx";
import LandingPage from "./pages/Landing-page.jsx";
import LoginPage from "./pages/Login-page.jsx";
import RegisterPage from "./pages/Register-page.jsx";
import ShopPage from "./pages/Shop.jsx";
import Carts from "./pages/Carts.jsx";

function App() {
    // Tracks signed-in state based on sessionId
    const [isSignedIn, setIsSignedIn] = useState(
        !!localStorage.getItem("sessionId")
    );

    const handleLogout = () => {
        setIsSignedIn(false);
        localStorage.removeItem("sessionId");
    };

    const location = useLocation();

    // hide the global navigation bar on login and register pages
    const hideNavbarOn = ["/login", "/register"];
    const showNavbar = !hideNavbarOn.includes(location.pathname);

    return (
        <>
            {showNavbar && (
                <NavigationBar isSignedIn={isSignedIn} setIsSignedIn={handleLogout} />
            )}

            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route
                    path="/login"
                    element={<LoginPage setIsSignedIn={setIsSignedIn} />}
                />
                {/* /shop loads Shop.jsx */}
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/cart" element={<Carts />} />
            </Routes>
        </>
    );
}

export default App;
