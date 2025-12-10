package com.example.mudmauler.controller;

import com.example.mudmauler.entity.Order;
import com.example.mudmauler.entity.OrderItem;
import com.example.mudmauler.service.OrderService;
import com.example.mudmauler.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private SessionService sessionService;

    @PostMapping
    public ResponseEntity<?> createOrder(
            @RequestHeader(value = "Session-Id", required = false) String sessionId,
            @RequestBody CreateOrderRequest request) {
        try {
            if (sessionId == null || sessionId.isEmpty()) {
                return ResponseEntity.status(401).body(Map.of("message", "Session required"));
            }

            Long userId = sessionService.getUserIdBySessionId(sessionId);
            if (userId == null) {
                return ResponseEntity.status(401).body(Map.of("message", "Invalid session"));
            }

            Order order = orderService.createOrder(userId, request.getItems());
            return ResponseEntity.ok(Map.of(
                    "message", "Order created successfully",
                    "orderId", order.getOrderId(),
                    "totalAmount", order.getTotalAmount()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getUserOrders(
            @RequestHeader(value = "Session-Id", required = false) String sessionId) {
        try {
            if (sessionId == null || sessionId.isEmpty()) {
                return ResponseEntity.status(401).body(Map.of("message", "Session required"));
            }

            Long userId = sessionService.getUserIdBySessionId(sessionId);
            if (userId == null) {
                return ResponseEntity.status(401).body(Map.of("message", "Invalid session"));
            }

            List<Order> orders = orderService.getUserOrders(userId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderById(
            @PathVariable Long orderId,
            @RequestHeader(value = "Session-Id", required = false) String sessionId) {
        try {
            if (sessionId == null || sessionId.isEmpty()) {
                return ResponseEntity.status(401).body(Map.of("message", "Session required"));
            }

            Long userId = sessionService.getUserIdBySessionId(sessionId);
            if (userId == null) {
                return ResponseEntity.status(401).body(Map.of("message", "Invalid session"));
            }

            Optional<Order> order = orderService.getOrderById(orderId);
            if (order.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            // Verify order belongs to user
            if (!order.get().getUser().getId().equals(userId)) {
                return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
            }

            List<OrderItem> items = orderService.getOrderItems(orderId);
            return ResponseEntity.ok(Map.of(
                    "order", order.get(),
                    "items", items
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // DTO for order creation
    public static class CreateOrderRequest {
        private List<OrderService.OrderItemRequest> items;

        public List<OrderService.OrderItemRequest> getItems() { return items; }
        public void setItems(List<OrderService.OrderItemRequest> items) { this.items = items; }
    }
}

