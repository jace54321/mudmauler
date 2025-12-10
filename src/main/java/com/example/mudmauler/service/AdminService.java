package com.example.mudmauler.service;

import com.example.mudmauler.entity.User;
import com.example.mudmauler.entity.Order;
import com.example.mudmauler.entity.Product;
import com.example.mudmauler.repository.UserRepository;
import com.example.mudmauler.repository.OrderRepository;
import com.example.mudmauler.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

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
        
        stats.put("totalUsers", totalUsers);
        stats.put("totalOrders", totalOrders);
        stats.put("totalProducts", totalProducts);
        stats.put("totalRevenue", totalRevenue);
        
        return stats;
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

    public void deleteUser(Long userId) throws Exception {
        if (!userRepository.existsById(userId)) {
            throw new Exception("User not found");
        }
        userRepository.deleteById(userId);
    }

    // Product Management (already exists in ProductService, but adding admin-specific methods)
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long productId, Product product) throws Exception {
        Optional<Product> existingOpt = productRepository.findById(productId);
        if (existingOpt.isEmpty()) {
            throw new Exception("Product not found");
        }
        product.setProductId(productId);
        return productRepository.save(product);
    }

    public void deleteProduct(Long productId) throws Exception {
        if (!productRepository.existsById(productId)) {
            throw new Exception("Product not found");
        }
        productRepository.deleteById(productId);
    }

    // Order Management
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long orderId) throws Exception {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            throw new Exception("Order not found");
        }
        return orderOpt.get();
    }
}

