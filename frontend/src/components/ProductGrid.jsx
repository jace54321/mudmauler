import React from "react";
import ProductCard from "./ProductCard";

// Receives 'onProductClick' to handle opening the modal
function ProductGrid({ products, addToCart, onProductClick }) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        // 1. Wrapper: Handles the click for the Modal
        <div
          key={product.id}
          className="product-grid-item-wrapper"
          onClick={() => onProductClick(product)}
          style={{ cursor: "pointer" }} // Visual cue that card is clickable
        >
          <ProductCard
            product={product}

            // 2. Intercept the Add to Cart click
            addToCart={(e) => {
              // Vital: Stop the click from bubbling up to the wrapper
              // This prevents the Modal from opening when you just want to add to cart
              if (e && e.stopPropagation) {
                e.stopPropagation();
              }
              addToCart(product);
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default ProductGrid;