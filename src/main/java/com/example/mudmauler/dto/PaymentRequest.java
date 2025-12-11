package com.example.mudmauler.dto;

// Note: No imports from jakarta.validation.constraints needed anymore
// if we only rely on the field existing (which is default behavior).

public class PaymentRequest {
    // @NotNull annotation removed as requested
    private Long orderId;

    // Getters and Setters
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
}