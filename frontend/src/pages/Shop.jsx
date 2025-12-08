import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Added for navigation
import { products, categories } from "../data/products";
import ProductCategories from "../components/ProductCategories";
import ProductGrid from "../components/ProductGrid";
import "../styles/shop.css";

export default function Shop() {
    const navigate = useNavigate(); // Hook to change pages
    const [activeCategory, setCategory] = useState("all");
    const [toast, setToast] = useState({ show: false, message: "" });

    const filteredProducts =
        activeCategory === "all"
            ? products
            : products.filter((p) => p.category === activeCategory);

    const getCart = () => {
        const stored = localStorage.getItem("cart");
        return stored ? JSON.parse(stored) : [];
    };

    const saveCart = (cart) => {
        localStorage.setItem("cart", JSON.stringify(cart));
    };

    const handleAddToCart = (product) => {
        let cart = getCart();
        const exists = cart.find((item) => item.id === product.id);

        if (exists) {
            exists.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        saveCart(cart);

        setToast({ show: true, message: `${product.name} added to cart!` });
        setTimeout(() => setToast({ show: false, message: "" }), 2000);
    };

    return (
        <div className="main-layout">
            {toast.show && (
                <div
                    style={{
                        position: "fixed",
                        top: 20,
                        right: 20,
                        background: "#4CAF50",
                        padding: "12px 20px",
                        borderRadius: "8px",
                        color: "white",
                        fontWeight: "600",
                        boxShadow: "0 3px 12px rgba(0,0,0,0.2)",
                        zIndex: 2000
                    }}
                >
                    {toast.message}
                </div>
            )}

            <ProductCategories
                categories={categories}
                activeCategory={activeCategory}
                setCategory={setCategory}
            />

            <div className="arrivals-section">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <div>
                        <h1>New Arrivals</h1>
                        <p style={{ margin: 0 }}>Check out the latest products</p>
                    </div>

                    {/* NEW: Button to view the cart */}
                    <button
                        style={{
                            padding: "10px 20px",
                            background: "#c00",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontSize: "1rem"
                        }}
                        onClick={() => navigate("/cart")}
                    >
                        View Cart ({getCart().reduce((acc, item) => acc + item.quantity, 0)})
                    </button>
                </div>

                <ProductGrid
                    products={filteredProducts}
                    addToCart={handleAddToCart}
                />
            </div>
        </div>
    );
}