package com.example.mudmauler.controller;

import com.example.mudmauler.entity.User;
import com.example.mudmauler.entity.Order;
import com.example.mudmauler.entity.Product;
import com.example.mudmauler.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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

    // -------------------------
    // DASHBOARD STATISTICS
    // -------------------------
    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats(
            @RequestHeader(value = "Session-Id", required = false) String sessionId) {
        ResponseEntity<?> accessCheck = checkAdminAccess(sessionId);
        if (accessCheck != null) return accessCheck;

        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    // -------------------------
    // USER MANAGEMENT
    // -------------------------
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
            adminService.deleteUser(userId);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // -------------------------
    // PRODUCT MANAGEMENT
    // -------------------------
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
            adminService.deleteProduct(productId);
            return ResponseEntity.ok(Map.of("message", "Product deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // -------------------------
    // ORDER MANAGEMENT
    // -------------------------
    @GetMapping("/orders")
    public ResponseEntity<?> getAllOrders(
            @RequestHeader(value = "Session-Id", required = false) String sessionId) {
        ResponseEntity<?> accessCheck = checkAdminAccess(sessionId);
        if (accessCheck != null) return accessCheck;

        return ResponseEntity.ok(adminService.getAllOrders());
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
}

