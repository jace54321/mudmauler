import React from "react";
import Footer from "../components/Footer";
import CategorySidebar from "../components/CategorySidebar";
import ProductGrid from "../components/ProductGrid";
import products from "../data/products";

const Shop = () => (
    <div className="shop-container">
        <main className="shop-main">
            <div className="shop-header">
                <h2 className="shop-title">
                    New Arrivals
                </h2>
                <span className="shop-subtitle">
                  Check out the latest products
                </span>
            </div>
            <div className="shop-content">
                <CategorySidebar />
                <ProductGrid products={products && Array.isArray(products) ? products : []} />
            </div>
        </main>
        <Footer />
    </div>
);

export default Shop;
