// src/components/ProductCard.jsx (CORRECTED)

// 1. Accept the new prop: onAddToCartClick
function ProductCard({ product, onAddToCartClick, saveForLater }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <div className="desc">{product.description}</div>
      <div className="price">
        {product.price.toLocaleString("en-PH", {
          style: "currency",
          currency: "PHP",
          minimumFractionDigits: 2
        })}
      </div>
      <div className="buttons">
        {/* 2. Use the new prop directly in the button's onClick */}
        <button onClick={onAddToCartClick}>Add to Cart</button>
      </div>
    </div>
  );
}
export default ProductCard;