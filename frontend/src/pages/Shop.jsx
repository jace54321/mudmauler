import React, { useState } from "react";
import { products, categories } from "../data/products";
import ProductCategories from "../components/ProductCategories";
import ProductGrid from "../components/ProductGrid";
import { Alert, Button } from '@mui/material';
import "../styles/shop.css";

export default function Shop() {
    const [activeCategory, setCategory] = useState("all");
    const [cart, setCart] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

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
        setAlertMessage(`${product.name} added to cart!`);
        setShowAlert(true);
        // Auto-close alert after 4 seconds
        setTimeout(() => setShowAlert(false), 4000);
    };

    return (
        <div className="main-layout">
            {showAlert && (
                <Alert
                    severity="success"
                    onClose={() => setShowAlert(false)}
                    action={
                        <Button color="inherit" size="small" onClick={() => setShowAlert(false)}>
                            CLOSE
                        </Button>
                    }
                    style={{ position: 'fixed', top: 20, right: 20, zIndex: 1000 }}
                >
                    {alertMessage}
                </Alert>
            )}
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