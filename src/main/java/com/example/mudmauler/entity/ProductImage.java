package com.example.mudmauler.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "product_images") // Renamed table for clarity (standard naming convention)
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Changed type to Long for consistency

    // --- REPLACED: Raw ProductID with a proper @ManyToOne relationship ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnore // Important to prevent infinite recursion
    private Product product;
    // --------------------------------------------------------------------

    @Column(name = "Image_URL", nullable = false)
    private String imageUrl; // Added a field to store the image URL/path

    @Column(name = "DisplayOrder")
    private Integer displayOrder; // Changed type to Integer for consistency
    
    // --- REMOVED: imageId (It's redundant; the image URL/path is what matters)

    public ProductImage() {}

    // Constructor updated
    public ProductImage(Product product, String imageUrl, Integer displayOrder) {
        this.product = product;
        this.imageUrl = imageUrl;
        this.displayOrder = displayOrder;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
}