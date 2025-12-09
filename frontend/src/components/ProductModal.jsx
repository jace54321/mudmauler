// src/components/ProductModal.jsx (UPDATED)
import React from 'react';
import '../styles/ProductModal.css';

export default function ProductModal({ product, onClose, onAddToCart }) {
    if (!product) {
        return null;
    }

    const handleModalAddToCart = () => {
        onAddToCart(product);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>

                {/* Close Button (X) - Kept outside of the main layout for absolute positioning */}
                <button className="modal-close-btn" onClick={onClose}>
                    &times;
                </button>

                {/* Main Body Layout */}
                <div className="modal-body-layout">

                    {/* Left Side: Image & Add to Cart */}
                    <div className="product-visual-section">
                        <div className="image-placeholder">
                            {/* NEW: Added a camera icon/emoji placeholder */}
                            <span role="img" aria-label="camera" className="image-icon">
                                📸
                            </span>
                            {/* In a real app, you'd use: <img src={product.imageURL} alt={product.name} /> */}
                        </div>

                        {/* Add to Cart button matching the position in the image area */}
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
                                ₱{product.price ? product.price.toLocaleString('en-PH') : 'N/A'}
                            </span>
                            <hr />
                        </div>

                        {/* Description Area */}
                        <p className="product-description">
                            {product.description ||
                                "A description is an account or representation, often in words, that provides details about the characteristics, features, or qualities of a person, place, object, or idea to help someone understand or visualize it. It involves conveying information in a way that is vivid and engaging, aiming to give the reader or listener a clear mental image of the subject."
                            }
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