package com.example.mudmauler.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ProductDescription")
public class ProductDescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "ProductID", nullable = false)
    private int productId;

    @Column(name = "DescriptionID", nullable = false)
    private int descriptionId;

    public ProductDescription() {}

    public ProductDescription(int productId, int descriptionId) {
        this.productId = productId;
        this.descriptionId = descriptionId;
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

    public int getDescriptionId() {
        return descriptionId;
    }

    public void setDescriptionId(int descriptionId) {
        this.descriptionId = descriptionId;
    }
}
