import React from "react";
import "../styles/product-card.css";
import { HeartIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";

function ProductCard({ product, addToCart, saveForLater }) {
  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={product.image} 
          alt={product.name}
          className="product-image"
        />
        <div className="product-overlay">
          <button 
            className="wishlist-btn"
            onClick={() => saveForLater(product)}
            aria-label="Save for later"
          >
            <HeartIcon className="wishlist-icon" />
          </button>
          <button 
            className="add-cart-btn"
            onClick={() => addToCart(product)}
          >
            <ShoppingBagIcon className="cart-icon" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
      
      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <h3 className="product-name" title={product.name}>
          {product.name}
        </h3>
        <p className="product-description">{product.description}</p>
        
        <div className="product-price">
          {product.price.toLocaleString("en-PH", {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 0
          })}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
