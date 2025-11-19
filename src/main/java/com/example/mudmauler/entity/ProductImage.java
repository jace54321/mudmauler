package com.example.mudmauler.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ProductImage")
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "ProductID", nullable = false)
    private int productId;

    @Column(name = "ImageID", nullable = false)
    private int imageId;

    @Column(name = "DisplayOrder")
    private int displayOrder;

    public ProductImage() {}

    public ProductImage(int productId, int imageId, int displayOrder) {
        this.productId = productId;
        this.imageId = imageId;
        this.displayOrder = displayOrder;
    }

    public int getId() {
        return id;
    }

    public int getProductId() {
        return productId;
    }

    public void setProductId(int productId) {
        this.productId = productId;
    }

    public int getImageId() {
        return imageId;
    }

    public void setImageId(int imageId) {
        this.imageId = imageId;
    }

    public int getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(int displayOrder) {
        this.displayOrder = displayOrder;
    }
}
