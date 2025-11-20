import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Landing-page.jsx";
import LoginPage from "./pages/Login-page.jsx";
import RegisterPage from "./pages/Register-page.jsx";
import ShopPage from "./pages/Shop.jsx";
import DashboardPage from "./pages/Dashboard-page.jsx";
import ProfilePage from "./pages/Profile-page.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
       <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}

export default App;
