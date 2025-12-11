package com.example.mudmauler.controller;

import com.example.mudmauler.entity.User;
import com.example.mudmauler.entity.Order;
import com.example.mudmauler.entity.Product;
import com.example.mudmauler.entity.Notification;
import com.example.mudmauler.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // Helper method to check admin access
    private ResponseEntity<?> checkAdminAccess(String sessionId) {
        if (sessionId == null || sessionId.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("message", "Session required"));
        }
        if (!adminService.isAdminBySession(sessionId)) {
            return ResponseEntity.status(403).body(Map.of("message", "Admin access required"));
        }
        return null;
    }

    //statistics dashboard
    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats(
            @RequestHeader(value = "Session-Id", required = false) String sessionId) {
        ResponseEntity<?> accessCheck = checkAdminAccess(sessionId);
        if (accessCheck != null) return accessCheck;

        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    //user management(view, update role, delete)
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(
            @RequestHeader(value = "Session-Id", required = false) String sessionId) {
        ResponseEntity<?> accessCheck = checkAdminAccess(sessionId);
        if (accessCheck != null) return accessCheck;

        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{userId}/role")
    public ResponseEntity<?> updateUserRole(
            @RequestHeader(value = "Session-Id", required = false) String sessionId,
            @PathVariable Long userId,
            @RequestBody Map<String, String> request) {
        ResponseEntity<?> accessCheck = checkAdminAccess(sessionId);
        if (accessCheck != null) return accessCheck;

        try {
            String role = request.get("role");
            User user = adminService.updateUserRole(userId, role);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(
            @RequestHeader(value = "Session-Id", required = false) String sessionId,
            @PathVariable Long userId) {
        ResponseEntity<?> accessCheck = checkAdminAccess(sessionId);
        if (accessCheck != null) return accessCheck;

        try {
            User deletedUser = adminService.deleteUser(userId);
            return ResponseEntity.ok(Map.of(
                    "message", "User deleted successfully",
                    "deletedUser", deletedUser
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/users/restore")
    public ResponseEntity<?> restoreUser(
            @RequestHeader(value = "Session-Id", required = false) String sessionId,
            @RequestBody User user) {
        ResponseEntity<?> accessCheck = checkAdminAccess(sessionId);
        if (accessCheck != null) return accessCheck;

        try {
            User restored = adminService.restoreUser(user);
            return ResponseEntity.ok(restored);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    //product management(create, update, delete)
    @PostMapping("/products")
    public ResponseEntity<?> createProduct(
            @RequestHeader(value = "Session-Id", required = false) String sessionId,
            @RequestBody Product product) {
        ResponseEntity<?> accessCheck = checkAdminAccess(sessionId);
        if (accessCheck != null) return accessCheck;

        try {
            Product created = adminService.createProduct(product);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/products/{productId}")
    public ResponseEntity<?> updateProduct(
            @RequestHeader(value = "Session-Id", required = false) String sessionId,
            @PathVariable Long productId,
            @RequestBody Product product) {
        ResponseEntity<?> accessCheck = checkAdminAccess(sessionId);
        if (accessCheck != null) return accessCheck;

        try {
            Product updated = adminService.updateProduct(productId, product);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/products/{productId}")
    public ResponseEntity<?> deleteProduct(
            @RequestHeader(value = "Session-Id", required = false) String sessionId,
            @PathVariable Long productId) {
        ResponseEntity<?> accessCheck = checkAdminAccess(sessionId);
        if (accessCheck != null) return accessCheck;

        try {
            Product deletedProduct = adminService.deleteProduct(productId);
            return ResponseEntity.ok(Map.of(
                    "message", "Product deleted successfully",
                    "deletedProduct", deletedProduct
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/products/restore")
    public ResponseEntity<?> restoreProduct(
            @RequestHeader(value = "Session-Id", required = false) String sessionId,
            @RequestBody Product product) {
        ResponseEntity<?> accessCheck = checkAdminAccess(sessionId);
        if (accessCheck != null) return accessCheck;

        try {
            Product restored = adminService.createProduct(product);
            return ResponseEntity.ok(restored);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    //order management(view, update status, delete)
    @GetMapping("/orders")
    public ResponseEntity<?> getAllOrders(
            @RequestHeader(value = "Session-Id", required = false) String sessionId) {
        ResponseEntity<?> accessCheck = checkAdminAccess(sessionId);
        if (accessCheck != null) return accessCheck;

        List<Order> orders = adminService.getAllOrders();
        List<Map<String, Object>> ordersWithItems = new java.util.ArrayList<>();
        
        for (Order order : orders) {
            Map<String, Object> orderData = new java.util.HashMap<>();
            orderData.put("orderId", order.getOrderId());
            orderData.put("orderDate", order.getOrderDate());
            orderData.put("totalAmount", order.getTotalAmount());
            
            // User info
            if (order.getUser() != null) {
                Map<String, Object> userData = new java.util.HashMap<>();
                userData.put("id", order.getUser().getId());
                userData.put("firstName", order.getUser().getFirstName());
                userData.put("lastName", order.getUser().getLastName());
                userData.put("email", order.getUser().getEmail());
                orderData.put("user", userData);
            }
            
            // Get order items with product details
            List<com.example.mudmauler.entity.OrderItem> items = adminService.getOrderItems(order.getOrderId());
            List<Map<String, Object>> itemsData = new java.util.ArrayList<>();
            
            for (com.example.mudmauler.entity.OrderItem item : items) {
                Map<String, Object> itemData = new java.util.HashMap<>();
                itemData.put("orderItemId", item.getOrderItemId());
                itemData.put("quantity", item.getQuantity());
                itemData.put("unitPrice", item.getUnitPrice());
                itemData.put("totalAmount", item.getTotalAmount());
                
                // Product info
                if (item.getProduct() != null) {
                    Map<String, Object> productData = new java.util.HashMap<>();
                    productData.put("productId", item.getProduct().getProductId());
                    productData.put("name", item.getProduct().getName());
                    productData.put("price", item.getProduct().getPrice());
                    productData.put("category", item.getProduct().getCategory());
                    itemData.put("product", productData);
                }
                
                itemsData.add(itemData);
            }
            
            orderData.put("items", itemsData);
            ordersWithItems.add(orderData);
        }
        
        return ResponseEntity.ok(ordersWithItems);
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<?> getOrderById(
            @RequestHeader(value = "Session-Id", required = false) String sessionId,
            @PathVariable Long orderId) {
        ResponseEntity<?> accessCheck = checkAdminAccess(sessionId);
        if (accessCheck != null) return accessCheck;

        try {
            Order order = adminService.getOrderById(orderId);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    //notification management
    @GetMapping("/notifications")
    public ResponseEntity<?> getNotifications(
            @RequestHeader(value = "Session-Id", required = false) String sessionId) {
        ResponseEntity<?> accessCheck = checkAdminAccess(sessionId);
        if (accessCheck != null) return accessCheck;

        return ResponseEntity.ok(adminService.getNotifications());
    }

    @PostMapping("/notifications")
    public ResponseEntity<?> createNotification(
            @RequestHeader(value = "Session-Id", required = false) String sessionId,
            @RequestBody Map<String, String> request) {
        ResponseEntity<?> accessCheck = checkAdminAccess(sessionId);
        if (accessCheck != null) return accessCheck;

        try {
            String message = request.get("message");
            String type = request.getOrDefault("type", "info");
            Notification notification = adminService.createNotification(message, type);
            return ResponseEntity.ok(notification);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/notifications/{notificationId}/read")
    public ResponseEntity<?> markAsRead(
            @RequestHeader(value = "Session-Id", required = false) String sessionId,
            @PathVariable Long notificationId) {
        ResponseEntity<?> accessCheck = checkAdminAccess(sessionId);
        if (accessCheck != null) return accessCheck;

        try {
            adminService.markNotificationAsRead(notificationId);
            return ResponseEntity.ok(Map.of("message", "Notification marked as read"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/notifications/{notificationId}")
    public ResponseEntity<?> deleteNotification(
            @RequestHeader(value = "Session-Id", required = false) String sessionId,
            @PathVariable Long notificationId) {
        ResponseEntity<?> accessCheck = checkAdminAccess(sessionId);
        if (accessCheck != null) return accessCheck;

        try {
            adminService.deleteNotification(notificationId);
            return ResponseEntity.ok(Map.of("message", "Notification deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}

