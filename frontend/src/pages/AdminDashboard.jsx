import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "../data/products"; // Import categories for the dropdown
import "../styles/admin-dashboard.css";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("dashboard");
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const sessionId = localStorage.getItem("sessionId");
        if (!sessionId) {
            navigate("/login");
            return;
        }

        // Check if user is admin and fetch dashboard stats
        fetchDashboardStats(sessionId);
    }, [navigate]);

    const fetchDashboardStats = async (sessionId) => {
        try {
            const response = await fetch('http://localhost:8080/api/admin/dashboard/stats', {
                headers: {
                    'Session-Id': sessionId
                }
            });

            if (response.status === 403) {
                setError("You do not have admin access");
                setLoading(false);
                return;
            }

            if (response.ok) {
                const data = await response.json();
                setStats(data);
            } else {
                setError("Failed to load dashboard");
            }
        } catch (err) {
            console.error("Error fetching stats:", err);
            setError("Error connecting to server");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-dashboard">
                <div className="admin-loading">Loading dashboard...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-dashboard">
                <div className="admin-error">{error}</div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <button className="admin-logout-btn" onClick={() => {
                    localStorage.removeItem("sessionId");
                    navigate("/");
                }}>
                    Logout
                </button>
            </div>

            <div className="admin-nav">
                <button
                    className={activeTab === "dashboard" ? "active" : ""}
                    onClick={() => setActiveTab("dashboard")}
                >
                    Dashboard
                </button>
                <button
                    className={activeTab === "products" ? "active" : ""}
                    onClick={() => setActiveTab("products")}
                >
                    Products
                </button>
                <button
                    className={activeTab === "orders" ? "active" : ""}
                    onClick={() => setActiveTab("orders")}
                >
                    Orders
                </button>
                <button
                    className={activeTab === "users" ? "active" : ""}
                    onClick={() => setActiveTab("users")}
                >
                    Users
                </button>
            </div>

            <div className="admin-content">
                {activeTab === "dashboard" && <DashboardTab stats={stats} />}
                {activeTab === "products" && <ProductsTab />}
                {activeTab === "orders" && <OrdersTab />}
                {activeTab === "users" && <UsersTab />}
            </div>
        </div>
    );
};

