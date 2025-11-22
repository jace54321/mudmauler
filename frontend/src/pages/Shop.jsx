import React, { useState } from "react";
import { products, categories } from "../data/products";
import ProductCategories from "../components/ProductCategories";
import ProductGrid from "../components/ProductGrid";
import "../styles/shop.css";

export default function Shop() {
    const [activeCategory, setCategory] = useState("all");
    const [cart, setCart] = useState([]);

    const filteredProducts =
        activeCategory === "all"
            ? products
            : products.filter((p) => p.category === activeCategory);

    // Add to cart handler (kept local for now)
    const handleAddToCart = (product) => {
        setCart((prevCart) => {
            const existing = prevCart.find((item) => item.id === product.id);
            if (existing) {
                return prevCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
        // optionally: alert("Added to cart!");
    };

    return (
        <div className="main-layout">
            <ProductCategories
                categories={categories}
                activeCategory={activeCategory}
                setCategory={setCategory}
            />
            <div className="arrivals-section">
                <h1>New Arrivals</h1>
                <p>Check out the latest products</p>
                <ProductGrid
                    products={filteredProducts}
                    addToCart={handleAddToCart}
                    saveForLater={() => {}}
                />
            </div>
        </div>
    );
}
