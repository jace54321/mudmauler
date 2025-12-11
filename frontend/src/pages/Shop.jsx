import React, { useState, useEffect } from "react";
import { categories } from "../data/products";
import Footer from "../components/Footer";
import ProductModal from "../components/ProductModal";
import "../styles/shop.css";
import headerBg from "../assets/tru.jpg";

// Simple SVG Icons
const Icons = {
  Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  ChevronRight: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>,
  ChevronDown: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
};

export default function Shop({ isSignedIn }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSection, setExpandedSection] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProductsAndValidateCart = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/products');
        if (response.ok) {
          const data = await response.json();

          const mappedProducts = data.map(product => ({
            id: product.productId,
            name: product.name,
            price: product.price,
            category: product.category || 'all-terrain',
            image: product.imageUrl || '/default-tire.jpg',
            description: product.description || '',
            stock: product.quantity !== undefined ? product.quantity : 0
          }));
          setProducts(mappedProducts);

          // Validate LocalStorage Cart
          const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
          if (currentCart.length > 0) {
              const validIds = new Set(data.map(p => p.productId));
              const cleanedCart = currentCart.filter(item => validIds.has(item.id));
              if (cleanedCart.length !== currentCart.length) {
                  localStorage.setItem("cart", JSON.stringify(cleanedCart));
              }
          }
        } else {
            // Fallback for demo
            import("../data/products").then(({ products: localProducts }) => {
                setProducts(localProducts);
            });
        }
      } catch (error) {
        console.error("Error connecting to server:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndValidateCart();
  }, []);

  const getCart = () => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  };

  const handleAddToCart = (product) => {
    if (!isSignedIn) {
      setToast({ show: true, message: "Please log in to add items to cart!" });
      setTimeout(() => setToast({ show: false, message: "" }), 3000);
      return;
    }

    if (product.stock <= 0) {
      setToast({ show: true, message: "This product is Out of Stock!" });
      setTimeout(() => setToast({ show: false, message: "" }), 2000);
      return;
    }

    let cart = getCart();
    const exists = cart.find((item) => item.id === product.id);

    if (exists) {
      if (exists.quantity >= product.stock) {
        setToast({ show: true, message: `Only ${product.stock} items left in stock!` });
        setTimeout(() => setToast({ show: false, message: "" }), 2000);
        return;
      }
      exists.quantity += 1;
      exists.stock = product.stock;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    setToast({ show: true, message: `${product.name} added to cart!` });
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

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="shop-page">
      {toast.show && (
        <div className="custom-toast" style={{
          backgroundColor: (toast.message.includes("Please log in") || toast.message.includes("Limit") || toast.message.includes("Out"))
            ? "#d60000"
            : "#10b981"
        }}>
          {toast.message}
        </div>
      )}

      {/* Header Banner */}
      <header className="shop-header" style={{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%), url(${headerBg})` }}>
        <div className="shop-header-content"><h1 className="shop-title">Shop Tires</h1></div>
        <div className="shop-header-accent" />
      </header>

      <main className="shop-main">
        {/* Sidebar */}
        <aside className="shop-sidebar">
          <div className="sidebar-section">
            <h2 className="sidebar-title">Find Your Tires</h2>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button className="search-button"><Icons.Search /> Search</button>
            </div>
          </div>

          <div className="sidebar-section categories-section">
            <button className="category-header" onClick={() => setExpandedSection(!expandedSection)}>
              <span>Products</span>
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
                      {activeCategory === cat.key && <Icons.ChevronRight />}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        {/* Product Grid Section */}
        <section className="products-section">
          <div className="products-header">
             <h2 className="products-title">New Arrivals</h2>
             <p className="products-subtitle">Performance tires for every terrain</p>
          </div>

          <div className="results-bar">
            <span className="results-count">
                {loading ? "Loading..." : `Showing ${filteredProducts.length} results`}
            </span>
          </div>

          {loading ? (
             <div className="no-results"><p>Loading inventory...</p></div>
          ) : (
            <>
               <div className="product-grid">
                  {filteredProducts.map((product) => (
                    <div
                        className="product-card"
                        key={product.id}
                        onClick={() => handleCardClick(product)}
                    >
                      {/* Image Area - Gray Box */}
                      <div className="product-image-container">
                        <img src={product.image} alt={product.name} className="product-image" />
                        {product.stock <= 0 && (
                           <div className="stock-badge">OUT OF STOCK</div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="product-info">
                        <h3 className="product-name">{product.name}</h3>
                        <p className="product-category">{product.category.replace('-', ' ')}</p>
                        <p className="product-price">₱{product.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p>

                        <button
                            className="add-to-cart-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(product);
                            }}
                            disabled={product.stock <= 0}
                        >
                            {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
                        </button>
                      </div>
                    </div>
                  ))}
               </div>

              {filteredProducts.length === 0 && (
                  <div className="no-results">
                      <p>No products found matching your criteria.</p>
                  </div>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />

      {selectedProduct && (
        <ProductModal
            product={selectedProduct}
            onClose={handleCloseModal}
            onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}