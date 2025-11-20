import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CategorySidebar from "../components/CategorySidebar";
import ProductGrid from "../components/ProductGrid";
import products from "../data/products";

const Shop = () => (
    <div className="landing-container">
        <main style={{ padding: "38px 0" }}>
            <div style={{ padding: "0 40px" }}>
                <h2 style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 900,
                    fontSize: "1.2rem",
                    letterSpacing: ".05em",
                    margin: 0,
                    color: "#111"
                }}>
                    New Arrivals
                </h2>
                <span style={{ fontSize: "0.98rem", color: "#888" }}>
                  Check out the latest products
                </span>
            </div>
            <section className="shop-grid-section">
                <CategorySidebar />
                <ProductGrid products={products} />
            </section>
        </main>
        <Footer />
    </div>
);
export default Shop;
