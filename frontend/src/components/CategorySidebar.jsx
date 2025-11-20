import React from "react";
import categories from "../data/categories";

const CategorySidebar = () => (
    <aside className="shop-categories">
        <h3 className="category-title">Product Categories</h3>
        <div className="category-list">
            {categories.map((cat, idx) => (
                <button key={idx} className="category-btn">{cat}</button>
            ))}
        </div>
    </aside>
);

export default CategorySidebar;
