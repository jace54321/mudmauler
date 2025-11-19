package com.example.mudmauler.service;

import com.example.mudmauler.entity.ProductImage;
import com.example.mudmauler.repository.ProductImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductImageService {

    @Autowired
    private ProductImageRepository repository;

    public List<ProductImage> findAll() {
        return repository.findAll();
    }

    public Optional<ProductImage> findById(int id) {
        return repository.findById(id);
    }

    public ProductImage save(ProductImage image) {
        return repository.save(image);
    }

    public void deleteById(int id) {
        repository.deleteById(id);
    }
}