// Dashboard Tab Component
const DashboardTab = ({ stats }) => {
    if (!stats) return <div>Loading statistics...</div>;

    return (
        <div className="dashboard-tab">
            <h2>Overview</h2>
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Users</h3>
                    <p className="stat-value">{stats.totalUsers}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Orders</h3>
                    <p className="stat-value">{stats.totalOrders}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Products</h3>
                    <p className="stat-value">{stats.totalProducts}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Revenue</h3>
                    <p className="stat-value">₱{stats.totalRevenue?.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p>
                </div>
            </div>
        </div>
    );
};

// Products Tab Component
const ProductsTab = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        category: "",
        description: "",
        imageUrl: "",
        size: ""
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/products');
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to get the readable label from the category key
    const getCategoryLabel = (catKey) => {
        const found = categories.find(c => c.key === catKey);
        return found ? found.label : catKey;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const sessionId = localStorage.getItem("sessionId");
        const url = editingProduct
            ? `http://localhost:8080/api/admin/products/${editingProduct.productId}`
            : 'http://localhost:8080/api/admin/products';
        const method = editingProduct ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Session-Id': sessionId
                },
                body: JSON.stringify({
                    name: formData.name,
                    price: parseFloat(formData.price),
                    category: formData.category,
                    description: formData.description,
                    imageUrl: formData.imageUrl,
                    size: formData.size
                })
            });

            if (response.ok) {
                fetchProducts();
                setShowAddForm(false);
                setEditingProduct(null);
                setFormData({ name: "", price: "", category: "", description: "", imageUrl: "", size: "" });
            }
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name || "",
            price: product.price || "",
            category: product.category || "",
            description: product.description || "",
            imageUrl: product.imageUrl || "",
            size: product.size || ""
        });
        setShowAddForm(true);
    };

    // UPDATED: Now includes error handling/alerting
    const handleDelete = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        const sessionId = localStorage.getItem("sessionId");
        try {
            const response = await fetch(`http://localhost:8080/api/admin/products/${productId}`, {
                method: 'DELETE',
                headers: { 'Session-Id': sessionId }
            });

            if (response.ok) {
                fetchProducts();
            } else {
                // Read the error message from the server to understand why it failed
                const errorText = await response.text();
                alert(`Failed to delete product. Server responded: ${response.status}\n${errorText}`);
                console.error("Delete failed:", response.status, errorText);
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("A network error occurred while trying to delete.");
        }
    };

    if (loading) return <div>Loading products...</div>;

    return (
        <div className="products-tab">
            <div className="tab-header">
                <h2>Products Management</h2>
                <button className="add-btn" onClick={() => {
                    setShowAddForm(true);
                    setEditingProduct(null);
                    setFormData({ name: "", price: "", category: "", description: "", imageUrl: "", size: "" });
                }}>
                    Add Product
                </button>
            </div>

            {showAddForm && (
                <div className="product-form-modal">
                    <div className="product-form">
                        <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Product Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />

                            {/* Dropdown for Category Selection */}
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    marginBottom: '15px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                }}
                            >
                                <option value="">Select Category</option>
                                {categories
                                    .filter(cat => cat.key !== 'all')
                                    .map((cat) => (
                                        <option key={cat.key} value={cat.key}>
                                            {cat.label}
                                        </option>
                                    ))
                                }
                            </select>

                            <input
                                type="number"
                                placeholder="Price"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Size"
                                value={formData.size}
                                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Image URL"
                                value={formData.imageUrl}
                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            />
                            <textarea
                                placeholder="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                            <div className="form-actions">
                                <button type="submit">Save</button>
                                <button type="button" onClick={() => {
                                    setShowAddForm(false);
                                    setEditingProduct(null);
                                }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="products-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Size</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.productId}>
                                <td>{product.productId}</td>
                                <td>{product.name}</td>
                                <td>₱{product.price?.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                                <td>{getCategoryLabel(product.category) || "N/A"}</td>
                                <td>{product.size || "N/A"}</td>
                                <td>
                                    <button className="edit-btn" onClick={() => handleEdit(product)}>Edit</button>
                                    <button className="delete-btn" onClick={() => handleDelete(product.productId)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Orders Tab Component
const OrdersTab = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const sessionId = localStorage.getItem("sessionId");
        try {
            const response = await fetch('http://localhost:8080/api/admin/orders', {
                headers: { 'Session-Id': sessionId }
            });
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading orders...</div>;

    return (
        <div className="orders-tab">
            <h2>Orders Management</h2>
            <div className="orders-table">
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>User ID</th>
                            <th>Order Date</th>
                            <th>Total Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.orderId}>
                                <td>{order.orderId}</td>
                                <td>{order.user?.id || "N/A"}</td>
                                <td>{new Date(order.orderDate).toLocaleString()}</td>
                                <td>₱{order.totalAmount?.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Users Tab Component
const UsersTab = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const sessionId = localStorage.getItem("sessionId");
        try {
            const response = await fetch('http://localhost:8080/api/admin/users', {
                headers: { 'Session-Id': sessionId }
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        const sessionId = localStorage.getItem("sessionId");
        try {
            const response = await fetch(`http://localhost:8080/api/admin/users/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Session-Id': sessionId
                },
                body: JSON.stringify({ role: newRole })
            });

            if (response.ok) {
                fetchUsers();
            }
        } catch (error) {
            console.error("Error updating user role:", error);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        const sessionId = localStorage.getItem("sessionId");
        try {
            const response = await fetch(`http://localhost:8080/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Session-Id': sessionId }
            });

            if (response.ok) {
                fetchUsers();
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    if (loading) return <div>Loading users...</div>;

    return (
        <div className="users-tab">
            <h2>Users Management</h2>
            <div className="users-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.firstName} {user.lastName}</td>
                                <td>{user.email}</td>
                                <td>{user.phone || "N/A"}</td>
                                <td>
                                    <select
                                        value={user.role || "USER"}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                    >
                                        <option value="USER">USER</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </select>
                                </td>
                                <td>
                                    <button className="delete-btn" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;