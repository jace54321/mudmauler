package com.example.mudmauler.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    @Column(nullable = false)
    private String name;

    @Column
    private String descriptionId; // FK for description table

    @Column
    private Integer imageId; // FK for image table

    @Column
    private String size;

    @Column(nullable = false)
    private Float price;

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
}
