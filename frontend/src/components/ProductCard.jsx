import React from "react";

function ProductCard({ product, addToCart, onProductClick }) {
  // Helper for price formatting
  const formattedPrice = product.price.toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2
  });

  return (
    <article className="product-card">
      {/* Clickable Area for Modal */}
      <div
        className="product-clickable-area"
        onClick={() => onProductClick && onProductClick(product)}
        style={{ cursor: "pointer" }}
      >
        <div className="product-image-wrapper">
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
          />
        </div>

        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.description}</p>
        <div className="product-price">{formattedPrice}</div>
      </div>

      <div className="product-buttons">
        <button
          className="read-more-button"
          onClick={(e) => {
            e.stopPropagation(); // Prevents the modal from opening
            addToCart(product);
          }}
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}

export default ProductCard;