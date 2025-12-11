package com.example.mudmauler.service;

import com.example.mudmauler.entity.Order;
import com.example.mudmauler.entity.OrderItem;
import com.example.mudmauler.entity.Product;
import com.example.mudmauler.entity.User;
import com.example.mudmauler.entity.Notification;
import com.example.mudmauler.repository.OrderRepository;
import com.example.mudmauler.repository.OrderItemRepository;
import com.example.mudmauler.repository.ProductRepository;
import com.example.mudmauler.repository.UserRepository;
import com.example.mudmauler.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Transactional
    public Order createOrder(Long userId, List<OrderItemRequest> items) throws Exception {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new Exception("User not found");
        }

        User user = userOpt.get();
        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());

        float totalAmount = 0.0f;

        // Loop 1: Validation, Calculation, and STOCK DEDUCTION
        for (OrderItemRequest itemRequest : items) {
            Optional<Product> productOpt = productRepository.findById(itemRequest.getProductId());
            if (productOpt.isEmpty()) {
                throw new Exception("Product not found: " + itemRequest.getProductId());
            }
            Product product = productOpt.get();

            // --- CHANGED: Using getQuantity() instead of getStock() ---
            if (product.getQuantity() < itemRequest.getQuantity()) {
                throw new Exception("Insufficient stock for product: " + product.getName() + " (Available: " + product.getQuantity() + ")");
            }

            // --- CHANGED: Using setQuantity() instead of setStock() ---
            product.setQuantity(product.getQuantity() - itemRequest.getQuantity());
            productRepository.save(product);

            float itemTotal = product.getPrice() * itemRequest.getQuantity();
            totalAmount += itemTotal;
        }

        order.setTotalAmount(totalAmount);
        Order savedOrder = orderRepository.save(order);

        // Create notification for new order
        Notification notification = new Notification();
        notification.setMessage("New order placed: Order #" + savedOrder.getOrderId() + " - ₱" + String.format("%.2f", totalAmount) + " by " + user.getFirstName() + " " + user.getLastName());
        notification.setType("success");
        notification.setCreatedAt(LocalDateTime.now());
        notification.setRead(false);
        notificationRepository.save(notification);

        // Loop 2: Create Order Items
        for (OrderItemRequest itemRequest : items) {
            Product product = productRepository.findById(itemRequest.getProductId()).get();

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setUnitPrice(product.getPrice());
            orderItem.setTotalAmount(product.getPrice() * itemRequest.getQuantity());
            // The method getImageId() is undefined for the type Product, so this line is removed or fixed.
            // If Product has an 'image' property or similar, fetch accordingly. 
            // Example: orderItem.setImageId(product.getImage() != null ? product.getImage().getId() : null);
            orderItemRepository.save(orderItem);
        }

        return savedOrder;
    }

    public List<Order> getUserOrders(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return List.of();
        }
        return orderRepository.findByUserOrderByOrderDateDesc(userOpt.get());
    }

    public Optional<Order> getOrderById(Long orderId) {
        return orderRepository.findById(orderId);
    }

    public List<OrderItem> getOrderItems(Long orderId) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            return List.of();
        }
        return orderItemRepository.findByOrder(orderOpt.get());
    }

    // DTO for order creation
    public static class OrderItemRequest {
        private Long productId;
        private Integer quantity;

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }
}