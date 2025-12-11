package com.example.mudmauler.service;

import com.example.mudmauler.entity.User;
import com.example.mudmauler.entity.Order;
import com.example.mudmauler.entity.Product;
import com.example.mudmauler.entity.OrderItem;
import com.example.mudmauler.entity.Notification;
import com.example.mudmauler.repository.UserRepository;
import com.example.mudmauler.repository.OrderRepository;
import com.example.mudmauler.repository.ProductRepository;
import com.example.mudmauler.repository.OrderItemRepository;
import com.example.mudmauler.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import java.util.ArrayList;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SessionService sessionService;

    public boolean isAdmin(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        return userOpt.isPresent() && "ADMIN".equals(userOpt.get().getRole());
    }

    public boolean isAdminBySession(String sessionId) {
        Long userId = sessionService.getUserIdBySessionId(sessionId);
        return userId != null && isAdmin(userId);
    }

    // Dashboard Statistics
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalUsers = userRepository.count();
        long totalOrders = orderRepository.count();
        long totalProducts = productRepository.count();
        
        // Calculate total revenue
        List<Order> orders = orderRepository.findAll();
        double totalRevenue = orders.stream()
                .mapToDouble(order -> order.getTotalAmount() != null ? order.getTotalAmount() : 0.0)
                .sum();
        
        // Calculate previous period stats for percentage changes
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime weekAgo = now.minusDays(7);
        
        long previousUsers = userRepository.findAll().stream()
                .filter(user -> {
                    // For demo, we'll simulate previous period data
                    // In real app, you'd track creation dates
                    return true; // Placeholder
                })
                .count();
        
        long previousOrders = orderRepository.findAll().stream()
                .filter(order -> order.getOrderDate() != null && order.getOrderDate().isBefore(weekAgo))
                .count();
        
        double previousRevenue = orders.stream()
                .filter(order -> order.getOrderDate() != null && order.getOrderDate().isBefore(weekAgo))
                .mapToDouble(order -> order.getTotalAmount() != null ? order.getTotalAmount() : 0.0)
                .sum();
        
        // Calculate percentage changes
        double usersChange = previousUsers > 0 ? ((totalUsers - previousUsers) / (double) previousUsers) * 100 : 11.01;
        double ordersChange = previousOrders > 0 ? ((totalOrders - previousOrders) / (double) previousOrders) * 100 : -0.03;
        double productsChange = 15.03; // Simulated
        double revenueChange = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 6.08;
        
        stats.put("totalUsers", totalUsers);
        stats.put("totalOrders", totalOrders);
        stats.put("totalProducts", totalProducts);
        stats.put("totalRevenue", totalRevenue);
        stats.put("usersChange", Math.round(usersChange * 100.0) / 100.0);
        stats.put("ordersChange", Math.round(ordersChange * 100.0) / 100.0);
        stats.put("productsChange", productsChange);
        stats.put("revenueChange", Math.round(revenueChange * 100.0) / 100.0);
        
        // Chart data
        stats.put("revenueOverTime", getRevenueOverTime(orders));
        stats.put("ordersByCategory", getOrdersByCategory());
        stats.put("productDistribution", getProductDistribution());
        
        return stats;
    }

    // Line Chart: Revenue over time (last 7 days)
    private List<Map<String, Object>> getRevenueOverTime(List<Order> orders) {
        List<Map<String, Object>> data = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        
        for (int i = 6; i >= 0; i--) {
            LocalDateTime date = now.minusDays(i);
            String dateLabel = date.format(DateTimeFormatter.ofPattern("MMM dd"));
            
            double dailyRevenue = orders.stream()
                    .filter(order -> {
                        LocalDateTime orderDate = order.getOrderDate();
                        return orderDate != null &&
                               orderDate.toLocalDate().equals(date.toLocalDate());
                    })
                    .mapToDouble(order -> order.getTotalAmount() != null ? order.getTotalAmount() : 0.0)
                    .sum();
            
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("date", dateLabel);
            dayData.put("revenue", dailyRevenue);
            data.add(dayData);
        }
        
        return data;
    }

    // Bar Chart: Orders by category
    private List<Map<String, Object>> getOrdersByCategory() {
        List<OrderItem> orderItems = orderItemRepository.findAll();
        Map<String, Integer> categoryCount = new HashMap<>();
        
        for (OrderItem item : orderItems) {
            Product product = item.getProduct();
            if (product != null && product.getCategory() != null) {
                String category = product.getCategory();
                categoryCount.put(category, categoryCount.getOrDefault(category, 0) + item.getQuantity());
            }
        }
        
        List<Map<String, Object>> data = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : categoryCount.entrySet()) {
            Map<String, Object> categoryData = new HashMap<>();
            categoryData.put("category", entry.getKey());
            categoryData.put("count", entry.getValue());
            data.add(categoryData);
        }
        
        return data;
    }

    // Pie Chart: Product distribution by category
    private List<Map<String, Object>> getProductDistribution() {
        List<Product> products = productRepository.findAll();
        Map<String, Integer> categoryCount = new HashMap<>();
        
        for (Product product : products) {
            String category = product.getCategory() != null ? product.getCategory() : "Uncategorized";
            categoryCount.put(category, categoryCount.getOrDefault(category, 0) + 1);
        }
        
        List<Map<String, Object>> data = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : categoryCount.entrySet()) {
            Map<String, Object> categoryData = new HashMap<>();
            categoryData.put("category", entry.getKey());
            categoryData.put("count", entry.getValue());
            data.add(categoryData);
        }
        
        return data;
    }

    // User Management
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUserRole(Long userId, String role) throws Exception {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new Exception("User not found");
        }
        User user = userOpt.get();
        user.setRole(role);
        return userRepository.save(user);
    }

    @Transactional
    public User deleteUser(Long userId) throws Exception {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new Exception("User not found");
        }
        
        User user = userOpt.get();
        
        // Check if user is admin - prevent deleting admin users
        if ("ADMIN".equals(user.getRole())) {
            throw new Exception("Cannot delete admin users");
        }
        
        // Delete related orders first (to handle foreign key constraints)
        List<Order> userOrders = orderRepository.findByUser(user);
        for (Order order : userOrders) {
            // Delete order items first
            List<OrderItem> orderItems = orderItemRepository.findByOrder(order);
            orderItemRepository.deleteAll(orderItems);
            // Then delete the order
            orderRepository.delete(order);
        }
        
        // Delete user sessions
        sessionService.deleteSessionsByUserId(userId);
        
        // Store user info for notification
        String userName = user.getFirstName() + " " + user.getLastName();
        String userEmail = user.getEmail();
        
        // Finally delete the user
        userRepository.delete(user);
        
        // Create notification
        Notification notification = new Notification();
        notification.setMessage("User deleted: " + userName + " (" + userEmail + ")");
        notification.setType("warning");
        notification.setCreatedAt(LocalDateTime.now());
        notification.setRead(false);
        notificationRepository.save(notification);
        
        // Return deleted user info for undo (we'll need to recreate it)
        User deletedUser = new User();
        deletedUser.setId(userId);
        deletedUser.setFirstName(user.getFirstName());
        deletedUser.setLastName(user.getLastName());
        deletedUser.setEmail(user.getEmail());
        deletedUser.setPhone(user.getPhone());
        deletedUser.setAddress(user.getAddress());
        deletedUser.setPassword(user.getPassword());
        deletedUser.setRole(user.getRole());
        
        return deletedUser;
    }

    public User restoreUser(User user) throws Exception {
        // Check if email already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new Exception("Email is already registered");
        }
        
        User restored = userRepository.save(user);
        
        // Create notification
        Notification notification = new Notification();
        notification.setMessage("User restored: " + restored.getFirstName() + " " + restored.getLastName() + " (" + restored.getEmail() + ")");
        notification.setType("success");
        notification.setCreatedAt(LocalDateTime.now());
        notification.setRead(false);
        notificationRepository.save(notification);
        
        return restored;
    }

    // Product Management (already exists in ProductService, but adding admin-specific methods)
    public Product createProduct(Product product) {
        Product saved = productRepository.save(product);
        
        // Create notification
        Notification notification = new Notification();
        notification.setMessage("New product created: " + saved.getName());
        notification.setType("success");
        notification.setCreatedAt(LocalDateTime.now());
        notification.setRead(false);
        notificationRepository.save(notification);
        
        return saved;
    }

    public Product updateProduct(Long productId, Product product) throws Exception {
        Optional<Product> existingOpt = productRepository.findById(productId);
        if (existingOpt.isEmpty()) {
            throw new Exception("Product not found");
        }
        Product existing = existingOpt.get();
        String oldName = existing.getName();
        
        product.setProductId(productId);
        Product updated = productRepository.save(product);
        
        // Create notification
        Notification notification = new Notification();
        notification.setMessage("Product updated: " + oldName + " → " + updated.getName());
        notification.setType("info");
        notification.setCreatedAt(LocalDateTime.now());
        notification.setRead(false);
        notificationRepository.save(notification);
        
        return updated;
    }

    public Product deleteProduct(Long productId) throws Exception {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            throw new Exception("Product not found");
        }
        Product product = productOpt.get();
        String productName = product.getName();
        
        productRepository.deleteById(productId);
        
        // Create notification
        Notification notification = new Notification();
        notification.setMessage("Product deleted: " + productName);
        notification.setType("warning");
        notification.setCreatedAt(LocalDateTime.now());
        notification.setRead(false);
        notificationRepository.save(notification);
        
        return product; // Return deleted product for undo functionality
    }

    // Order Management
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<OrderItem> getOrderItems(Long orderId) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            return List.of();
        }
        return orderItemRepository.findByOrder(orderOpt.get());
    }

    public Order getOrderById(Long orderId) throws Exception {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            throw new Exception("Order not found");
        }
        return orderOpt.get();
    }

    // Notification Management
    public List<Notification> getNotifications() {
        return notificationRepository.findAllByOrderByCreatedAtDesc();
    }

    public Notification createNotification(String message, String type) {
        Notification notification = new Notification();
        notification.setMessage(message);
        notification.setType(type);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setRead(false);
        return notificationRepository.save(notification);
    }

    public void markNotificationAsRead(Long notificationId) {
        Optional<Notification> notificationOpt = notificationRepository.findById(notificationId);
        if (notificationOpt.isPresent()) {
            Notification notification = notificationOpt.get();
            notification.setRead(true);
            notificationRepository.save(notification);
        }
    }

    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }
}

