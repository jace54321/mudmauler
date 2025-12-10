import React, { useState } from "react";
// Removed useNavigate since we are no longer redirecting
import { products, categories } from "../data/products";
import ProductGrid from "../components/ProductGrid";
import Footer from "../components/Footer";
import ProductModal from "../components/ProductModal";
import "../styles/shop.css";
import headerBg from "../assets/tru.jpg";

// --- Simple Inline Icons ---
const Icons = {
  Search: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  ),
  ChevronRight: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
  ),
  ChevronDown: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
  )
};

// Receive the isSignedIn prop from App.js
export default function Shop({ isSignedIn }) {
  const [activeCategory, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSection, setExpandedSection] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Cart Logic
  const getCart = () => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  };

  const handleAddToCart = (product) => {
    // --- AUTH CHECK ---
    if (!isSignedIn) {
      // Just show the error toast
      setToast({ show: true, message: "Please log in to add items to cart!" });
      setTimeout(() => setToast({ show: false, message: "" }), 2000);

      // We removed navigate("/login"), so it stays on this page.
      return;
    }

    // --- EXISTING CART LOGIC (Only runs if signed in) ---
    let cart = getCart();
    const exists = cart.find((item) => item.id === product.id);

    if (exists) {
      exists.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    setToast({ show: true, message: `${product.name} added to cart! ` });
    setTimeout(() => setToast({ show: false, message: "" }), 2000);

    if (selectedProduct && selectedProduct.id === product.id) {
        handleCloseModal();
    }
  };

  const handleCardClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  // Filter Logic
  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="shop-page">
      {/* Custom Toast Notification */}
      {toast.show && (
        <div className="custom-toast" style={{
          backgroundColor: toast.message.includes("Please log in") ? "#ff4444" : "#4CAF50"
        }}>
          {toast.message}
        </div>
      )}

      {/* Header Banner */}
      <header
        className="shop-header"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%), url(${headerBg})`
        }}
      >
        <div className="shop-header-content">
          <h1 className="shop-title">SHOP</h1>
        </div>
        <div className="shop-header-accent" />
      </header>

      {/* Main Content */}
      <main className="shop-main">
        {/* Sidebar */}
        <aside className="shop-sidebar">
          <div className="sidebar-section">
            <h2 className="sidebar-title find-tires">FIND TIRES</h2>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button className="search-button">
                <Icons.Search /> SEARCH
              </button>
            </div>
          </div>

          <div className="sidebar-section categories-section">
            <button
              className="category-header"
              onClick={() => setExpandedSection(!expandedSection)}
            >
              <span>PRODUCTS</span>
              {expandedSection ? <Icons.ChevronDown /> : <Icons.ChevronRight />}
            </button>

            {expandedSection && (
              <ul className="category-list">
                {categories.map((cat) => (
                  <li key={cat.key}>
                    <button
                      className={`category-item ${activeCategory === cat.key ? "active" : ""}`}
                      onClick={() => setCategory(cat.key)}
                    >
                      <span>{cat.label}</span>
                      <span className="category-arrow"><Icons.ChevronRight /></span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        {/* Products Section */}
        <section className="products-section">
          <div className="products-header">
            <div className="products-title-wrapper">
              <h2 className="products-title">New Arrivals</h2>
              <p className="products-subtitle">Check out the latest products</p>
            </div>
          </div>

          <div className="results-bar">
            <span className="results-count">
              Showing 1-{filteredProducts.length} of {filteredProducts.length} results
            </span>
          </div>

          <ProductGrid
            products={filteredProducts}
            addToCart={handleAddToCart}
            onProductClick={handleCardClick}
          />

          {filteredProducts.length === 0 && (
            <div className="no-results">
              <p>No products found matching your criteria.</p>
            </div>
          )}
        </section>
      </main>

      <Footer />

      <ProductModal
        product={selectedProduct}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}