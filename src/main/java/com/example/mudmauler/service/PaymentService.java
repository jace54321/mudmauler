package com.example.mudmauler.service;

import com.example.mudmauler.dto.PaymentRequest;
import com.example.mudmauler.entity.Order;
import com.example.mudmauler.entity.Payment;
import com.example.mudmauler.repository.OrderRepository;
import com.example.mudmauler.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    @Autowired
    public PaymentService(PaymentRepository paymentRepository, OrderRepository orderRepository) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
    }

    @Transactional
    public Payment createPayment(PaymentRequest request) {
        // 1. Safety Check for Order ID (since validation was removed from DTO)
        if (request.getOrderId() == null) {
            throw new RuntimeException("Order ID cannot be null for payment processing.");
        }

        // 2. Find the associated Order
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + request.getOrderId()));

        // 3. Create the new Payment entity
        Payment payment = new Payment();
        // This is where the connection to the 'order_id' column happens via the Order entity object
        payment.setOrder(order);

        // Use the totalAmount from the Order entity
        payment.setAmount(order.getTotalAmount());

        payment.setPaymentDate(LocalDateTime.now());

        // 4. Save the payment
        return paymentRepository.save(payment);
    }
}