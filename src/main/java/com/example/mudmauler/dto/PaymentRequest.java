package com.example.mudmauler.dto;



public class PaymentRequest {
    // @NotNull annotation removed as requested
    private Long orderId;

    // Getters and Setters
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
}