// src/components/ProductGrid.jsx (CORRECTED)
import React from "react";
import ProductCard from "./ProductCard";

// Accept the new prop: onProductClick
function ProductGrid({ products, addToCart, saveForLater, onProductClick }) {
  return (
    <section className="product-grid">
      {products.map(product => (
        // 1. Wrapper handles opening the modal
        <div
          key={product.id}
          className="product-grid-item-wrapper"
          onClick={() => onProductClick(product)}
        >
          <ProductCard
            product={product}
            // --- REMOVED: addToCart={addToCart} ---
            saveForLater={saveForLater}

            // 2. Pass the handler that includes e.stopPropagation()
            onAddToCartClick={(e) => {
                // This line is essential to prevent the click from bubbling up
                // and triggering the parent <div>'s onClick (which opens the modal).
                e.stopPropagation();
                addToCart(product);
            }}
          />
        </div>
      ))}
    </section>
  );
}
export default ProductGrid;