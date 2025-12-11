package com.example.mudmauler.controller;

import com.example.mudmauler.entity.ProductImage;
import com.example.mudmauler.service.ProductImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/images")
public class ProductImageController {

    @Autowired
    private ProductImageService service;

    @GetMapping
    public List<ProductImage> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ProductImage getById(@PathVariable int id) {
        return service.findById(id).orElse(null);
    }

    @PostMapping
    public ProductImage create(@RequestBody ProductImage image) {
        return service.save(image);
    }

    @PutMapping("/{id}")
    public ProductImage update(@PathVariable int id, @RequestBody ProductImage updated) {
        Optional<ProductImage> optional = service.findById(id);
        if (optional.isPresent()) {
            ProductImage existing = optional.get();
            existing.setProduct(updated.getProduct());
            existing.setImageUrl(updated.getImageUrl());
            existing.setDisplayOrder(updated.getDisplayOrder());
            return service.save(existing);
        } else {
            return null;
        }
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        service.deleteById(id);
    }
}
