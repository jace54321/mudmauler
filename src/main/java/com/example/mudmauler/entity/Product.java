package com.example.mudmauler.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore; // Import this to prevent infinite recursion
import java.util.List;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    @Column(nullable = false)
    private String name;

    @Column
    private String descriptionId;

    @Column
    private Integer imageId;

    @Column
    private String size;

    @Column(nullable = false)
    private Float price;

    @Column
    private String category;

    @Column
    private String imageUrl;

    @Column(length = 1000)
    private String description;

    // --- THE FIX IS HERE ---
    // This connects the Product to the OrderItems table.
    // cascade = CascadeType.ALL means: "If I delete this Product, delete the connection to OrderItems too."
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    @JsonIgnore // Important: Prevents your API from trying to load all orders when you just want product info
    private List<OrderItem> orderItems;
    // -----------------------

    // Getters and setters
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescriptionId() { return descriptionId; }
    public void setDescriptionId(String descriptionId) { this.descriptionId = descriptionId; }

    public Integer getImageId() { return imageId; }
    public void setImageId(Integer imageId) { this.imageId = imageId; }

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }

    public Float getPrice() { return price; }
    public void setPrice(Float price) { this.price = price; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    // Getter and Setter for the new list (required by JPA)
    public List<OrderItem> getOrderItems() { return orderItems; }
    public void setOrderItems(List<OrderItem> orderItems) { this.orderItems = orderItems; }
}