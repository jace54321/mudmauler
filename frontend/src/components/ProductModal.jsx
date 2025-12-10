// src/components/ProductModal.jsx (UPDATED)
import React from 'react';
import '../styles/ProductModal.css';

export default function ProductModal({ product, onClose, onAddToCart }) {
    if (!product) {
        return null;
    }

    const handleModalAddToCart = () => {
        onAddToCart(product);
        // Note: Closing the modal immediately after adding to cart is good UX 
        // if the user gets a visible success notification (toast).
        onClose();
    };
    
    // Helper for price formatting (Consistent with ProductCard)
    const formattedPrice = product.price.toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2
    });


    return (
        <div className="modal-overlay" onClick={onClose}>
            {/* Prevent clicks inside the modal from closing the modal */}
            <div className="modal-content" onClick={e => e.stopPropagation()}>

                {/* Close Button (X) */}
                <button className="modal-close-btn" onClick={onClose}>
                    &times;
                </button>

                {/* Main Body Layout */}
                <div className="modal-body-layout">

                    {/* Left Side: Image & Add to Cart */}
                    <div className="product-visual-section">
                        {/* --- IMAGE DISPLAY FIX --- */}
                        <div className="image-wrapper">
                            <img 
                                src={product.image} 
                                alt={product.name} 
                                className="product-modal-image" 
                            />
                        </div>
                        {/* ------------------------- */}

                        {/* Add to Cart button */}
                        <button
                            className="add-to-cart-modal-btn"
                            onClick={handleModalAddToCart}
                        >
                            Add to Cart
                        </button>
                    </div>

                    {/* Right Side: Details */}
                    <div className="product-details-section">

                        {/* Product Name */}
                        <div className="detail-line detail-name">
                            <span className="detail-label">PRODUCT NAME</span>
                            <span className="detail-value">{product.name}</span>
                            <hr />
                        </div>

                        {/* Price */}
                        <div className="detail-line detail-price">
                            <span className="detail-label">PRICE</span>
                            <span className="detail-value price-highlight">
                                {formattedPrice} {/* Use formatted price helper */}
                            </span>
                            <hr />
                        </div>

                        {/* Description Area */}
                        <p className="product-description">
                            {product.description || "No detailed description provided for this product."}
                        </p>

                        {/* Example of adding more design details */}
                        <div className="additional-specs">
                            <h4>Key Features</h4>
                            <ul>
                                <li>All-weather traction</li>
                                <li>Reinforced sidewalls</li>
                                <li>Low noise performance</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}