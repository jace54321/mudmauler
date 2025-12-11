package com.example.mudmauler.service;

import com.example.mudmauler.entity.*;
import com.example.mudmauler.repository.*;
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

    // --- NEW: Inject Payment Repository ---
    @Autowired
    private PaymentRepository paymentRepository;

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

        // --- LOOP 1: Validate Stock, Deduct Quantity, Calculate Total ---
        for (OrderItemRequest itemRequest : items) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new Exception("Product not found: " + itemRequest.getProductId()));

            // Check if enough quantity exists
            if (product.getQuantity() < itemRequest.getQuantity()) {
                throw new Exception("Insufficient stock for: " + product.getName() +
                        " (Available: " + product.getQuantity() + ")");
            }

            // Deduct the quantity
            product.setQuantity(product.getQuantity() - itemRequest.getQuantity());
            // Save the updated product stock immediately
            productRepository.save(product);

            float itemTotal = product.getPrice() * itemRequest.getQuantity();
            totalAmount += itemTotal;
        }

        // Set total and save Order to generate the ID
        order.setTotalAmount(totalAmount);
        Order savedOrder = orderRepository.save(order);

        // --- NEW: Save Payment Record ---
        Payment payment = new Payment();
        payment.setOrder(savedOrder);             // Links to the Order ID just generated
        payment.setAmount(totalAmount);           // Sets the total amount
        payment.setPaymentDate(LocalDateTime.now()); // Sets the current timestamp
        paymentRepository.save(payment);          // Saves to the 'payments' table

        // --- Create Notification ---
        Notification notification = new Notification();
        notification.setMessage("New order placed: Order #" + savedOrder.getOrderId() +
                " - ₱" + String.format("%.2f", totalAmount) +
                " by " + user.getFirstName() + " " + user.getLastName());
        notification.setType("success");
        notification.setCreatedAt(LocalDateTime.now());
        notification.setRead(false);
        notificationRepository.save(notification);

        // --- LOOP 2: Create Order Items ---
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