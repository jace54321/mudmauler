package com.example.mudmauler.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    @Column(nullable = false)
    private String name;

    // --- REMOVED: descriptionId (Assuming the long description field is sufficient)
    // --- REMOVED: imageId (Now handled by the 'ProductImage' relationship)

    @Column
    private String size;

    @Column(nullable = false)
    private Float price;

    @Column
    private String category;

    // Kept as a single convenient image URL, although ProductImage can store multiples.
    // Consider using the first image from the 'images' list instead if using multiple images.
    @Column
    private String imageUrl;

    @Column(length = 1000)
    private String description;

    @Column(columnDefinition = "integer default 0")
    private Integer quantity;

    // --- NEW: Proper relationship for multiple images ---
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("displayOrder ASC") // Optional: Ensures images are returned in a specific order
    @JsonIgnore // Prevent infinite recursion in JSON serialization
    private List<ProductImage> images;
    // ----------------------------------------------------

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<OrderItem> orderItems;

    // Getters and setters
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    // public String getDescriptionId() { return descriptionId; } // Removed getter/setter
    // public void setDescriptionId(String descriptionId) { this.descriptionId = descriptionId; } // Removed getter/setter

    // public Integer getImageId() { return imageId; } // Removed getter/setter
    // public void setImageId(Integer imageId) { this.imageId = imageId; } // Removed getter/setter

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

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public List<OrderItem> getOrderItems() { return orderItems; }
    public void setOrderItems(List<OrderItem> orderItems) { this.orderItems = orderItems; }

    // --- NEW GETTER AND SETTER FOR IMAGES LIST ---
    public List<ProductImage> getImages() { return images; }
    public void setImages(List<ProductImage> images) { this.images = images; }
    // ---------------------------------------------
}