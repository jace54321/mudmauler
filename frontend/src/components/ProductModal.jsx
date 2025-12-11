import React, { useEffect } from 'react';
import '../styles/shop.css';

const Icons = {
    Close: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    )
};

const ProductModal = ({ product, onClose, onAddToCart }) => {
    // Prevent background scrolling
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    if (!product) return null;

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('product-modal-overlay')) {
            onClose();
        }
    };

    const formattedPrice = product.price?.toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2
    });

    return (
        <div className="product-modal-overlay" onClick={handleOverlayClick}>
            <div className="product-modal-content">

                <button className="modal-close-btn" onClick={onClose}>
                    <Icons.Close />
                </button>

                {/* LEFT SIDE: Image */}
                <div className="modal-image-section">
                    <img
                        src={product.image || product.imageUrl}
                        alt={product.name}
                        className="modal-product-image"
                    />
                    {product.stock <= 0 && (
                        <div className="modal-stock-badge">OUT OF STOCK</div>
                    )}
                </div>

                {/* RIGHT SIDE: Info */}
                <div className="modal-info-section">
                    <div className="modal-header">
                        <span className="modal-category">{product.category || "All-Terrain"}</span>
                        <h2 className="modal-title">{product.name}</h2>
                        <div className="modal-price">{formattedPrice}</div>
                    </div>

                    <div className="modal-body">
                        {/* Description Box */}
                        <div className="modal-description-box">
                            <span className="box-label">Product Description</span>
                            <p>
                                {product.description || "No description available for this item."}
                            </p>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button
                            className="modal-add-btn"
                            onClick={() => onAddToCart(product)}
                            disabled={product.stock <= 0}
                        >
                            {product.stock <= 0 ? "Out of Stock" : `ADD TO CART • ${formattedPrice}`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;