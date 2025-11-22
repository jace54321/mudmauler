import React from "react";
import ProductCard from "./ProductCard";

function ProductGrid({ products, addToCart, saveForLater }) {
  return (
    <section className="product-grid">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          addToCart={addToCart}
          saveForLater={saveForLater}
        />
      ))}
    </section>
  );
}
export default ProductGrid;
