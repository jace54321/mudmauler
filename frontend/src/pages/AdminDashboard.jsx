import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "../data/products"; // Import categories for the dropdown
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import "../styles/admin-dashboard.css";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("dashboard");
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [alert, setAlert] = useState(null);

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
                <div className="admin-header-buttons">
                    <button className="admin-customer-view-btn" onClick={() => {
                        navigate("/");
                    }}>Customer View
                    </button>
                    <button className="admin-logout-btn" onClick={() => {
                        localStorage.removeItem("sessionId");
                        navigate("/");
                    }}>Logout
                    </button>
                </div>
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
                {activeTab === "products" && <ProductsTab setAlert={setAlert} />}
                {activeTab === "orders" && <OrdersTab />}
                {activeTab === "users" && <UsersTab setAlert={setAlert} />}
            </div>

            {/* Alert/Undo Component */}
            {alert && (
                <div className={`alert-toast ${alert.type}`}>
                    <span>{alert.message}</span>
                    {alert.undo && (
                        <button className="undo-btn" onClick={alert.undo}>
                            Undo
                        </button>
                    )}
                    <button className="close-alert-btn" onClick={() => setAlert(null)}>×</button>
                </div>
            )}
        </div>
    );
};

// Dashboard Tab Component
const DashboardTab = ({ stats }) => {
    const [notifications, setNotifications] = useState([]);
    const [activeChartTab, setActiveChartTab] = useState("users");

    useEffect(() => {
        fetchNotifications();
        // Refresh notifications every 5 seconds
        const interval = setInterval(fetchNotifications, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        const sessionId = localStorage.getItem("sessionId");
        try {
            const response = await fetch('http://localhost:8080/api/admin/notifications', {
                headers: { 'Session-Id': sessionId }
            });
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const markAsRead = async (notificationId) => {
        const sessionId = localStorage.getItem("sessionId");
        try {
            const response = await fetch(`http://localhost:8080/api/admin/notifications/${notificationId}/read`, {
                method: 'PUT',
                headers: { 'Session-Id': sessionId }
            });
            if (response.ok) {
                fetchNotifications();
            }
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    };

    if (!stats) return <div>Loading statistics...</div>;

    // Helper function to get category label
    const getCategoryLabel = (catKey) => {
        const found = categories.find(c => c.key === catKey);
        return found ? found.label : catKey;
    };

    // Line Chart Data - Revenue Over Time
    const revenueData = stats.revenueOverTime || [];
    const lineChartData = {
        labels: revenueData.map(item => item.date),
        datasets: [{
            label: 'Revenue (₱)',
            data: revenueData.map(item => item.revenue),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            tension: 0.4,
            fill: true
        }]
    };

    // Bar Chart Data - Orders by Category
    const ordersByCategory = stats.ordersByCategory || [];
    const barChartData = {
        labels: ordersByCategory.map(item => getCategoryLabel(item.category)),
        datasets: [{
            label: 'Orders',
            data: ordersByCategory.map(item => item.count),
            backgroundColor: [
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 99, 132, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(153, 102, 255, 0.8)',
                'rgba(255, 159, 64, 0.8)',
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1
        }]
    };

    // Pie Chart Data - Product Distribution
    const productDistribution = stats.productDistribution || [];
    const pieChartData = {
        labels: productDistribution.map(item => getCategoryLabel(item.category)),
        datasets: [{
            data: productDistribution.map(item => item.count),
            backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(153, 102, 255, 0.8)',
                'rgba(255, 159, 64, 0.8)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 2
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#333',
                    font: {
                        size: 12
                    }
                }
            },
            title: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#666'
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            x: {
                ticks: {
                    color: '#666'
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            }
        }
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: '#333',
                    font: {
                        size: 12
                    }
                }
            }
        }
    };

    return (
        <div className="dashboard-tab">
            <h2>Overview</h2>
            <div className="stats-grid">
                <div className="stat-card stat-card-users">
                    <div className="stat-header">
                        <h3>Total Users</h3>
                        <div className={`stat-change ${stats.usersChange >= 0 ? 'positive' : 'negative'}`}>
                            {stats.usersChange >= 0 ? '↑' : '↓'} {Math.abs(stats.usersChange || 11.01).toFixed(2)}%
                        </div>
                    </div>
                    <p className="stat-value">{stats.totalUsers || 7265}</p>
                </div>
                <div className="stat-card stat-card-orders">
                    <div className="stat-header">
                        <h3>Total Orders</h3>
                        <div className={`stat-change ${stats.ordersChange >= 0 ? 'positive' : 'negative'}`}>
                            {stats.ordersChange >= 0 ? '↑' : '↓'} {Math.abs(stats.ordersChange || 0.03).toFixed(2)}%
                        </div>
                    </div>
                    <p className="stat-value">{stats.totalOrders || 3671}</p>
                </div>
                <div className="stat-card stat-card-products">
                    <div className="stat-header">
                        <h3>Total Products</h3>
                        <div className={`stat-change ${stats.productsChange >= 0 ? 'positive' : 'negative'}`}>
                            {stats.productsChange >= 0 ? '↑' : '↓'} {Math.abs(stats.productsChange || 15.03).toFixed(2)}%
                        </div>
                    </div>
                    <p className="stat-value">{stats.totalProducts || 156}</p>
                </div>
                <div className="stat-card stat-card-revenue">
                    <div className="stat-header">
                        <h3>Total Revenue</h3>
                        <div className={`stat-change ${stats.revenueChange >= 0 ? 'positive' : 'negative'}`}>
                            {stats.revenueChange >= 0 ? '↑' : '↓'} {Math.abs(stats.revenueChange || 6.08).toFixed(2)}%
                        </div>
                    </div>
                    <p className="stat-value">₱{stats.totalRevenue?.toLocaleString('en-PH', { minimumFractionDigits: 2 }) || '2,318'}</p>
                </div>
            </div>

            <div className="dashboard-main-layout">
                <div className="charts-column">
                    <div className="chart-card large-chart">
                        <div className="chart-tabs">
                            <button 
                                className={activeChartTab === "users" ? "active" : ""}
                                onClick={() => setActiveChartTab("users")}
                            >
                                Total Users
                            </button>
                            <button 
                                className={activeChartTab === "revenue" ? "active" : ""}
                                onClick={() => setActiveChartTab("revenue")}
                            >
                                Revenue
                            </button>
                            <button 
                                className={activeChartTab === "orders" ? "active" : ""}
                                onClick={() => setActiveChartTab("orders")}
                            >
                                Orders
                            </button>
                        </div>
                        <div className="chart-wrapper">
                            {activeChartTab === "users" && (
                                <Line data={lineChartData} options={chartOptions} />
                            )}
                            {activeChartTab === "revenue" && (
                                <Line data={lineChartData} options={chartOptions} />
                            )}
                            {activeChartTab === "orders" && (
                                <Line data={lineChartData} options={chartOptions} />
                            )}
                        </div>
                    </div>

                    <div className="charts-row">
                        <div className="chart-card">
                            <h3>Manage Orders</h3>
                            <div className="chart-wrapper">
                                <Bar data={barChartData} options={chartOptions} />
                            </div>
                        </div>

                        <div className="chart-card">
                            <h3>Traffic by Location</h3>
                            <div className="chart-wrapper">
                                <Pie data={pieChartData} options={pieChartOptions} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="notifications-column">
                    <div className="notifications-panel">
                        <h3>Notifications</h3>
                        <div className="notifications-list">
                            {notifications.length === 0 ? (
                                <div className="notification-item">
                                    <p>You fixed a bug</p>
                                    <span className="notification-time">Just now</span>
                                </div>
                            ) : (
                                notifications.slice(0, 5).map(notification => (
                                    <div 
                                        key={notification.id} 
                                        className={`notification-item ${!notification.read ? 'unread' : ''}`}
                                        onClick={() => markAsRead(notification.id)}
                                    >
                                        <p>{notification.message}</p>
                                        <span className="notification-time">{formatTimeAgo(notification.createdAt)}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Products Tab Component
const ProductsTab = ({ setAlert }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const [previousProduct, setPreviousProduct] = useState(null);
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

        const productData = {
            name: formData.name,
            price: parseFloat(formData.price),
            category: formData.category,
            description: formData.description,
            imageUrl: formData.imageUrl,
            size: formData.size
        };

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Session-Id': sessionId
                },
                body: JSON.stringify(productData)
            });

            if (response.ok) {
                if (editingProduct && previousProduct) {
                    // Show undo alert for edit
                    setAlert({
                        type: 'info',
                        message: `Product "${formData.name}" updated successfully`,
                        undo: async () => {
                            try {
                                const undoResponse = await fetch(`http://localhost:8080/api/admin/products/${editingProduct.productId}`, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Session-Id': sessionId
                                    },
                                    body: JSON.stringify({
                                        name: previousProduct.name,
                                        price: previousProduct.price,
                                        category: previousProduct.category,
                                        description: previousProduct.description,
                                        imageUrl: previousProduct.imageUrl,
                                        size: previousProduct.size
                                    })
                                });
                                if (undoResponse.ok) {
                                    fetchProducts();
                                    setAlert(null);
                                }
                            } catch (error) {
                                console.error("Error undoing edit:", error);
                            }
                        }
                    });
                    setTimeout(() => setAlert(null), 5000);
                }
                fetchProducts();
                setShowAddForm(false);
                setEditingProduct(null);
                setPreviousProduct(null);
                setFormData({ name: "", price: "", category: "", description: "", imageUrl: "", size: "" });
            }
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    const handleEdit = (product) => {
        // Store previous product state for undo
        setPreviousProduct({ ...product });
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

    // includes undo functionality
    const handleDelete = async (productId) => {
        const product = products.find(p => p.productId === productId);
        if (!product) return;

        const sessionId = localStorage.getItem("sessionId");
        try {
            const response = await fetch(`http://localhost:8080/api/admin/products/${productId}`, {
                method: 'DELETE',
                headers: { 'Session-Id': sessionId }
            });

            if (response.ok) {
                const data = await response.json();
                const deletedProduct = data.deletedProduct;
                
                fetchProducts();
                
                // Show undo alert
                setAlert({
                    type: 'warning',
                    message: `Product "${deletedProduct.name}" deleted`,
                    undo: async () => {
                        try {
                            const restoreResponse = await fetch('http://localhost:8080/api/admin/products/restore', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Session-Id': sessionId
                                },
                                body: JSON.stringify(deletedProduct)
                            });
                            if (restoreResponse.ok) {
                                fetchProducts();
                                setAlert(null);
                            }
                        } catch (error) {
                            console.error("Error restoring product:", error);
                        }
                    }
                });
                setTimeout(() => setAlert(null), 5000);
            } else {
                const errorData = await response.json();
                setAlert({
                    type: 'error',
                    message: errorData.message || "Failed to delete product"
                });
                setTimeout(() => setAlert(null), 3000);
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            setAlert({
                type: 'error',
                message: "A network error occurred while trying to delete."
            });
            setTimeout(() => setAlert(null), 3000);
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
                            <th>Order Date</th>
                            <th>Order ID</th>
                            <th>User</th>
                            <th>Products</th>
                            <th>Total Quantity</th>
                            <th>Total Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                    No orders found
                                </td>
                            </tr>
                        ) : (
                            orders.map(order => {
                                const items = order.items || [];
                                const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
                                
                                return (
                                    <tr key={order.orderId}>
                                        <td>{new Date(order.orderDate).toLocaleString()}</td>
                                        <td><strong>#{order.orderId}</strong></td>
                                        <td>
                                            {order.user ? (
                                                <div>
                                                    <div style={{ fontWeight: '500' }}>
                                                        {order.user.firstName} {order.user.lastName}
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: '#666' }}>
                                                        {order.user.email}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span style={{ color: '#999' }}>N/A</span>
                                            )}
                                        </td>
                                        <td>
                                            {items.length > 0 ? (
                                                <div className="order-products-list">
                                                    {items.map((item, idx) => (
                                                        <div key={item.orderItemId || idx} className="order-product-item">
                                                            <span className="product-name">
                                                                {item.product?.name || 'Unknown Product'}
                                                            </span>
                                                            <span className="product-quantity">
                                                                ×{item.quantity || 0}
                                                            </span>
                                                            {item.product && (
                                                                <span className="product-price">
                                                                    @ ₱{item.unitPrice?.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span style={{ color: '#999' }}>No items</span>
                                            )}
                                        </td>
                                        <td><strong>{totalQuantity}</strong></td>
                                        <td>
                                            <strong style={{ color: '#10b981', fontSize: '16px' }}>
                                                ₱{order.totalAmount?.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                            </strong>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Users Tab Component
const UsersTab = ({ setAlert }) => {
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
        const user = users.find(u => u.id === userId);
        if (!user) return;

        const sessionId = localStorage.getItem("sessionId");
        try {
            const response = await fetch(`http://localhost:8080/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Session-Id': sessionId }
            });

            if (response.ok) {
                const data = await response.json();
                const deletedUser = data.deletedUser;
                
                fetchUsers();
                
                // Show undo alert
                setAlert({
                    type: 'warning',
                    message: `User "${deletedUser.firstName} ${deletedUser.lastName}" deleted`,
                    undo: async () => {
                        try {
                            const restoreResponse = await fetch('http://localhost:8080/api/admin/users/restore', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Session-Id': sessionId
                                },
                                body: JSON.stringify(deletedUser)
                            });
                            if (restoreResponse.ok) {
                                fetchUsers();
                                setAlert(null);
                            }
                        } catch (error) {
                            console.error("Error restoring user:", error);
                        }
                    }
                });
                setTimeout(() => setAlert(null), 5000);
            } else {
                const errorData = await response.json();
                setAlert({
                    type: 'error',
                    message: errorData.message || "Failed to delete user"
                });
                setTimeout(() => setAlert(null), 3000);
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            setAlert({
                type: 'error',
                message: "A network error occurred while trying to delete."
            });
            setTimeout(() => setAlert(null), 3000);
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