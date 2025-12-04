import React from "react";

function ProductCategories({ categories, activeCategory, setCategory }) {
  return (
    <aside className="categories">
      <h2>Product Categories</h2>
      <ul>
        {categories.map(cat => (
          <li key={cat.key}>
            <label>
              <input
                type="radio"
                checked={activeCategory === cat.key}
                onChange={() => setCategory(cat.key)}
              />
              {cat.label}
            </label>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default ProductCategories;