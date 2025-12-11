import React, { useState, useEffect, useMemo } from "react";
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

// --- Custom Hook for Sorting (Used in all tabs) ---
const useSortableData = (items, config = null) => {
    const [sortConfig, setSortConfig] = useState(config);

    const sortedItems = useMemo(() => {
        let sortableItems = [...items];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                // Special handling for nested or calculated fields (like total amount)
                if (sortConfig.key === 'totalAmount' || sortConfig.key === 'price') {
                    aValue = aValue || 0;
                    bValue = bValue || 0;
                } else if (sortConfig.key === 'name' || sortConfig.key === 'email' || sortConfig.key === 'category') {
                     // Convert to lowercase for case-insensitive string comparison
                    aValue = String(aValue).toLowerCase();
                    bValue = String(bValue).toLowerCase();
                } else if (sortConfig.key === 'productName') {
                    aValue = String(a.product?.name || a.name).toLowerCase();
                    bValue = String(b.product?.name || b.name).toLowerCase();
                } else if (sortConfig.key === 'userName') {
                    aValue = String(a.firstName + ' ' + a.lastName).toLowerCase();
                    bValue = String(b.firstName + ' ' + b.lastName).toLowerCase();
                }
                
                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [items, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return { items: sortedItems, requestSort, sortConfig };
};

// --- Main Admin Dashboard Component ---

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

// Dashboard Tab Component (No changes needed here)
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

    // Line Chart Data - Revenue Over Time (Assuming this is placeholder for now)
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
                            {/* Assuming revenueData is a generic placeholder for all line charts */}
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
                            <h3>Orders by Category</h3>
                            <div className="chart-wrapper">
                                <Bar data={barChartData} options={chartOptions} />
                            </div>
                        </div>

                        <div className="chart-card">
                            <h3>Product Distribution</h3>
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

// --- UPDATED PRODUCTS TAB (with Sorting) ---
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
        size: "",
        quantity: ""
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

    // Apply sorting logic
    const { items: sortedProducts, requestSort, sortConfig } = useSortableData(products, { key: 'productId', direction: 'ascending' });

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
            size: formData.size,
            quantity: parseInt(formData.quantity) || 0
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
                                        size: previousProduct.size,
                                        quantity: previousProduct.quantity
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
                setFormData({ name: "", price: "", category: "", description: "", imageUrl: "", size: "", quantity: "" });
            }
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    const handleEdit = (product) => {
        setPreviousProduct({ ...product });
        setEditingProduct(product);
        setFormData({
            name: product.name || "",
            price: product.price || "",
            category: product.category || "",
            description: product.description || "",
            imageUrl: product.imageUrl || "",
            size: product.size || "",
            quantity: product.quantity !== undefined ? product.quantity : 0
        });
        setShowAddForm(true);
    };

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

    const getSortIndicator = (key) => {
        if (sortConfig.key !== key) return ' ';
        return sortConfig.direction === 'ascending' ? '▲' : '▼';
    };

    if (loading) return <div>Loading products...</div>;

    return (
        <div className="products-tab">
            <div className="tab-header">
                <h2>Products Management</h2>
                <button className="add-btn" onClick={() => {
                    setShowAddForm(true);
                    setEditingProduct(null);
                    setFormData({ name: "", price: "", category: "", description: "", imageUrl: "", size: "", quantity: "" });
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

                            {/* UPDATED: Flex row for Price and Stock Qty */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    type="number"
                                    placeholder="Price"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                    style={{ flex: 1 }}
                                />
                                <input
                                    type="number"
                                    placeholder="Stock Qty"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    required
                                    min="0"
                                    style={{ flex: 1 }}
                                />
                            </div>

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
                            <th onClick={() => requestSort('productId')}>
                                ID {getSortIndicator('productId')}
                            </th>
                            <th onClick={() => requestSort('name')}>
                                Name {getSortIndicator('name')}
                            </th>
                            <th onClick={() => requestSort('price')}>
                                Price {getSortIndicator('price')}
                            </th>
                            <th onClick={() => requestSort('quantity')}>
                                Stock {getSortIndicator('quantity')}
                            </th>
                            <th onClick={() => requestSort('category')}>
                                Category {getSortIndicator('category')}
                            </th>
                            <th onClick={() => requestSort('size')}>
                                Size {getSortIndicator('size')}
                            </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedProducts.map(product => (
                            <tr key={product.productId}>
                                <td>{product.productId}</td>
                                <td>{product.name}</td>
                                <td>₱{product.price?.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                                <td style={{ color: (!product.quantity || product.quantity === 0) ? 'red' : 'inherit', fontWeight: (!product.quantity || product.quantity === 0) ? 'bold' : 'normal' }}>
                                    {product.quantity !== undefined ? product.quantity : '0'}
                                </td>
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

// --- UPDATED ORDERS TAB (with Sorting) ---
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
                // Add calculated fields for sorting
                const ordersWithCalculatedFields = data.map(order => ({
                    ...order,
                    // Pre-calculate total quantity for easy sorting
                    totalQuantity: order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0,
                    // Parse Date to be sortable
                    orderDateValue: new Date(order.orderDate).getTime(),
                    // Flatten user name for sorting
                    userName: `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim(),
                }));
                setOrders(ordersWithCalculatedFields);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    // Use a custom sort function tailored for the orders tab
    const useOrdersSortableData = (items, config = null) => {
        const [sortConfig, setSortConfig] = useState(config);

        const sortedItems = useMemo(() => {
            let sortableItems = [...items];
            if (sortConfig !== null) {
                sortableItems.sort((a, b) => {
                    let aValue = a[sortConfig.key];
                    let bValue = b[sortConfig.key];
                    
                    // Specific sorting logic for orders keys
                    if (sortConfig.key === 'totalAmount' || sortConfig.key === 'totalQuantity' || sortConfig.key === 'orderDateValue') {
                        aValue = aValue || 0;
                        bValue = bValue || 0;
                    } else if (sortConfig.key === 'userName') {
                        aValue = (a.user?.firstName + ' ' + a.user?.lastName).toLowerCase();
                        bValue = (b.user?.firstName + ' ' + b.user?.lastName).toLowerCase();
                    } else if (sortConfig.key === 'orderId') {
                        aValue = parseInt(aValue);
                        bValue = parseInt(bValue);
                    }

                    if (aValue < bValue) {
                        return sortConfig.direction === 'ascending' ? -1 : 1;
                    }
                    if (aValue > bValue) {
                        return sortConfig.direction === 'ascending' ? 1 : -1;
                    }
                    return 0;
                });
            }
            return sortableItems;
        }, [items, sortConfig]);

        const requestSort = (key) => {
            let direction = 'ascending';
            if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
                direction = 'descending';
            }
            setSortConfig({ key, direction });
        };

        return { items: sortedItems, requestSort, sortConfig };
    };

    const { items: sortedOrders, requestSort, sortConfig } = useOrdersSortableData(orders, { key: 'orderDateValue', direction: 'descending' });

    const getSortIndicator = (key) => {
        if (sortConfig.key !== key) return ' ';
        return sortConfig.direction === 'ascending' ? '▲' : '▼';
    };

    if (loading) return <div>Loading orders...</div>;

    return (
        <div className="orders-tab">
            <h2>Orders Management</h2>
            <div className="orders-table">
                <table>
                    <thead>
                        <tr>
                            <th onClick={() => requestSort('orderDateValue')}>
                                Order Date {getSortIndicator('orderDateValue')}
                            </th>
                            <th onClick={() => requestSort('orderId')}>
                                Order ID {getSortIndicator('orderId')}
                            </th>
                            <th onClick={() => requestSort('userName')}>
                                User {getSortIndicator('userName')}
                            </th>
                            <th>Products</th>
                            <th onClick={() => requestSort('totalQuantity')}>
                                Total Qty {getSortIndicator('totalQuantity')}
                            </th>
                            <th onClick={() => requestSort('totalAmount')}>
                                Total Amount {getSortIndicator('totalAmount')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedOrders.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                    No orders found
                                </td>
                            </tr>
                        ) : (
                            sortedOrders.map(order => {
                                const items = order.items || [];

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
                                                                    ₱{item.unitPrice?.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span style={{ color: '#999' }}>No items</span>
                                            )}
                                        </td>
                                        <td><strong>{order.totalQuantity}</strong></td>
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

// --- UPDATED USERS TAB (with Sorting) ---
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
                // Add a combined name for sorting
                const usersWithCombinedName = data.map(user => ({
                    ...user,
                    fullName: `${user.firstName} ${user.lastName}`
                }));
                setUsers(usersWithCombinedName);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    // Apply sorting logic
    const { items: sortedUsers, requestSort, sortConfig } = useSortableData(users, { key: 'fullName', direction: 'ascending' });

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

    const getSortIndicator = (key) => {
        if (sortConfig.key !== key) return ' ';
        return sortConfig.direction === 'ascending' ? '▲' : '▼';
    };

    if (loading) return <div>Loading users...</div>;

    return (
        <div className="users-tab">
            <h2>Users Management</h2>
            <div className="users-table">
                <table>
                    <thead>
                        <tr>
                            <th onClick={() => requestSort('id')}>
                                ID {getSortIndicator('id')}
                            </th>
                            <th onClick={() => requestSort('fullName')}>
                                Name {getSortIndicator('fullName')}
                            </th>
                            <th onClick={() => requestSort('email')}>
                                Email {getSortIndicator('email')}
                            </th>
                            <th onClick={() => requestSort('phone')}>
                                Phone {getSortIndicator('phone')}
                            </th>
                            <th onClick={() => requestSort('role')}>
                                Role {getSortIndicator('role')}
                            </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedUsers.map(user => (
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