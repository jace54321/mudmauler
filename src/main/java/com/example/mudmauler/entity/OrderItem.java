package com.example.mudmauler.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "order_items")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderItemId;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonIgnore
    private Order order;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @Column
    private Integer imageId;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Float unitPrice;

    @Column(nullable = false)
    private Float totalAmount;

    // Getters and setters
    public Long getOrderItemId() { return orderItemId; }
    public void setOrderItemId(Long orderItemId) { this.orderItemId = orderItemId; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public Integer getImageId() { return imageId; }
    public void setImageId(Integer imageId) { this.imageId = imageId; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Float getUnitPrice() { return unitPrice; }
    public void setUnitPrice(Float unitPrice) { this.unitPrice = unitPrice; }

    public Float getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Float totalAmount) { this.totalAmount = totalAmount; }
}
