import React from "react";

const ProductCard = ({ product }) => (
    <div className="shop-card">
        <div className="shop-img">
            <div className="img-placeholder">Product Image</div>
        </div>
        <div className="shop-info">
            <div className="shop-title">{product.name}</div>
            <div className="shop-desc">{product.desc}</div>
            <div className="shop-price">€{product.price.toFixed(2)}</div>
            <div className="shop-actions">
                <button className="add-cart-btn">Add to Cart</button>
                <button className="save-btn">Save for later</button>
            </div>
        </div>
    </div>
);

export default ProductCard;
